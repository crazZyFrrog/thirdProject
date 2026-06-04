# Мастерская красоты ЛТ — сайт и онлайн-запись

**Продакшен:** https://salonlt.ru  
**Админка:** https://salonlt.ru/admin/

Лендинг салона в Калуге: онлайн-запись, уведомления в Telegram и VK, расписание мастеров.

## Быстрый старт (разработка)

```bash
npm install
npm run dev          # фронтенд http://localhost:5173
npm run dev:api      # PHP API http://localhost:8080 (отдельный терминал)
npm run build        # сборка в dist/
```

Контакты и ссылки для сайта: `.env` → `src/config/contacts.js` (см. `.env.example`).

## Структура проекта

```
├── docs/                    # Вся документация (см. docs/README.md)
│   ├── HANDOVER.md          # Передача салону, Telegram, VK
│   ├── DEPLOY.md            # Деплой на Timeweb
│   └── Pamyatka-dlya-salona.pdf
├── public/                  # Статика + PHP API (копируется в dist при сборке)
│   ├── api/                 # booking.php, admin.php, config.php, data/
│   ├── admin/               # Админка записей
│   └── images/              # Фото салона и мастеров
├── scripts/                 # Вспомогательные скрипты для dev
├── src/
│   ├── components/          # Секции лендинга и модалка записи
│   ├── config/              # Контакты с сайта
│   └── data/                # Мастера, прайс, отзывы (для UI)
├── index.html
├── package.json
└── vite.config.js
```

## Документация

Полный список: **[docs/README.md](docs/README.md)**

| Важное | Файл |
|--------|------|
| Передача салону | [docs/HANDOVER.md](docs/HANDOVER.md) |
| Деплой | [docs/DEPLOY.md](docs/DEPLOY.md) |
| Памятка PDF | [docs/Pamyatka-dlya-salona.pdf](docs/Pamyatka-dlya-salona.pdf) |

## Деплой (кратко)

1. `npm run build`
2. Загрузить **содержимое** `dist/` в `public_html` на Timeweb
3. **Не перезаписывать:** `api/config.php`, `api/data/bookings.db`

Подробно: [docs/DEPLOY.md](docs/DEPLOY.md)

## Технологии

React 18 · Vite · Tailwind CSS · PHP · SQLite
