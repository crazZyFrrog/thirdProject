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
        "CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT,
            phone TEXT NOT NULL,
            master_id TEXT NOT NULL DEFAULT '',
            master_name TEXT NOT NULL DEFAULT '',
            service TEXT NOT NULL,
            service_label TEXT NOT NULL,
            duration_minutes INTEGER NOT NULL,
            start_at TEXT NOT NULL,
            end_at TEXT NOT NULL,
            message TEXT,
            source TEXT NOT NULL DEFAULT 'website',
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )"
    );

    migrateBookingsTable($pdo);
    migrateScheduleExtras($pdo);

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
    if (!in_array('source', $names, true)) {
        $pdo->exec("ALTER TABLE bookings ADD COLUMN source TEXT NOT NULL DEFAULT 'website'");
    }
}

function migrateScheduleExtras(PDO $pdo): void
{
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS blocked_periods (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            master_id TEXT NOT NULL,
            date_from TEXT NOT NULL,
            date_to TEXT NOT NULL,
            note TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )'
    );

    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS blocked_slots (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            master_id TEXT NOT NULL,
            start_at TEXT NOT NULL,
            end_at TEXT NOT NULL,
            note TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )'
    );

    $pdo->exec('CREATE INDEX IF NOT EXISTS idx_blocked_periods_master ON blocked_periods(master_id)');
    $pdo->exec('CREATE INDEX IF NOT EXISTS idx_blocked_slots_master ON blocked_slots(master_id)');
    $pdo->exec('CREATE INDEX IF NOT EXISTS idx_blocked_slots_start ON blocked_slots(start_at)');
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

function isDateBlockedForMaster(DateTimeImmutable $date, string $masterId): bool
{
    $pdo = getDb();
    $day = $date->format('Y-m-d');

    $stmt = $pdo->prepare(
        'SELECT id FROM blocked_periods
         WHERE master_id = :master_id AND date_from <= :day AND date_to >= :day
         LIMIT 1'
    );
    $stmt->execute([
        ':master_id' => $masterId,
        ':day' => $day,
    ]);

    return (bool) $stmt->fetchColumn();
}

function getOccupiedIntervalsForDate(DateTimeImmutable $date, string $masterId): array
{
    $pdo = getDb();
    $dayStart = $date->setTime(0, 0)->format('c');
    $dayEnd = $date->setTime(23, 59, 59)->format('c');
    $intervals = [];

    $bookingStmt = $pdo->prepare(
        'SELECT start_at, end_at FROM bookings
         WHERE master_id = :master_id
           AND start_at < :day_end AND end_at > :day_start
         ORDER BY start_at ASC'
    );
    $bookingStmt->execute([
        ':master_id' => $masterId,
        ':day_start' => $dayStart,
        ':day_end' => $dayEnd,
    ]);

    foreach ($bookingStmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $intervals[] = [
            'start' => new DateTimeImmutable($row['start_at']),
            'end' => new DateTimeImmutable($row['end_at']),
        ];
    }

    $slotStmt = $pdo->prepare(
        'SELECT start_at, end_at FROM blocked_slots
         WHERE master_id = :master_id
           AND start_at < :day_end AND end_at > :day_start
         ORDER BY start_at ASC'
    );
    $slotStmt->execute([
        ':master_id' => $masterId,
        ':day_start' => $dayStart,
        ':day_end' => $dayEnd,
    ]);

    foreach ($slotStmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $intervals[] = [
            'start' => new DateTimeImmutable($row['start_at']),
            'end' => new DateTimeImmutable($row['end_at']),
        ];
    }

    return $intervals;
}

/** @deprecated alias */
function getBookingsForDate(DateTimeImmutable $date, string $masterId): array
{
    return getOccupiedIntervalsForDate($date, $masterId);
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
    if (isDateBlockedForMaster($dateObj, $masterId)) {
        return [
            'date' => $date,
            'service' => $service,
            'master' => $masterId,
            'masterName' => (string) ($master['name'] ?? $masterId),
            'durationMinutes' => (int) $serviceMeta['durationMinutes'],
            'durationLabel' => formatDurationLabel((int) $serviceMeta['durationMinutes']),
            'slots' => [],
            'closed' => true,
            'reason' => 'blocked_period',
        ];
    }

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
    $existing = getOccupiedIntervalsForDate($dateObj, $masterId);
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
    return insertBookingRecord($data, 'website', false);
}

function insertBookingRecord(array $data, string $source, bool $allowPast): array
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
        throw new InvalidArgumentException('Введите имя клиента.');
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
    if (isDateBlockedForMaster($dateObj, $masterId)) {
        throw new InvalidArgumentException('В этот период мастер в отпуске.');
    }

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
    if (!$allowPast && $start <= $now) {
        throw new InvalidArgumentException('Нельзя записаться на прошедшее время.');
    }

    $existing = getOccupiedIntervalsForDate($dateObj, $masterId);
    if (hasOverlap($start, $end, $existing)) {
        throw new InvalidArgumentException('Это время уже занято.');
    }

    $pdo = getDb();
    $stmt = $pdo->prepare(
        'INSERT INTO bookings (name, email, phone, master_id, master_name, service, service_label, duration_minutes, start_at, end_at, message, source, created_at)
         VALUES (:name, :email, :phone, :master_id, :master_name, :service, :service_label, :duration_minutes, :start_at, :end_at, :message, :source, :created_at)'
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
        ':source' => $source,
        ':created_at' => $now->format('c'),
    ]);

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
        'source' => $source,
    ];
}

function createBlockedSlot(array $data): array
{
    $masterId = trim((string) ($data['master'] ?? ''));
    $date = trim((string) ($data['date'] ?? ''));
    $time = trim((string) ($data['time'] ?? ''));
    $durationMinutes = (int) ($data['durationMinutes'] ?? 0);
    $note = trim((string) ($data['note'] ?? 'Закрыто'));

    if ($masterId === '') {
        throw new InvalidArgumentException('Выберите мастера.');
    }
    if ($date === '' || $time === '') {
        throw new InvalidArgumentException('Укажите дату и время.');
    }
    if ($durationMinutes < 15) {
        throw new InvalidArgumentException('Минимальная длительность — 15 минут.');
    }

    $master = getMasterMeta($masterId);
    if ($master === null) {
        throw new InvalidArgumentException('Мастер не найден.');
    }

    $dateObj = parseDateOnly($date);
    if (isDateBlockedForMaster($dateObj, $masterId)) {
        throw new InvalidArgumentException('День уже закрыт отпуском.');
    }

    [$hour, $minute] = parseTimeOnly($time);
    $start = $dateObj->setTime($hour, $minute);
    $end = $start->modify("+{$durationMinutes} minutes");

    $window = getBusinessWindow($dateObj, $masterId);
    if ($window === null) {
        throw new InvalidArgumentException('В этот день мастер не работает.');
    }
    if ($start < $window['open'] || $end > $window['close']) {
        throw new InvalidArgumentException('Интервал вне рабочих часов.');
    }

    $existing = getOccupiedIntervalsForDate($dateObj, $masterId);
    if (hasOverlap($start, $end, $existing)) {
        throw new InvalidArgumentException('Интервал пересекается с существующей записью.');
    }

    $pdo = getDb();
    $now = new DateTimeImmutable('now', getTimezone());
    $stmt = $pdo->prepare(
        'INSERT INTO blocked_slots (master_id, start_at, end_at, note, created_at)
         VALUES (:master_id, :start_at, :end_at, :note, :created_at)'
    );
    $stmt->execute([
        ':master_id' => $masterId,
        ':start_at' => $start->format('c'),
        ':end_at' => $end->format('c'),
        ':note' => $note,
        ':created_at' => $now->format('c'),
    ]);

    return [
        'id' => (int) $pdo->lastInsertId(),
        'master_id' => $masterId,
        'master_name' => (string) ($master['name'] ?? $masterId),
        'start_at' => $start,
        'end_at' => $end,
        'note' => $note,
    ];
}

function addBlockedPeriod(array $data): array
{
    $masterId = trim((string) ($data['master'] ?? ''));
    $dateFrom = trim((string) ($data['dateFrom'] ?? ''));
    $dateTo = trim((string) ($data['dateTo'] ?? ''));
    $note = trim((string) ($data['note'] ?? 'Отпуск'));

    if ($masterId === '') {
        throw new InvalidArgumentException('Выберите мастера.');
    }
    if ($dateFrom === '' || $dateTo === '') {
        throw new InvalidArgumentException('Укажите даты начала и конца.');
    }

    $from = parseDateOnly($dateFrom);
    $to = parseDateOnly($dateTo);
    if ($to < $from) {
        throw new InvalidArgumentException('Дата окончания не может быть раньше начала.');
    }

    $master = getMasterMeta($masterId);
    if ($master === null) {
        throw new InvalidArgumentException('Мастер не найден.');
    }

    $pdo = getDb();
    $now = new DateTimeImmutable('now', getTimezone());
    $stmt = $pdo->prepare(
        'INSERT INTO blocked_periods (master_id, date_from, date_to, note, created_at)
         VALUES (:master_id, :date_from, :date_to, :note, :created_at)'
    );
    $stmt->execute([
        ':master_id' => $masterId,
        ':date_from' => $from->format('Y-m-d'),
        ':date_to' => $to->format('Y-m-d'),
        ':note' => $note,
        ':created_at' => $now->format('c'),
    ]);

    return [
        'id' => (int) $pdo->lastInsertId(),
        'master_id' => $masterId,
        'master_name' => (string) ($master['name'] ?? $masterId),
        'date_from' => $from->format('Y-m-d'),
        'date_to' => $to->format('Y-m-d'),
        'note' => $note,
    ];
}

function listBlockedPeriods(): array
{
    $pdo = getDb();
    $rows = $pdo->query(
        'SELECT id, master_id, date_from, date_to, note, created_at FROM blocked_periods ORDER BY date_from ASC'
    )->fetchAll(PDO::FETCH_ASSOC);

    $result = [];
    foreach ($rows as $row) {
        $master = getMasterMeta((string) $row['master_id']);
        $result[] = [
            'id' => (int) $row['id'],
            'master_id' => $row['master_id'],
            'master_name' => $master['name'] ?? $row['master_id'],
            'date_from' => $row['date_from'],
            'date_to' => $row['date_to'],
            'note' => $row['note'],
        ];
    }

    return $result;
}

function deleteBlockedPeriod(int $id): void
{
    $pdo = getDb();
    $stmt = $pdo->prepare('DELETE FROM blocked_periods WHERE id = :id');
    $stmt->execute([':id' => $id]);
    if ($stmt->rowCount() === 0) {
        throw new InvalidArgumentException('Отпуск не найден.');
    }
}

function listBookingsAdmin(int $limit = 50): array
{
    $pdo = getDb();
    $stmt = $pdo->prepare(
        'SELECT id, name, phone, master_id, master_name, service_label, start_at, end_at, source, message
         FROM bookings ORDER BY start_at DESC LIMIT :limit'
    );
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();

    $result = [];
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $start = new DateTimeImmutable($row['start_at']);
        $end = new DateTimeImmutable($row['end_at']);
        $result[] = [
            'id' => (int) $row['id'],
            'name' => $row['name'],
            'phone' => $row['phone'],
            'master_id' => $row['master_id'],
            'master_name' => $row['master_name'],
            'service_label' => $row['service_label'],
            'source' => $row['source'] ?: 'website',
            'date' => $start->format('Y-m-d'),
            'time' => $start->format('H:i'),
            'endTime' => $end->format('H:i'),
            'message' => $row['message'],
        ];
    }

    return $result;
}

function deleteBooking(int $id): void
{
    $pdo = getDb();
    $stmt = $pdo->prepare('DELETE FROM bookings WHERE id = :id');
    $stmt->execute([':id' => $id]);
    if ($stmt->rowCount() === 0) {
        throw new InvalidArgumentException('Запись не найдена.');
    }
}

function buildBookingNotification(array $booking): string
{
    $start = $booking['start_at']->format('d.m.Y H:i');
    $end = $booking['end_at']->format('H:i');
    $duration = formatDurationLabel((int) $booking['duration_minutes']);
    $source = (string) ($booking['source'] ?? 'website');

    if ($source === 'phone') {
        $title = '📞 Запись по телефону (админка)';
    } else {
        $title = '🆕 Новая запись с сайта!';
    }

    $lines = [
        $title,
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
