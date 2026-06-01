<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$checks = [
    'phpVersion' => PHP_VERSION,
    'pdoSqlite' => extension_loaded('pdo_sqlite'),
    'serviceConfig' => is_file(__DIR__ . '/service-config.json'),
    'configPhp' => is_file(__DIR__ . '/config.php'),
    'dataDirWritable' => is_dir(__DIR__ . '/data') && is_writable(__DIR__ . '/data'),
    'scheduleLib' => is_file(__DIR__ . '/lib/schedule.php'),
];

$scheduleOk = false;
$scheduleError = '';

if ($checks['scheduleLib']) {
    try {
        require_once __DIR__ . '/lib/schedule.php';
        getBookingConfig();
        $scheduleOk = true;
    } catch (Throwable $e) {
        $scheduleError = $e->getMessage();
    }
}

$checks['scheduleLoads'] = $scheduleOk;
$checks['scheduleError'] = $scheduleError;

$adminPasswordSet = false;
$telegramConfigured = false;
$telegramChatCount = 0;

if ($checks['configPhp']) {
    $cfg = require __DIR__ . '/config.php';
    if (is_array($cfg)) {
        $pw = trim((string) ($cfg['admin_password'] ?? ''));
        $adminPasswordSet = $pw !== '' && strpos($pw, 'CHANGE_ME') === false;

        require_once __DIR__ . '/lib/notify.php';
        $telegramConfigured = isTelegramConfigured($cfg);
        $telegramChatCount = count(getTelegramChatIds($cfg));
    }
}

$checks['adminPasswordSet'] = $adminPasswordSet;
$checks['telegramConfigured'] = $telegramConfigured;
$checks['telegramChatCount'] = $telegramChatCount;

$ok = $checks['pdoSqlite'] && $checks['serviceConfig'] && $checks['scheduleLoads'];

http_response_code($ok ? 200 : 500);
echo json_encode(['ok' => $ok, 'checks' => $checks], JSON_UNESCAPED_UNICODE);
