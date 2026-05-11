# Best Practices

## Работа с изображениями

### Добавление реальных фотографий

1. Создайте структуру папок:

```
public/
  images/
    hero/
      main.jpg
      main.webp
      main-mobile.jpg
    services/
      haircut.jpg
      coloring.jpg
      styling.jpg
    gallery/
      work-1.jpg
      work-2.jpg
      ...
    testimonials/
      client-1.jpg
      client-2.jpg
      ...
```

2. Обновите Hero секцию:

```jsx
// src/components/Hero.jsx
<div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5]">
  <img 
    src="/images/hero/main.jpg" 
    srcSet="/images/hero/main-mobile.jpg 640w, /images/hero/main.jpg 1280w"
    sizes="(max-width: 640px) 640px, 1280px"
    alt="Опытный парикмахер за работой"
    className="w-full h-full object-cover"
    loading="eager"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
</div>
```

### Оптимизация изображений

**Онлайн инструменты:**
- [TinyPNG](https://tinypng.com/) - сжатие PNG/JPG
- [Squoosh](https://squoosh.app/) - конвертация в WebP/AVIF
- [ImageOptim](https://imageoptim.com/) - оптимизация для Mac

**Рекомендуемые размеры:**

| Изображение | Размер | Формат |
|-------------|--------|--------|
| Hero Desktop | 1920x1280px | JPG/WebP |
| Hero Mobile | 640x853px | JPG/WebP |
| Service Card | 800x600px | JPG/WebP |
| Gallery Thumb | 400x300px | JPG/WebP |
| OG Image | 1200x630px | JPG |
| Favicon | 512x512px | PNG |

## Типографика

### Иерархия заголовков

```jsx
// ПРАВИЛЬНО
<h1>Главный заголовок страницы (один на страницу)</h1>
  <h2>Секция 1</h2>
    <h3>Подсекция</h3>
  <h2>Секция 2</h2>

// НЕПРАВИЛЬНО
<h1>Заголовок</h1>
  <h3>Подзаголовок</h3> // Пропущен h2
```

### Оптимальная длина строк

```jsx
// Для читаемости ограничивайте ширину текста
<p className="max-w-2xl mx-auto text-lg leading-relaxed">
  Длинный текст...
</p>
```

### Размеры шрифтов

```jsx
// Мобильные устройства
text-base (16px) - основной текст
text-sm (14px) - второстепенный текст
text-xs (12px) - подписи

// Desktop
text-lg (18px) - основной текст
text-xl (20px) - крупный текст
text-2xl+ - заголовки
```

## Цветовая палитра

### Создание гармоничной схемы

```js
// tailwind.config.js
colors: {
  primary: {
    // Основной цвет - используйте для фонов и больших блоков
    50: '#faf8f5',  // Очень светлый
    100: '#f5f1ea', // Светлый
    500: '#b59670', // Средний
    700: '#8c6c52', // Темный
    900: '#5e4a3c', // Очень темный
  },
  accent: {
    // Акцентный цвет - для кнопок, ссылок, важных элементов
    // Должен контрастировать с primary
    500: '#ca9476',
    600: '#b87555', // Основной акцент
    700: '#a96249',
  }
}
```

### Правила использования цветов

1. **Фоны:**
   - Белый / primary-50 для основных секций
   - gray-50 / primary-100 для чередующихся секций
   - accent-600 для CTA секций

2. **Текст:**
   - gray-900 для основного текста
   - gray-600 для второстепенного
   - white для текста на темном фоне

3. **Кнопки:**
   - accent-600 для primary кнопок
   - white с border для secondary кнопок

## Адаптивность

### Breakpoints Tailwind

```jsx
// sm: 640px - small tablets
// md: 768px - tablets
// lg: 1024px - laptops
// xl: 1280px - desktops
// 2xl: 1536px - large desktops

// Пример использования
<div className="
  px-4         // Mobile: padding 16px
  sm:px-6      // Small tablets: padding 24px
  lg:px-8      // Laptops: padding 32px
  
  text-3xl     // Mobile: 30px
  md:text-4xl  // Tablets: 36px
  lg:text-5xl  // Laptops: 48px
">
```

### Mobile-First подход

```jsx
// ПРАВИЛЬНО - начинайте с мобильных стилей
<div className="
  text-base      // базовый размер
  md:text-lg     // увеличиваем на планшетах
  lg:text-xl     // еще больше на десктопе
">

// НЕПРАВИЛЬНО
<div className="
  text-xl        // слишком крупно на мобильных
  md:text-base   // уменьшаем (не mobile-first)
">
```

### Тестирование

Проверяйте дизайн на:
- iPhone SE (375px) - минимальная ширина
- iPhone 12 Pro (390px)
- iPad (768px)
- Laptop (1280px)
- Desktop (1920px)

## Производительность

### Lazy Loading

```jsx
// Для изображений за пределами viewport
<img src="/image.jpg" loading="lazy" alt="..." />

// Для компонентов
const Gallery = lazy(() => import('./components/Gallery'))

<Suspense fallback={<Skeleton />}>
  <Gallery />
</Suspense>
```

### Оптимизация Tailwind

В `tailwind.config.js`:

```js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Purge неиспользуемые классы в продакшене
  // Происходит автоматически при сборке
}
```

### Bundle Size

Проверяйте размер бандла:

```bash
npm run build

# Анализ размера
npx vite-bundle-visualizer
```

## Доступность (A11y)

### Контрастность

Используйте инструменты для проверки:
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Chrome DevTools > Lighthouse

Минимальные требования WCAG:
- AA: 4.5:1 для обычного текста
- AA: 3:1 для крупного текста (18px+)
- AAA: 7:1 для обычного текста (рекомендуется)

### Фокус-индикаторы

```jsx
// Добавляйте видимые focus states
<button className="
  focus:outline-none 
  focus:ring-4 
  focus:ring-accent-200
  focus:ring-offset-2
">
  Кнопка
</button>
```

### Skip Links

```jsx
// В начале <body>
<a 
  href="#main-content"
  className="
    sr-only 
    focus:not-sr-only 
    focus:absolute 
    focus:top-4 
    focus:left-4 
    focus:z-50
    focus:bg-white
    focus:px-4
    focus:py-2
    focus:rounded
  "
>
  Перейти к основному содержимому
</a>

// В main компоненте
<main id="main-content">
  {/* Контент */}
</main>
```

### ARIA labels

```jsx
// Для иконок без текста
<button aria-label="Открыть меню навигации">
  <MenuIcon />
</button>

// Для декоративных изображений
<img src="/decoration.svg" alt="" role="presentation" />

// Для состояний
<button 
  aria-expanded={isOpen}
  aria-controls="menu"
>
  Меню
</button>
```

## Формы

### Валидация

```jsx
const [errors, setErrors] = useState({})

const validateForm = (data) => {
  const newErrors = {}
  
  if (!data.name.trim()) {
    newErrors.name = 'Введите ваше имя'
  }
  
  if (!/^\+?[0-9]{10,}$/.test(data.phone)) {
    newErrors.phone = 'Неверный формат телефона'
  }
  
  if (!data.email.includes('@')) {
    newErrors.email = 'Неверный email'
  }
  
  return newErrors
}

const handleSubmit = (e) => {
  e.preventDefault()
  const newErrors = validateForm(formData)
  
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors)
    return
  }
  
  // Отправка формы
}
```

### Пользовательский опыт

```jsx
<form onSubmit={handleSubmit} className="space-y-6">
  <div>
    <label 
      htmlFor="name"
      className="block text-sm font-medium text-gray-700 mb-2"
    >
      Ваше имя *
    </label>
    <input
      id="name"
      type="text"
      required
      aria-required="true"
      aria-invalid={errors.name ? "true" : "false"}
      aria-describedby={errors.name ? "name-error" : undefined}
      className={`
        w-full px-4 py-3 rounded-xl border
        ${errors.name 
          ? 'border-red-500 focus:ring-red-500' 
          : 'border-gray-300 focus:ring-accent-500'
        }
        focus:ring-2 focus:border-transparent
        transition-colors
      `}
      value={formData.name}
      onChange={(e) => {
        setFormData({...formData, name: e.target.value})
        if (errors.name) {
          setErrors({...errors, name: undefined})
        }
      }}
    />
    {errors.name && (
      <p id="name-error" className="mt-2 text-sm text-red-600">
        {errors.name}
      </p>
    )}
  </div>
  
  <button 
    type="submit"
    disabled={isSubmitting}
    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {isSubmitting ? 'Отправка...' : 'Отправить'}
  </button>
</form>
```

## Анимации

### Принципы

1. **Умеренность** - не переборщите
2. **Цель** - анимация должна улучшать UX
3. **Производительность** - используйте transform и opacity
4. **Респект** - учитывайте prefers-reduced-motion

```jsx
// Респект к пользовательским настройкам
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Оптимизированные анимации

```jsx
// ХОРОШО - только transform и opacity
<div className="
  transition-transform 
  duration-300 
  hover:scale-105
  hover:opacity-90
">

// ПЛОХО - триггерит reflow
<div className="
  transition-all
  hover:w-full
  hover:h-full
">
```

## Git Best Practices

### Commit Messages

```bash
# Формат: <type>: <subject>

feat: добавлена секция с ценами
fix: исправлена адаптивность hero секции
style: обновлена цветовая схема
docs: добавлена документация по деплою
refactor: рефакторинг компонента Header
perf: оптимизированы изображения
test: добавлены тесты для формы
chore: обновлены зависимости
```

### Ветки

```bash
main - продакшен версия
develop - разработка
feature/new-gallery - новая фича
fix/mobile-menu - исправление бага
```

## Безопасность

### Защита от XSS

```jsx
// React автоматически экранирует данные
<div>{userInput}</div> // безопасно

// Но будьте осторожны с dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
```

### Защита форм

```jsx
// CSRF токен (если используете backend)
<input type="hidden" name="csrf_token" value={csrfToken} />

// Rate limiting на backend
// Honeypot для ботов
<input 
  type="text" 
  name="website"  // боты заполнят это поле
  style={{ display: 'none' }}
  tabIndex="-1"
  autoComplete="off"
/>
```

### Валидация на backend

```js
// ВСЕГДА валидируйте данные на сервере
// Не полагайтесь только на клиентскую валидацию
app.post('/api/booking', (req, res) => {
  const { name, phone, email } = req.body
  
  // Валидация
  if (!name || !phone || !email) {
    return res.status(400).json({ error: 'Заполните все поля' })
  }
  
  // Санитизация
  const cleanName = sanitize(name)
  const cleanPhone = sanitize(phone)
  
  // Обработка...
})
```

## Мониторинг ошибок

### Sentry Integration

```bash
npm install @sentry/react
```

```jsx
// src/main.jsx
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})

// Оберните App
<Sentry.ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</Sentry.ErrorBoundary>
```

## Чеклист перед запуском

- [ ] Все placeholder изображения заменены
- [ ] Все контактные данные обновлены
- [ ] Работают все ссылки
- [ ] Форма записи функционирует
- [ ] Проверена адаптивность
- [ ] Lighthouse score > 90
- [ ] Настроена аналитика
- [ ] Добавлены мета-теги
- [ ] robots.txt и sitemap.xml
- [ ] SSL сертификат установлен
- [ ] Проверена доступность (a11y)
- [ ] Настроен мониторинг ошибок
- [ ] Созданы резервные копии
- [ ] Подготовлена документация
- [ ] Проведено тестирование на реальных устройствах
