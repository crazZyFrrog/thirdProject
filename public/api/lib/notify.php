<?php

declare(strict_types=1);

/**
 * @return list<string>
 */
function getTelegramChatIds(array $config): array
{
    $ids = [];

    $primary = trim((string) ($config['telegram_chat_id'] ?? ''));
    if ($primary !== '') {
        $ids[] = $primary;
    }

    $extra = $config['telegram_chat_ids'] ?? [];
    if (is_array($extra)) {
        foreach ($extra as $chatId) {
            $chatId = trim((string) $chatId);
            if ($chatId !== '') {
                $ids[] = $chatId;
            }
        }
    }

    return array_values(array_unique($ids));
}

function sendTelegram(array $config, string $text): bool
{
    $token = trim((string) ($config['telegram_bot_token'] ?? ''));
    if ($token === '' || strpos($token, 'YOUR_') !== false) {
        return false;
    }

    $chatIds = getTelegramChatIds($config);
    if ($chatIds === []) {
        return false;
    }

    $sent = false;
    foreach ($chatIds as $chatId) {
        if (sendTelegramToChat($token, $chatId, $text)) {
            $sent = true;
        }
    }

    return $sent;
}

function sendTelegramToChat(string $token, string $chatId, string $text): bool
{
    $url = "https://api.telegram.org/bot{$token}/sendMessage";
    $response = httpPostJson($url, [
        'chat_id' => $chatId,
        'text' => $text,
    ]);

    return is_array($response) && ($response['ok'] ?? false) === true;
}

/**
 * VK: личное сообщение одному user_id. Беседа (peer_id) — в следующей версии.
 */
function sendVk(array $config, string $text): bool
{
    $token = trim((string) ($config['vk_access_token'] ?? ''));
    $peerId = (int) ($config['vk_peer_id'] ?? 0);
    $userId = trim((string) ($config['vk_admin_user_id'] ?? ''));

    if ($token === '' || strpos($token, 'YOUR_') !== false) {
        return false;
    }

    if (!function_exists('curl_init')) {
        return false;
    }

    $payload = [
        'access_token' => $token,
        'v' => '5.199',
        'random_id' => (string) random_int(1, 2147483647),
        'message' => $text,
    ];

    if ($peerId > 0) {
        $payload['peer_id'] = $peerId;
    } elseif ($userId !== '') {
        $payload['user_id'] = $userId;
    } else {
        return false;
    }

    $response = httpPostForm('https://api.vk.com/method/messages.send', $payload);

    return is_array($response) && isset($response['response']);
}

/**
 * @return array{telegram: bool, vk: bool}
 */
function sendBookingNotifications(array $config, string $text): array
{
    return [
        'telegram' => sendTelegram($config, $text),
        'vk' => sendVk($config, $text),
    ];
}

function isTelegramConfigured(array $config): bool
{
    $token = trim((string) ($config['telegram_bot_token'] ?? ''));

    return $token !== ''
        && strpos($token, 'YOUR_') === false
        && getTelegramChatIds($config) !== [];
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
