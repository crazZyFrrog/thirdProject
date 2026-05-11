# Быстрый старт

## Шаг 1: Установка (уже выполнено ✓)

Зависимости уже установлены. Если нужно переустановить:

```bash
npm install
```

## Шаг 2: Запуск локального сервера

```bash
npm run dev
```

Откройте в браузере: **http://localhost:5173/**

## Шаг 3: Первые настройки

### 3.1 Контактные данные

**Файлы для редактирования:**
- `src/components/Header.jsx` - телефон в header
- `src/components/Footer.jsx` - все контакты
- `src/components/WhatsAppButton.jsx` - WhatsApp ссылка

**Что заменить:**
- `+7 (999) 123-45-67` → ваш телефон
- `info@yourmaster.ru` → ваш email
- `79991234567` → ваш WhatsApp (без +)

### 3.2 Название и брендинг

**Файлы:**
- `src/components/Header.jsx`
- `src/components/Footer.jsx`
- `index.html` (title)

**Замените:**
```jsx
"Ваш Мастер" → "Ваше название"
```

### 3.3 Адрес

**Файл:** `src/components/Footer.jsx`

```jsx
<span>г. Москва, ул. Примерная, д. 1</span>
```

Замените на ваш реальный адрес.

### 3.4 Режим работы

**Файл:** `src/components/Footer.jsx`

```jsx
<div className="flex justify-between">
  <span>Пн-Пт:</span>
  <span className="text-white">10:00 - 20:00</span>
</div>
```

Обновите на ваше расписание.

## Шаг 4: Текстовый контент

### 4.1 Главный заголовок

**Файл:** `src/components/Hero.jsx`

```jsx
<h1 className="heading-1">
  Парикмахер, которому доверяют уже более 25 лет
</h1>
```

### 4.2 Цены

**Файл:** `src/components/Pricing.jsx`

```jsx
{
  title: 'Женская стрижка',
  price: 'от 2500₽',
  description: '...',
}
```

### 4.3 Отзывы

**Файл:** `src/components/Testimonials.jsx`

Замените примеры отзывов на реальные.

### 4.4 FAQ

**Файл:** `src/components/FAQ.jsx`

Добавьте/измените вопросы и ответы.

## Шаг 5: Изображения

### 5.1 Создайте папку

```
public/
  images/
    hero.jpg          (главное фото)
    salon.jpg         (фото салона)
    services-1.jpg    (услуга 1)
    services-2.jpg    (услуга 2)
```

### 5.2 Обновите Hero

**Файл:** `src/components/Hero.jsx`

Замените placeholder на:

```jsx
<img 
  src="/images/hero.jpg" 
  alt="Описание"
  className="w-full h-full object-cover"
/>
```

### 5.3 Оптимизируйте изображения

Используйте:
- [TinyPNG](https://tinypng.com/) - сжатие
- [Squoosh](https://squoosh.app/) - конвертация в WebP

Рекомендуемые размеры:
- Hero: 1920x1280px
- Карточки: 800x600px

## Шаг 6: Цвета (опционально)

**Файл:** `tailwind.config.js`

```js
colors: {
  primary: {
    // Ваши цвета
    600: '#b59670',
  },
  accent: {
    600: '#b87555',
  }
}
```

Используйте [Coolors.co](https://coolors.co/) для подбора палитры.

## Шаг 7: Социальные сети

**Файл:** `src/components/Footer.jsx`

```jsx
<a 
  href="https://instagram.com/your_username"
  target="_blank"
>
  <Instagram size={20} />
</a>
```

## Шаг 8: Форма записи

### Вариант А: WhatsApp (уже настроено)

Клиенты пишут в WhatsApp при клике на кнопки "Записаться".

### Вариант Б: Своя форма

Смотрите `INTEGRATIONS.md` для интеграции:
- EmailJS (email уведомления)
- Formspree (простая форма)
- YClients (профессиональная CRM)

### Вариант В: Внешний сервис

Замените кнопки на ссылки:

```jsx
<a href="https://yclients.com/..." className="btn-primary">
  Записаться
</a>
```

## Шаг 9: SEO (рекомендуется)

**Файл:** `index.html`

Обновите:
- `<title>` - название для поисковиков
- `<meta name="description">` - описание
- Open Graph теги (для соцсетей)

Подробнее в `SEO.md`.

## Шаг 10: Тестирование

### 10.1 Проверьте на устройствах

- Телефон (iPhone/Android)
- Планшет
- Компьютер

### 10.2 Проверьте функционал

- [ ] Все ссылки работают
- [ ] Кнопки ведут куда нужно
- [ ] WhatsApp открывается правильно
- [ ] Меню работает на мобильных
- [ ] Формы валидируются

### 10.3 Chrome DevTools

F12 → Mobile view → протестируйте разные устройства

## Шаг 11: Сборка для продакшена

```bash
npm run build
```

Готовые файлы в папке `dist/`.

## Шаг 12: Деплой

### Netlify (рекомендуется, бесплатно)

1. Зарегистрируйтесь на [netlify.com](https://netlify.com)
2. Перетащите папку `dist` в Netlify Drop
3. Получите ссылку типа `your-site.netlify.app`
4. Настройте свой домен (опционально)

### Vercel (альтернатива)

1. [vercel.com](https://vercel.com)
2. Импортируйте проект из GitHub
3. Автоматический деплой при каждом commit

Подробнее в `DEPLOY.md`.

## Шаг 13: Аналитика (опционально)

### Google Analytics

1. Создайте аккаунт на [analytics.google.com](https://analytics.google.com)
2. Получите tracking ID
3. Добавьте код в `index.html`

### Яндекс.Метрика

1. [metrika.yandex.ru](https://metrika.yandex.ru)
2. Создайте счетчик
3. Вставьте код

## Полезные команды

```bash
# Запуск разработки
npm run dev

# Сборка
npm run build

# Предпросмотр сборки
npm run preview

# Установка новой библиотеки
npm install package-name
```

## Структура проекта

```
thirdProject/
├── public/              # Статические файлы
│   ├── images/         # Ваши изображения
│   └── favicon.png
├── src/
│   ├── components/     # React компоненты
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── Problem.jsx
│   │   ├── Solution.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── Testimonials.jsx
│   │   ├── Pricing.jsx
│   │   ├── FAQ.jsx
│   │   ├── FinalCTA.jsx
│   │   ├── Footer.jsx
│   │   └── WhatsAppButton.jsx
│   ├── App.jsx         # Главный компонент
│   ├── main.jsx        # Точка входа
│   └── index.css       # Глобальные стили
├── index.html          # HTML шаблон
├── package.json        # Зависимости
├── tailwind.config.js  # Конфиг Tailwind
├── vite.config.js      # Конфиг Vite
└── README.md           # Документация
```

## Файлы документации

- `README.md` - Общее описание проекта
- `QUICK_START.md` - Этот файл
- `CUSTOMIZATION.md` - Детальная кастомизация
- `DEPLOY.md` - Инструкции по деплою
- `INTEGRATIONS.md` - Интеграции (формы, карты, etc.)
- `SEO.md` - SEO оптимизация
- `BEST_PRACTICES.md` - Лучшие практики

## Частые вопросы

### Как изменить цвета?

`tailwind.config.js` → `theme.extend.colors`

### Как добавить новую секцию?

1. Создайте `src/components/NewSection.jsx`
2. Импортируйте в `src/App.jsx`
3. Добавьте `<NewSection />` в нужное место

### Как изменить шрифты?

1. `index.html` → замените Google Fonts ссылку
2. `tailwind.config.js` → обновите `fontFamily`

### Ошибка при запуске?

```bash
# Удалите node_modules и переустановите
rm -rf node_modules
npm install

# Очистите кеш
npm cache clean --force
```

### Как обновить зависимости?

```bash
# Проверить устаревшие
npm outdated

# Обновить все
npm update

# Обновить конкретный пакет
npm install package-name@latest
```

## Поддержка

Если что-то не работает:

1. Проверьте консоль браузера (F12)
2. Проверьте терминал с `npm run dev`
3. Убедитесь, что Node.js >= 18
4. Переустановите зависимости

## Полезные ссылки

- [React Docs](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Vite Docs](https://vitejs.dev/)
- [Lucide Icons](https://lucide.dev/)

---

**Готово! 🎉**

Ваш лендинг готов к работе. Начните с изменения контактных данных и текстов, затем добавьте свои фотографии.

Удачи! 🚀
