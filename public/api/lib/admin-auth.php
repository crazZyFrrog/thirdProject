<?php

declare(strict_types=1);

function loadAppConfig(): array
{
    static $config = null;
    if ($config !== null) {
        return $config;
    }

    $path = __DIR__ . '/../config.php';
    if (!file_exists($path)) {
        throw new RuntimeException('Сервер не настроен (нет config.php).');
    }

    $loaded = require $path;
    if (!is_array($loaded)) {
        throw new RuntimeException('Некорректный config.php.');
    }

    $config = $loaded;
    return $config;
}

function getAdminPassword(): string
{
    $config = loadAppConfig();
    return trim((string) ($config['admin_password'] ?? ''));
}

function verifyAdminRequest(): void
{
    $expected = getAdminPassword();
    if ($expected === '' || strpos($expected, 'CHANGE_ME') !== false) {
        throw new RuntimeException('Задайте admin_password в api/config.php.');
    }

    $provided = '';
    if (!empty($_SERVER['HTTP_X_ADMIN_PASSWORD'])) {
        $provided = trim((string) $_SERVER['HTTP_X_ADMIN_PASSWORD']);
    } elseif (isset($_POST['password'])) {
        $provided = trim((string) $_POST['password']);
    } else {
        $raw = file_get_contents('php://input');
        $json = json_decode($raw ?: '', true);
        if (is_array($json) && isset($json['password'])) {
            $provided = trim((string) $json['password']);
        }
    }

    if ($provided === '' || !hash_equals($expected, $provided)) {
        http_response_code(401);
        echo json_encode(['error' => 'Неверный пароль админки.'], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

function readJsonBody(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '', true);
    return is_array($data) ? $data : [];
}
