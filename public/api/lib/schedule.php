<?php

declare(strict_types=1);

function loadServiceConfig(): array
{
    static $config = null;
    if ($config !== null) {
        return $config;
    }

    $path = __DIR__ . '/../service-config.json';
    $raw = file_get_contents($path);
    $decoded = json_decode($raw ?: '', true);
    if (!is_array($decoded)) {
        throw new RuntimeException('Не удалось загрузить service-config.json');
    }

    $config = $decoded;
    return $config;
}

function getDb(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dir = __DIR__ . '/../data';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }

    $pdo = new PDO('sqlite:' . $dir . '/bookings.db');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec('PRAGMA foreign_keys = ON');

    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT,
            phone TEXT NOT NULL,
            master_id TEXT NOT NULL DEFAULT "",
            master_name TEXT NOT NULL DEFAULT "",
            service TEXT NOT NULL,
            service_label TEXT NOT NULL,
            duration_minutes INTEGER NOT NULL,
            start_at TEXT NOT NULL,
            end_at TEXT NOT NULL,
            message TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )'
    );

    migrateBookingsTable($pdo);

    $pdo->exec('CREATE INDEX IF NOT EXISTS idx_bookings_start ON bookings(start_at)');
    $pdo->exec('CREATE INDEX IF NOT EXISTS idx_bookings_end ON bookings(end_at)');
    $pdo->exec('CREATE INDEX IF NOT EXISTS idx_bookings_master ON bookings(master_id)');

    return $pdo;
}

function migrateBookingsTable(PDO $pdo): void
{
    $columns = $pdo->query('PRAGMA table_info(bookings)')->fetchAll(PDO::FETCH_ASSOC);
    $names = array_column($columns, 'name');

    if (!in_array('master_id', $names, true)) {
        $pdo->exec('ALTER TABLE bookings ADD COLUMN master_id TEXT NOT NULL DEFAULT ""');
    }
    if (!in_array('master_name', $names, true)) {
        $pdo->exec('ALTER TABLE bookings ADD COLUMN master_name TEXT NOT NULL DEFAULT ""');
    }
}

function getTimezone(): DateTimeZone
{
    $config = loadServiceConfig();
    return new DateTimeZone($config['timezone'] ?? 'Europe/Moscow');
}

function dayKeyFromDate(DateTimeImmutable $date): string
{
    $map = [
        1 => 'monday',
        2 => 'tuesday',
        3 => 'wednesday',
        4 => 'thursday',
        5 => 'friday',
        6 => 'saturday',
        7 => 'sunday',
    ];

    return $map[(int) $date->format('N')];
}

function getMasterMeta(string $masterId): ?array
{
    $config = loadServiceConfig();
    $masters = $config['masters'] ?? [];
    if (!isset($masters[$masterId]) || !is_array($masters[$masterId])) {
        return null;
    }

    return $masters[$masterId];
}

function getMasterServiceIds(string $masterId): array
{
    $master = getMasterMeta($masterId);
    if ($master === null) {
        return [];
    }

    $ids = [];
    foreach ($master['serviceGroups'] ?? [] as $group) {
        foreach ($group['services'] ?? [] as $serviceId) {
            $ids[] = (string) $serviceId;
        }
    }

    return array_values(array_unique($ids));
}

function masterOffersService(string $masterId, string $serviceId): bool
{
    return in_array($serviceId, getMasterServiceIds($masterId), true);
}

function getServiceMeta(string $service): ?array
{
    $config = loadServiceConfig();
    $services = $config['services'] ?? [];
    if (!isset($services[$service]) || !is_array($services[$service])) {
        return null;
    }

    return $services[$service];
}

function getBookingConfig(): array
{
    $config = loadServiceConfig();
    $masters = [];

    foreach ($config['masters'] ?? [] as $masterId => $master) {
        $groups = [];
        foreach ($master['serviceGroups'] ?? [] as $group) {
            $options = [];
            foreach ($group['services'] ?? [] as $serviceId) {
                $serviceMeta = getServiceMeta((string) $serviceId);
                if ($serviceMeta === null) {
                    continue;
                }
                $options[] = [
                    'value' => (string) $serviceId,
                    'label' => (string) $serviceMeta['label'],
                    'durationMinutes' => (int) $serviceMeta['durationMinutes'],
                ];
            }
            if ($options !== []) {
                $groups[] = [
                    'title' => (string) ($group['title'] ?? 'Услуги'),
                    'options' => $options,
                ];
            }
        }

        $masters[] = [
            'id' => (string) $masterId,
            'name' => (string) ($master['name'] ?? $masterId),
            'role' => (string) ($master['role'] ?? ''),
            'serviceGroups' => $groups,
        ];
    }

    return ['masters' => $masters];
}

function parseDateOnly(string $date): DateTimeImmutable
{
    $dt = DateTimeImmutable::createFromFormat('!Y-m-d', $date, getTimezone());
    if (!$dt || $dt->format('Y-m-d') !== $date) {
        throw new InvalidArgumentException('Некорректная дата.');
    }

    return $dt;
}

function parseTimeOnly(string $time): array
{
    if (!preg_match('/^(\d{2}):(\d{2})$/', $time, $matches)) {
        throw new InvalidArgumentException('Некорректное время.');
    }

    return [(int) $matches[1], (int) $matches[2]];
}

function getBusinessWindow(DateTimeImmutable $date, string $masterId): ?array
{
    $config = loadServiceConfig();
    $dayKey = dayKeyFromDate($date);
    $master = getMasterMeta($masterId);
    $hours = $master['schedule'][$dayKey] ?? $config['businessHours'][$dayKey] ?? null;

    if (!is_array($hours) || empty($hours['open']) || empty($hours['close'])) {
        return null;
    }

    [$openH, $openM] = parseTimeOnly($hours['open']);
    [$closeH, $closeM] = parseTimeOnly($hours['close']);

    $open = $date->setTime($openH, $openM);
    $close = $date->setTime($closeH, $closeM);

    if ($close <= $open) {
        return null;
    }

    return ['open' => $open, 'close' => $close];
}

function intervalsOverlap(DateTimeImmutable $startA, DateTimeImmutable $endA, DateTimeImmutable $startB, DateTimeImmutable $endB): bool
{
    return $startA < $endB && $endA > $startB;
}

function getBookingsForDate(DateTimeImmutable $date, string $masterId): array
{
    $pdo = getDb();
    $dayStart = $date->setTime(0, 0)->format('c');
    $dayEnd = $date->setTime(23, 59, 59)->format('c');

    $stmt = $pdo->prepare(
        'SELECT start_at, end_at FROM bookings
         WHERE master_id = :master_id
           AND start_at < :day_end AND end_at > :day_start
         ORDER BY start_at ASC'
    );
    $stmt->execute([
        ':master_id' => $masterId,
        ':day_start' => $dayStart,
        ':day_end' => $dayEnd,
    ]);

    $bookings = [];
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $bookings[] = [
            'start' => new DateTimeImmutable($row['start_at']),
            'end' => new DateTimeImmutable($row['end_at']),
        ];
    }

    return $bookings;
}

function hasOverlap(DateTimeImmutable $start, DateTimeImmutable $end, array $existing): bool
{
    foreach ($existing as $booking) {
        if (intervalsOverlap($start, $end, $booking['start'], $booking['end'])) {
            return true;
        }
    }

    return false;
}

function formatDurationLabel(int $minutes): string
{
    $hours = intdiv($minutes, 60);
    $mins = $minutes % 60;

    if ($hours > 0 && $mins > 0) {
        return "{$hours} ч {$mins} мин";
    }
    if ($hours > 0) {
        return "{$hours} ч";
    }

    return "{$mins} мин";
}

function getAvailableSlots(string $date, string $service, string $masterId): array
{
    $master = getMasterMeta($masterId);
    if ($master === null) {
        throw new InvalidArgumentException('Выберите мастера.');
    }

    $serviceMeta = getServiceMeta($service);
    if ($serviceMeta === null || !masterOffersService($masterId, $service)) {
        throw new InvalidArgumentException('Эта услуга недоступна у выбранного мастера.');
    }

    $dateObj = parseDateOnly($date);
    $window = getBusinessWindow($dateObj, $masterId);
    if ($window === null) {
        return [
            'date' => $date,
            'service' => $service,
            'master' => $masterId,
            'masterName' => (string) ($master['name'] ?? $masterId),
            'durationMinutes' => (int) $serviceMeta['durationMinutes'],
            'durationLabel' => formatDurationLabel((int) $serviceMeta['durationMinutes']),
            'slots' => [],
            'closed' => true,
        ];
    }

    $config = loadServiceConfig();
    $step = (int) ($config['slotStepMinutes'] ?? 30);
    $duration = (int) $serviceMeta['durationMinutes'];
    $now = new DateTimeImmutable('now', getTimezone());
    $existing = getBookingsForDate($dateObj, $masterId);
    $slots = [];

    for ($cursor = $window['open']; $cursor < $window['close']; $cursor = $cursor->modify("+{$step} minutes")) {
        $end = $cursor->modify("+{$duration} minutes");
        if ($end > $window['close']) {
            break;
        }

        if ($cursor <= $now) {
            continue;
        }

        if (!hasOverlap($cursor, $end, $existing)) {
            $slots[] = [
                'time' => $cursor->format('H:i'),
                'endTime' => $end->format('H:i'),
                'label' => $cursor->format('H:i') . ' – ' . $end->format('H:i'),
            ];
        }
    }

    return [
        'date' => $date,
        'service' => $service,
        'master' => $masterId,
        'masterName' => (string) ($master['name'] ?? $masterId),
        'durationMinutes' => $duration,
        'durationLabel' => formatDurationLabel($duration),
        'slots' => $slots,
        'closed' => false,
    ];
}

function createBookingRecord(array $data): array
{
    $name = trim((string) ($data['name'] ?? ''));
    $email = trim((string) ($data['email'] ?? ''));
    $phone = trim((string) ($data['phone'] ?? ''));
    $masterId = trim((string) ($data['master'] ?? ''));
    $service = trim((string) ($data['service'] ?? ''));
    $date = trim((string) ($data['date'] ?? ''));
    $time = trim((string) ($data['time'] ?? ''));
    $message = trim((string) ($data['message'] ?? ''));

    if ($name === '') {
        throw new InvalidArgumentException('Введите ваше имя.');
    }
    if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new InvalidArgumentException('Введите корректный email.');
    }
    if ($phone === '' || !preg_match('/^[\d\s+\-()]+$/', $phone)) {
        throw new InvalidArgumentException('Введите корректный телефон.');
    }
    if ($masterId === '') {
        throw new InvalidArgumentException('Выберите мастера.');
    }
    if ($service === '') {
        throw new InvalidArgumentException('Выберите услугу.');
    }
    if ($date === '' || $time === '') {
        throw new InvalidArgumentException('Выберите дату и время.');
    }

    $master = getMasterMeta($masterId);
    if ($master === null) {
        throw new InvalidArgumentException('Выберите мастера из списка.');
    }

    $serviceMeta = getServiceMeta($service);
    if ($serviceMeta === null || !masterOffersService($masterId, $service)) {
        throw new InvalidArgumentException('Эта услуга недоступна у выбранного мастера.');
    }

    $dateObj = parseDateOnly($date);
    [$hour, $minute] = parseTimeOnly($time);
    $start = $dateObj->setTime($hour, $minute);
    $duration = (int) $serviceMeta['durationMinutes'];
    $end = $start->modify("+{$duration} minutes");

    $window = getBusinessWindow($dateObj, $masterId);
    if ($window === null) {
        throw new InvalidArgumentException('В выбранный день мастер не работает.');
    }
    if ($start < $window['open'] || $end > $window['close']) {
        throw new InvalidArgumentException('Выбранное время вне рабочих часов мастера.');
    }

    $now = new DateTimeImmutable('now', getTimezone());
    if ($start <= $now) {
        throw new InvalidArgumentException('Нельзя записаться на прошедшее время.');
    }

    $pdo = getDb();
    $pdo->beginTransaction();

    try {
        $existing = getBookingsForDate($dateObj, $masterId);
        if (hasOverlap($start, $end, $existing)) {
            throw new InvalidArgumentException('Это время уже занято. Выберите другой слот.');
        }

        $stmt = $pdo->prepare(
            'INSERT INTO bookings (name, email, phone, master_id, master_name, service, service_label, duration_minutes, start_at, end_at, message, created_at)
             VALUES (:name, :email, :phone, :master_id, :master_name, :service, :service_label, :duration_minutes, :start_at, :end_at, :message, :created_at)'
        );

        $stmt->execute([
            ':name' => $name,
            ':email' => $email,
            ':phone' => $phone,
            ':master_id' => $masterId,
            ':master_name' => (string) ($master['name'] ?? $masterId),
            ':service' => $service,
            ':service_label' => (string) $serviceMeta['label'],
            ':duration_minutes' => $duration,
            ':start_at' => $start->format('c'),
            ':end_at' => $end->format('c'),
            ':message' => $message,
            ':created_at' => $now->format('c'),
        ]);

        $pdo->commit();
    } catch (Throwable $e) {
        $pdo->rollBack();
        throw $e;
    }

    return [
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'master_id' => $masterId,
        'master_name' => (string) ($master['name'] ?? $masterId),
        'service' => $service,
        'service_label' => (string) $serviceMeta['label'],
        'duration_minutes' => $duration,
        'start_at' => $start,
        'end_at' => $end,
        'message' => $message,
    ];
}

function buildBookingNotification(array $booking): string
{
    $start = $booking['start_at']->format('d.m.Y H:i');
    $end = $booking['end_at']->format('H:i');
    $duration = formatDurationLabel((int) $booking['duration_minutes']);

    $lines = [
        '🆕 Новая запись с сайта!',
        '',
        "👤 Имя: {$booking['name']}",
    ];

    if (!empty($booking['email'])) {
        $lines[] = "📧 Email: {$booking['email']}";
    }

    $lines[] = "📱 Телефон: {$booking['phone']}";
    $lines[] = "👩‍🎨 Мастер: {$booking['master_name']}";
    $lines[] = "💇 Услуга: {$booking['service_label']}";
    $lines[] = "🕐 Время: {$start} – {$end} ({$duration})";

    if (!empty($booking['message'])) {
        $lines[] = "💬 Комментарий: {$booking['message']}";
    }

    return implode("\n", $lines);
}
