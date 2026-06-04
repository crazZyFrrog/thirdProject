# Инструкция по развертыванию (Beget / Timeweb)

> **Подробный гайд для сюрприза заказчику:** см. [DOMAIN_AND_HOSTING.md](DOMAIN_AND_HOSTING.md) — покупка домена на reg.ru, подключение Beget/Timeweb, загрузка сайта.

## Локальная разработка

1. Установите зависимости:
```bash
npm install
```

2. Создайте `.env` из `.env.example` и заполните контакты.

3. Для тестирования формы локально достаточно одного терминала:

```bash
npm run dev
```

API формы в dev-режиме встроен в Vite (PHP не нужен). Нужен файл `public/api/config.php` с токенами Telegram.

Опционально — отдельный PHP-сервер (если PHP установлен):

```bash
npm run dev:api   # терминал 1
npm run dev       # терминал 2
```

## Продакшен сборка

```bash
npm run build
```

Готовые файлы будут в папке `dist/` (включая `api/`, `.htaccess`, `robots.txt`).

## Развертывание на Beget / Timeweb

### 1. Подготовка хостинга

1. Зарегистрируйте аккаунт на [Beget](https://beget.com) или [Timeweb](https://timeweb.com)
2. Выберите тариф виртуального хостинга с **PHP 8.x**
3. Привяжите домен в панели хостинга
4. Включите **SSL** (Let's Encrypt) после привязки домена

### 2. Настройка API на сервере

1. Соберите проект: `npm run build`
2. Загрузите **содержимое** папки `dist/` в `public_html/` (FTP/SFTP или файловый менеджер)
3. На сервере создайте `public_html/api/config.php` на основе `config.example.php`:
   - `telegram_bot_token` — от @BotFather
   - `telegram_chat_id` — ID **группы** мастеров (с минусом, например `-1003975356754`)
   - `admin_password` — пароль админки `/admin/`
   - VK (`vk_access_token`, `vk_peer_id`) — беседа служебного сообщества; можно оставить пустым, если нужен только Telegram

**Важно:** `config.php` не должен попадать в git. На сервере создаётся вручную.

### 3. DNS (reg.ru)

В панели reg.ru → DNS-записи:

| Имя | Тип | Значение |
|-----|-----|----------|
| `@` | A | IP сервера Beget/Timeweb |
| `www` | A | IP сервера Beget/Timeweb |

Не включайте перенаправления reg.ru параллельно с хостингом.

### 4. Обновление SEO-файлов

Перед деплоем замените `example.ru` на реальный домен в:
- `index.html` (og:url, canonical, schema.org)
- `public/robots.txt`
- `public/sitemap.xml`

Затем пересоберите: `npm run build`

### 5. Проверка после деплоя

- [ ] Сайт открывается по HTTPS
- [ ] Все JS/CSS загружаются (нет белого экрана)
- [ ] Форма записи → уведомление в Telegram (группа мастеров)
- [ ] https://salonlt.ru/api/health.php → ok, telegramConfigured: true
- [ ] Тест с мобильного интернета в городе заказчика

## Переменные окружения (фронтенд)

Создайте `.env` перед сборкой:

```
VITE_PHONE=+74842559572
VITE_PHONE_DISPLAY=+7 (4842) 55-95-72
VITE_EMAIL=info@domain.ru
VITE_WHATSAPP=784842559572
VITE_INSTAGRAM=https://instagram.com/yourmaster
VITE_VK=https://vk.com/yourmaster
VITE_ADDRESS=г. Калуга, ул. Глаголева, д. 9
```

Пересоберите после изменения: `npm run build`

## Структура на сервере

```
public_html/
├── index.html
├── assets/
├── images/
├── admin/index.html
├── api/
│   ├── booking.php, admin.php, health.php
│   ├── lib/notify.php, schedule.php
│   └── config.php          ← только на сервере, не перезаписывать
├── .htaccess
├── robots.txt
├── sitemap.xml
└── favicon.svg
```

## Настройка Telegram (группа для мастеров)

1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. Создайте группу «Записи — Мастерская ЛТ», добавьте мастеров и бота
3. Сделайте бота администратором группы (или разрешите писать сообщения)
4. Узнайте ID группы: добавьте [@userinfobot](https://t.me/userinfobot) → «This group ID: -100…»
5. В `api/config.php`:
   ```php
   'telegram_bot_token' => '...',
   'telegram_chat_id' => '-1003975356754',
   ```
6. Один раз напишите боту `/start` в личке

Подробнее: [HANDOVER.md](HANDOVER.md)

## Настройка VK (уведомления в беседу)

В `config.php`: `vk_access_token` (ключ сообщества, право «Сообщения»), `vk_peer_id` — id беседы (число без кавычек, например `2000000003`). Подробно: [HANDOVER.md](HANDOVER.md).

## Обновление сайта

1. Внесите изменения в код
2. `npm run build`
3. Загрузите обновлённые файлы из `dist/` на хостинг (кроме `api/config.php` — не перезаписывайте)

## Яндекс.Метрика

Добавьте счётчик в `index.html` перед `</body>` (см. [SEO.md](SEO.md)).

## Альтернатива: Vercel

Файл `vercel.json` сохранён, но для аудитории в России рекомендуется Beget/Timeweb из-за стабильности доступа.

## Поддержка

- [Beget — база знаний](https://beget.com/ru/kb)
- [Timeweb — помощь](https://timeweb.com/ru/docs/)
- [Vite Documentation](https://vitejs.dev)

Подробная передача заказчику — в [HANDOVER.md](HANDOVER.md).
