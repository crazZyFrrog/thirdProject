<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$configPath = __DIR__ . '/config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Сервер не настроен (нет config.php).'], JSON_UNESCAPED_UNICODE);
    exit;
}

/** @var array<string, mixed> $config */
$config = require $configPath;

require_once __DIR__ . '/lib/schedule.php';
require_once __DIR__ . '/lib/admin-auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$body = readJsonBody();
$action = trim((string) ($_GET['action'] ?? $body['action'] ?? ''));

if ($action === 'ping' && $method === 'GET') {
    try {
        verifyAdminRequest();
        echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
    } catch (RuntimeException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
    }
    exit;
}

try {
    verifyAdminRequest();
} catch (Throwable $e) {
    exit;
}

try {
    switch ($action) {
        case 'config':
            if ($method !== 'GET') {
                methodNotAllowed();
            }
            echo json_encode(getBookingConfig(), JSON_UNESCAPED_UNICODE);
            break;

        case 'bookings':
            if ($method !== 'GET') {
                methodNotAllowed();
            }
            echo json_encode(['bookings' => listBookingsAdmin(80)], JSON_UNESCAPED_UNICODE);
            break;

        case 'blocked-periods':
            if ($method !== 'GET') {
                methodNotAllowed();
            }
            echo json_encode(['periods' => listBlockedPeriods()], JSON_UNESCAPED_UNICODE);
            break;

        case 'phone-booking':
            if ($method !== 'POST') {
                methodNotAllowed();
            }
            $booking = insertBookingRecord($body, 'phone', true);
            $text = buildBookingNotification($booking);
            $telegram = sendAdminTelegram($config, $text);
            $vk = sendAdminVk($config, $text);
            echo json_encode([
                'success' => true,
                'booking' => [
                    'master' => $booking['master_name'],
                    'date' => $booking['start_at']->format('Y-m-d'),
                    'time' => $booking['start_at']->format('H:i'),
                    'endTime' => $booking['end_at']->format('H:i'),
                    'service' => $booking['service_label'],
                ],
                'notified' => [
                    'telegram' => $telegram,
                    'vk' => $vk,
                ],
            ], JSON_UNESCAPED_UNICODE);
            break;

        case 'block-slot':
            if ($method !== 'POST') {
                methodNotAllowed();
            }
            $slot = createBlockedSlot($body);
            echo json_encode([
                'success' => true,
                'slot' => [
                    'id' => $slot['id'],
                    'master' => $slot['master_name'],
                    'date' => $slot['start_at']->format('Y-m-d'),
                    'time' => $slot['start_at']->format('H:i'),
                    'endTime' => $slot['end_at']->format('H:i'),
                    'note' => $slot['note'],
                ],
            ], JSON_UNESCAPED_UNICODE);
            break;

        case 'blocked-period':
            if ($method !== 'POST') {
                methodNotAllowed();
            }
            $period = addBlockedPeriod($body);
            echo json_encode(['success' => true, 'period' => $period], JSON_UNESCAPED_UNICODE);
            break;

        case 'delete-booking':
            if ($method !== 'POST') {
                methodNotAllowed();
            }
            $id = (int) ($body['id'] ?? 0);
            if ($id < 1) {
                throw new InvalidArgumentException('Укажите id записи.');
            }
            deleteBooking($id);
            echo json_encode(['success' => true], JSON_UNESCAPED_UNICODE);
            break;

        case 'delete-blocked-period':
            if ($method !== 'POST') {
                methodNotAllowed();
            }
            $id = (int) ($body['id'] ?? 0);
            if ($id < 1) {
                throw new InvalidArgumentException('Укажите id отпуска.');
            }
            deleteBlockedPeriod($id);
            echo json_encode(['success' => true], JSON_UNESCAPED_UNICODE);
            break;

        default:
            http_response_code(400);
            echo json_encode(['error' => 'Неизвестное действие.'], JSON_UNESCAPED_UNICODE);
    }
} catch (InvalidArgumentException $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
} catch (RuntimeException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Ошибка сервера.',
        'detail' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE);
}

function methodNotAllowed(): void
{
    http_response_code(405);
    echo json_encode(['error' => 'Метод не поддерживается'], JSON_UNESCAPED_UNICODE);
    exit;
}

function sendAdminTelegram(array $config, string $text): bool
{
    $token = trim((string) ($config['telegram_bot_token'] ?? ''));
    $chatId = trim((string) ($config['telegram_chat_id'] ?? ''));

    if ($token === '' || $chatId === '' || strpos($token, 'YOUR_') !== false) {
        return false;
    }

    $url = "https://api.telegram.org/bot{$token}/sendMessage";
    if (!function_exists('curl_init')) {
        return false;
    }

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS => json_encode(['chat_id' => $chatId, 'text' => $text], JSON_UNESCAPED_UNICODE),
        CURLOPT_TIMEOUT => 10,
    ]);
    $body = curl_exec($ch);
    curl_close($ch);

    if ($body === false) {
        return false;
    }

    $decoded = json_decode($body, true);
    return is_array($decoded) && ($decoded['ok'] ?? false) === true;
}

function sendAdminVk(array $config, string $text): bool
{
    $token = trim((string) ($config['vk_access_token'] ?? ''));
    $userId = trim((string) ($config['vk_admin_user_id'] ?? ''));

    if ($token === '' || $userId === '' || strpos($token, 'YOUR_') !== false) {
        return false;
    }

    if (!function_exists('curl_init')) {
        return false;
    }

    $ch = curl_init('https://api.vk.com/method/messages.send');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POSTFIELDS => http_build_query([
            'access_token' => $token,
            'v' => '5.131',
            'user_id' => $userId,
            'random_id' => (string) random_int(1, 2147483647),
            'message' => $text,
        ]),
        CURLOPT_TIMEOUT => 10,
    ]);
    $body = curl_exec($ch);
    curl_close($ch);

    if ($body === false) {
        return false;
    }

    $decoded = json_decode($body, true);
    return is_array($decoded) && isset($decoded['response']);
}
