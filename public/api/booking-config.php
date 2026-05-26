<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Метод не поддерживается'], JSON_UNESCAPED_UNICODE);
    exit;
}

$path = __DIR__ . '/service-config.json';

if (!is_file($path)) {
    http_response_code(500);
    echo json_encode(['error' => 'На сервере нет файла api/service-config.json'], JSON_UNESCAPED_UNICODE);
    exit;
}

$raw = file_get_contents($path);
$config = json_decode($raw !== false ? $raw : '', true);

if (!is_array($config)) {
    http_response_code(500);
    echo json_encode(['error' => 'Файл service-config.json повреждён или пустой'], JSON_UNESCAPED_UNICODE);
    exit;
}

$services = isset($config['services']) && is_array($config['services']) ? $config['services'] : [];
$masters = [];

foreach ($config['masters'] ?? [] as $masterId => $master) {
    if (!is_array($master)) {
        continue;
    }

    $groups = [];
    foreach ($master['serviceGroups'] ?? [] as $group) {
        if (!is_array($group)) {
            continue;
        }

        $options = [];
        foreach ($group['services'] ?? [] as $serviceId) {
            $sid = (string) $serviceId;
            if (!isset($services[$sid]) || !is_array($services[$sid])) {
                continue;
            }
            $meta = $services[$sid];
            $options[] = [
                'value' => $sid,
                'label' => (string) ($meta['label'] ?? $sid),
                'durationMinutes' => (int) ($meta['durationMinutes'] ?? 60),
            ];
        }

        if (count($options) > 0) {
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

echo json_encode(['masters' => $masters], JSON_UNESCAPED_UNICODE);
