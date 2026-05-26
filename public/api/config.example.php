<?php

/**
 * Скопируйте этот файл как config.php и заполните реальными значениями.
 * config.php не должен попадать в git.
 */
return [
    'telegram_bot_token' => 'YOUR_BOT_TOKEN',
    'telegram_chat_id' => 'YOUR_CHAT_ID',
    'vk_access_token' => 'YOUR_VK_ACCESS_TOKEN',
    'vk_admin_user_id' => 'YOUR_VK_USER_ID',
    // Максимум заявок с одного IP за окно (секунды)
    'rate_limit_max' => 5,
    'rate_limit_window' => 60,
    // Пароль для https://ваш-домен/admin/ (заголовок X-Admin-Password)
    'admin_password' => 'CHANGE_ME_strong_password',
];
