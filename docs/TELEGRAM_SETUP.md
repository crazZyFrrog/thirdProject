# Настройка Telegram-уведомлений

Бот проекта: **[@salon_lt_bot](https://t.me/salon_lt_bot)**

## Почему ошибка «Не удалось отправить в Telegram»

Токен бота **рабочий**, но `telegram_chat_id` в `public/api/config.php` **не совпадает** с вашим чатом.  
Telegram отвечает: `chat not found` — бот ещё не «знаком» с получателем.

## Настройка за 3 минуты

### Шаг 1. Запустите бота

1. Откройте в Telegram: https://t.me/salon_lt_bot  
2. Нажмите **«Запустить»** или отправьте **`/start`**

### Шаг 2. Узнайте chat_id

Откройте в браузере (подставьте свой токен, если меняли):

```
https://api.telegram.org/bot8332217238:AAHd4yRMSEoydPxi_JIXei3nv_oLKKbvgRM/getUpdates
```

Найдите в ответе:

```json
"chat": { "id": 123456789, ... }
```

Число `123456789` — это ваш **chat_id**.

### Шаг 3. Обновите config.php

```php
'telegram_chat_id' => '123456789',  // ваш id из getUpdates
```

### Шаг 4. Перезапустите dev-сервер

```bash
# Ctrl+C, затем:
npm run dev
```

Отправьте тестовую заявку с сайта.

---

## Группа «Заявки с сайта» (опционально)

1. Создайте группу в Telegram  
2. Добавьте бота **@salon_lt_bot** в группу  
3. Напишите любое сообщение в группе  
4. Снова откройте `getUpdates` — id группы будет **отрицательным**, например `-1001234567890`  
5. Укажите этот id в `telegram_chat_id`

---

## Проверка вручную

После `/start` откройте в браузере (замените CHAT_ID):

```
https://api.telegram.org/bot8332217238:AAHd4yRMSEoydPxi_JIXei3nv_oLKKbvgRM/sendMessage?chat_id=CHAT_ID&text=Test
```

Если в Telegram пришло «Test» — всё настроено.
