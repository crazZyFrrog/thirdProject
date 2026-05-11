# SEO Оптимизация

## Базовые мета-теги

Обновите `index.html`:

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Основные мета-теги -->
    <title>Парикмахер с опытом 25+ лет в Москве | Семейная парикмахерская</title>
    <meta name="description" content="Семейная парикмахерская с опытом более 25 лет. Стрижки, окрашивание и уход без спешки. Индивидуальный подход и комфортная атмосфера. Запись онлайн." />
    <meta name="keywords" content="парикмахер москва, женская стрижка, окрашивание волос, опытный парикмахер, семейная парикмахерская" />
    <meta name="author" content="Ваш Мастер" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://yourwebsite.ru/" />
    <meta property="og:title" content="Парикмахер с опытом 25+ лет | Семейная парикмахерская" />
    <meta property="og:description" content="Стрижки, окрашивание и уход без спешки. Индивидуальный подход и комфортная атмосфера." />
    <meta property="og:image" content="https://yourwebsite.ru/images/og-image.jpg" />
    <meta property="og:locale" content="ru_RU" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://yourwebsite.ru/" />
    <meta property="twitter:title" content="Парикмахер с опытом 25+ лет" />
    <meta property="twitter:description" content="Стрижки, окрашивание и уход без спешки" />
    <meta property="twitter:image" content="https://yourwebsite.ru/images/og-image.jpg" />
    
    <!-- Geo tags -->
    <meta name="geo.region" content="RU-MOW" />
    <meta name="geo.placename" content="Москва" />
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://yourwebsite.ru/" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

## Структурированные данные (Schema.org)

Добавьте в `index.html` перед `</body>`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HairSalon",
  "name": "Ваш Мастер",
  "image": "https://yourwebsite.ru/images/salon.jpg",
  "@id": "https://yourwebsite.ru",
  "url": "https://yourwebsite.ru",
  "telephone": "+7-999-123-45-67",
  "priceRange": "₽₽",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "ул. Примерная, д. 1",
    "addressLocality": "Москва",
    "postalCode": "123456",
    "addressCountry": "RU"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 55.7558,
    "longitude": 37.6173
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "10:00",
      "closes": "20:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "11:00",
      "closes": "18:00"
    }
  ],
  "sameAs": [
    "https://www.instagram.com/yourmaster",
    "https://vk.com/yourmaster"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "87"
  }
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Ваш Мастер",
  "description": "Семейная парикмахерская с опытом более 25 лет",
  "image": "https://yourwebsite.ru/images/salon.jpg",
  "telephone": "+7-999-123-45-67",
  "email": "info@yourmaster.ru",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "ул. Примерная, д. 1",
    "addressLocality": "Москва",
    "addressRegion": "МО",
    "postalCode": "123456",
    "addressCountry": "RU"
  },
  "priceRange": "₽₽",
  "paymentAccepted": "Cash, Credit Card"
}
</script>
```

## robots.txt

Создайте `public/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://yourwebsite.ru/sitemap.xml
```

## sitemap.xml

Создайте `public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourwebsite.ru/</loc>
    <lastmod>2026-05-11</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

## Оптимизация изображений

### 1. Используйте современные форматы

```jsx
<picture>
  <source srcSet="/images/hero.avif" type="image/avif" />
  <source srcSet="/images/hero.webp" type="image/webp" />
  <img src="/images/hero.jpg" alt="Парикмахер за работой" />
</picture>
```

### 2. Lazy loading

```jsx
<img 
  src="/images/photo.jpg" 
  alt="Описание" 
  loading="lazy"
  decoding="async"
/>
```

### 3. Размеры изображений

- Hero: 1920x1080px (2:1)
- OG Image: 1200x630px
- Cards: 800x600px
- Thumbnails: 400x300px

## Семантическая разметка

Используйте правильные HTML5 теги:

```jsx
<header>
  <nav>
    {/* Навигация */}
  </nav>
</header>

<main>
  <article>
    <h1>Главный заголовок</h1>
    <section>
      <h2>Подзаголовок секции</h2>
    </section>
  </article>
</main>

<aside>
  {/* Дополнительная информация */}
</aside>

<footer>
  {/* Футер */}
</footer>
```

## Accessibility (a11y)

### 1. Alt-теги для изображений

```jsx
<img 
  src="/images/haircut.jpg" 
  alt="Женская стрижка каскад, вид сзади"
/>
```

### 2. ARIA-метки

```jsx
<button 
  aria-label="Открыть меню навигации"
  onClick={toggleMenu}
>
  <MenuIcon />
</button>
```

### 3. Контраст

Используйте инструменты проверки контраста:
- Минимум 4.5:1 для обычного текста
- Минимум 3:1 для крупного текста

### 4. Клавиатурная навигация

```jsx
<a 
  href="#main-content"
  className="sr-only focus:not-sr-only"
>
  Перейти к основному содержимому
</a>
```

## Производительность

### 1. Code Splitting

```jsx
import { lazy, Suspense } from 'react'

const Gallery = lazy(() => import('./components/Gallery'))

<Suspense fallback={<LoadingSpinner />}>
  <Gallery />
</Suspense>
```

### 2. Оптимизация шрифтов

```html
<link 
  rel="preload" 
  href="/fonts/inter.woff2" 
  as="font" 
  type="font/woff2" 
  crossorigin
/>
```

### 3. Минимизация CSS

В `vite.config.js`:

```js
export default defineConfig({
  plugins: [react()],
  build: {
    cssCodeSplit: true,
    minify: 'terser'
  }
})
```

## Локальное SEO

### 1. Google My Business

Зарегистрируйте бизнес в Google My Business:
- https://business.google.com/

### 2. Яндекс.Справочник

Добавьте организацию:
- https://sprav.yandex.ru/

### 3. 2GIS

Зарегистрируйте компанию:
- https://2gis.ru/business

## Ключевые слова

### Основные запросы:
- парикмахер [город]
- парикмахерская [район]
- женская стрижка [город]
- окрашивание волос [город]
- опытный парикмахер
- семейная парикмахерская

### Используйте в:
- Заголовках (H1, H2, H3)
- Мета-описаниях
- Alt-тегах изображений
- URL (если возможно)
- Тексте (естественно)

## Контент-маркетинг

### Блог (опционально)

Создайте раздел с полезными статьями:
- "Как выбрать стрижку по форме лица"
- "Уход за окрашенными волосами"
- "Тренды в стрижках 2026"
- "Как подготовиться к окрашиванию"

### FAQ

Расширьте секцию FAQ популярными вопросами из поисковых систем.

## Мониторинг

### Google Search Console

1. Подтвердите владение сайтом
2. Отправьте sitemap.xml
3. Мониторьте ошибки и позиции

### Яндекс.Вебмастер

1. Добавьте сайт
2. Проверьте индексацию
3. Анализируйте запросы

## Чеклист SEO

- [ ] Уникальные title и description
- [ ] Структурированные данные Schema.org
- [ ] robots.txt и sitemap.xml
- [ ] Alt-теги для всех изображений
- [ ] Мобильная адаптивность
- [ ] Скорость загрузки < 3 сек
- [ ] HTTPS сертификат
- [ ] Семантическая разметка
- [ ] Внутренняя перелинковка
- [ ] Google My Business
- [ ] Яндекс.Справочник
- [ ] Open Graph метки
- [ ] Canonical URL
- [ ] Хлебные крошки
- [ ] 404 страница
- [ ] Контент > 1000 слов (для главной)

## Инструменты проверки

- **PageSpeed Insights**: https://pagespeed.web.dev/
- **Lighthouse**: встроен в Chrome DevTools
- **Google Search Console**: https://search.google.com/search-console
- **Яндекс.Вебмастер**: https://webmaster.yandex.ru/
- **Schema Validator**: https://validator.schema.org/
- **Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly
