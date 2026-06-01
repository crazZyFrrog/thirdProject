<?php

/**
 * Скопируйте этот файл как config.php и заполните реальными значениями.
 * config.php не должен попадать в git.
 */
return [
    // Бот от @BotFather (например @salon_lt_bot)
    'telegram_bot_token' => 'YOUR_BOT_TOKEN',

    // Группа «Записи — Мастерская ЛТ» — ID с минусом (узнать: @userinfobot в группе)
    'telegram_chat_id' => '-100XXXXXXXXXX',

    // Дополнительные чаты (необязательно): личка админа и т.д.
    // 'telegram_chat_ids' => ['-100XXXXXXXXXX', '123456789'],

    // VK — подключим позже (беседа сообщества). Пока можно оставить пустым.
    'vk_access_token' => '',
    'vk_peer_id' => 0,
    'vk_admin_user_id' => '',

    'rate_limit_max' => 5,
    'rate_limit_window' => 60,

    // Пароль для https://ваш-домен/admin/
    'admin_password' => 'CHANGE_ME_strong_password',
];
