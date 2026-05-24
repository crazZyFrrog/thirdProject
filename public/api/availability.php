<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/lib/schedule.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Метод не поддерживается'], JSON_UNESCAPED_UNICODE);
    exit;
}

$date = trim((string) ($_GET['date'] ?? ''));
$service = trim((string) ($_GET['service'] ?? ''));
$master = trim((string) ($_GET['master'] ?? ''));

try {
    if ($date === '' || $service === '' || $master === '') {
        throw new InvalidArgumentException('Укажите date, service и master.');
    }

    echo json_encode(getAvailableSlots($date, $service, $master), JSON_UNESCAPED_UNICODE);
} catch (InvalidArgumentException $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Не удалось получить свободные слоты.'], JSON_UNESCAPED_UNICODE);
}
