<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Метод не поддерживается'], JSON_UNESCAPED_UNICODE);
    exit;
}

$configPath = __DIR__ . '/config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Сервер не настроен. Обратитесь к администратору.'], JSON_UNESCAPED_UNICODE);
    exit;
}

/** @var array<string, mixed> $config */
$config = require $configPath;
require_once __DIR__ . '/lib/schedule.php';

$rawBody = file_get_contents('php://input');
$data = json_decode($rawBody ?: '', true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'Некорректный формат данных'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!empty($data['website'])) {
    echo json_encode(['success' => true], JSON_UNESCAPED_UNICODE);
    exit;
}

$clientIp = getClientIp();
if (!checkRateLimit($clientIp, $config)) {
    http_response_code(429);
    echo json_encode(['error' => 'Слишком много запросов. Попробуйте через минуту.'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $booking = createBookingRecord($data);
    $notificationText = buildBookingNotification($booking);

    $results = [
        'telegram' => sendTelegram($config, $notificationText),
        'vk' => sendVk($config, $notificationText),
    ];

    $successCount = count(array_filter($results));
    if ($successCount === 0) {
        http_response_code(502);
        echo json_encode(['error' => 'Запись создана, но уведомление не отправлено. Позвоните в салон.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    echo json_encode([
        'success' => true,
        'booking' => [
            'master' => $booking['master_name'],
            'date' => $booking['start_at']->format('Y-m-d'),
            'time' => $booking['start_at']->format('H:i'),
            'endTime' => $booking['end_at']->format('H:i'),
            'service' => $booking['service_label'],
        ],
    ], JSON_UNESCAPED_UNICODE);
} catch (InvalidArgumentException $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Не удалось создать запись. Попробуйте позже.'], JSON_UNESCAPED_UNICODE);
}

function getClientIp(): string
{
    $headers = ['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'];
    foreach ($headers as $header) {
        if (!empty($_SERVER[$header])) {
            $value = (string) $_SERVER[$header];
            if ($header === 'HTTP_X_FORWARDED_FOR') {
                $value = trim(explode(',', $value)[0]);
            }
            return $value;
        }
    }

    return '0.0.0.0';
}

function checkRateLimit(string $ip, array $config): bool
{
    $max = (int) ($config['rate_limit_max'] ?? 5);
    $window = (int) ($config['rate_limit_window'] ?? 60);
    $dir = __DIR__ . '/.rate_limit';

    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }

    $file = $dir . '/' . md5($ip) . '.json';
    $now = time();
    $requests = [];

    if (file_exists($file)) {
        $decoded = json_decode((string) file_get_contents($file), true);
        if (is_array($decoded)) {
            $requests = array_values(array_filter(
                $decoded,
                static fn ($timestamp) => is_int($timestamp) && ($now - $timestamp) < $window
            ));
        }
    }

    if (count($requests) >= $max) {
        return false;
    }

    $requests[] = $now;
    file_put_contents($file, json_encode($requests));

    return true;
}

function sendTelegram(array $config, string $text): bool
{
    $token = trim((string) ($config['telegram_bot_token'] ?? ''));
    $chatId = trim((string) ($config['telegram_chat_id'] ?? ''));

    if ($token === '' || $chatId === '' || strpos($token, 'YOUR_') !== false) {
        return false;
    }

    $url = "https://api.telegram.org/bot{$token}/sendMessage";

    $response = httpPostJson($url, [
        'chat_id' => $chatId,
        'text' => $text,
    ]);

    return is_array($response) && ($response['ok'] ?? false) === true;
}

function sendVk(array $config, string $text): bool
{
    $token = trim((string) ($config['vk_access_token'] ?? ''));
    $userId = trim((string) ($config['vk_admin_user_id'] ?? ''));

    if ($token === '' || $userId === '' || strpos($token, 'YOUR_') !== false) {
        return false;
    }

    $url = 'https://api.vk.com/method/messages.send';

    $response = httpPostForm($url, [
        'access_token' => $token,
        'v' => '5.131',
        'user_id' => $userId,
        'random_id' => (string) random_int(1, 2147483647),
        'message' => $text,
    ]);

    return is_array($response) && isset($response['response']);
}

function httpPostJson(string $url, array $payload): ?array
{
    if (!function_exists('curl_init')) {
        return null;
    }

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
        CURLOPT_TIMEOUT => 10,
    ]);

    $body = curl_exec($ch);
    curl_close($ch);

    if ($body === false) {
        return null;
    }

    $decoded = json_decode($body, true);
    return is_array($decoded) ? $decoded : null;
}

function httpPostForm(string $url, array $payload): ?array
{
    if (!function_exists('curl_init')) {
        return null;
    }

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POSTFIELDS => http_build_query($payload),
        CURLOPT_TIMEOUT => 10,
    ]);

    $body = curl_exec($ch);
    curl_close($ch);

    if ($body === false) {
        return null;
    }

    $decoded = json_decode($body, true);
    return is_array($decoded) ? $decoded : null;
}
