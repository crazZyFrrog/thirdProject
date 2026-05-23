# Инструкция по развертыванию (Beget / Timeweb)

## Локальная разработка

1. Установите зависимости:
```bash
npm install
```

2. Создайте `.env` из `.env.example` и заполните контакты.

3. Для тестирования формы локально (нужен PHP 8+):
```bash
# Терминал 1 — API
npm run dev:api

# Терминал 2 — фронтенд
npm run dev
```

4. Скопируйте `public/api/config.example.php` → `public/api/config.php` и укажите токены Telegram/VK.

5. Откройте http://localhost:5173/

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
   - `telegram_chat_id` — ID чата админа
   - `vk_access_token` — токен сообщества VK
   - `vk_admin_user_id` — VK ID админа

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
- [ ] Форма записи → уведомление в Telegram
- [ ] Форма записи → уведомление в VK
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
├── api/
│   ├── booking.php
│   └── config.php          ← только на сервере
├── .htaccess
├── robots.txt
├── sitemap.xml
└── favicon.svg
```

## Настройка Telegram

1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. Админ пишет боту `/start`
3. Узнайте `chat_id` через `getUpdates` или @userinfobot
4. Укажите токены в `api/config.php`

## Настройка VK

1. Создайте сообщество → включите «Сообщения сообщества»
2. Получите access token с правами `messages`
3. Админ должен **первым написать** сообществу
4. Укажите токен и `user_id` в `api/config.php`

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
