# Руководство по кастомизации

## Изменение контактных данных

### 1. Телефон

**Header** (`src/components/Header.jsx`):
```jsx
<a href="tel:+79991234567" ...>
  <span>+7 (999) 123-45-67</span>
</a>
```

**Footer** (`src/components/Footer.jsx`):
```jsx
<a href="tel:+79991234567" ...>
  <span>+7 (999) 123-45-67</span>
</a>
```

### 2. WhatsApp

**WhatsAppButton** (`src/components/WhatsAppButton.jsx`):
```jsx
href="https://wa.me/79991234567?text=Здравствуйте!%20Хочу%20записаться"
```

**FinalCTA** (`src/components/FinalCTA.jsx`):
```jsx
href="https://wa.me/79991234567"
```

### 3. Email

**Footer** (`src/components/Footer.jsx`):
```jsx
<a href="mailto:info@yourmaster.ru" ...>
  <span>info@yourmaster.ru</span>
</a>
```

### 4. Адрес

**Footer** (`src/components/Footer.jsx`):
```jsx
<span>г. Москва, ул. Примерная, д. 1</span>
```

## Изменение цветовой схемы

В файле `tailwind.config.js`:

```js
colors: {
  primary: {
    // Основные цвета (бежевые тона)
    50: '#faf8f5',
    100: '#f5f1ea',
    // ... остальные оттенки
  },
  accent: {
    // Акцентные цвета (теплые оттенки)
    50: '#fdf8f6',
    100: '#f7ede7',
    // ... остальные оттенки
  }
}
```

### Популярные цветовые схемы:

**Элегантный серый:**
```js
primary: {
  600: '#4b5563', // gray-600
}
accent: {
  600: '#1f2937', // gray-800
}
```

**Синий (доверие):**
```js
primary: {
  600: '#3b82f6', // blue-500
}
accent: {
  600: '#1e40af', // blue-800
}
```

**Зеленый (свежесть):**
```js
primary: {
  600: '#10b981', // emerald-500
}
accent: {
  600: '#059669', // emerald-600
}
```

## Изменение шрифтов

В файле `index.html` замените Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONT&display=swap" rel="stylesheet">
```

В `tailwind.config.js`:

```js
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  display: ['Playfair Display', 'serif'],
}
```

### Рекомендуемые комбинации:

1. **Классика:**
   - Заголовки: Playfair Display
   - Текст: Inter

2. **Современный:**
   - Заголовки: Montserrat
   - Текст: Open Sans

3. **Элегантный:**
   - Заголовки: Cormorant Garamond
   - Текст: Lato

## Добавление фотографий

### 1. Hero секция

В `src/components/Hero.jsx` замените:

```jsx
<div className="relative rounded-3xl overflow-hidden ...">
  <img 
    src="/images/hero-image.jpg" 
    alt="Мастер за работой"
    className="w-full h-full object-cover"
  />
</div>
```

### 2. Другие секции

Создайте папку `public/images/` и добавьте изображения:
- `hero-image.jpg` - главное фото (мастер или салон)
- `salon-interior.jpg` - интерьер салона
- `before-after-*.jpg` - фото до/после
- `services-*.jpg` - фото услуг

## Изменение текстов

Все тексты находятся в компонентах и легко редактируются:

### Hero секция (`src/components/Hero.jsx`):
```jsx
<h1 className="heading-1">
  Ваш новый заголовок
</h1>
<p className="text-xl">
  Ваш новый подзаголовок
</p>
```

### Цены (`src/components/Pricing.jsx`):
```jsx
{
  title: 'Женская стрижка',
  price: 'от 2500₽',
  description: 'Описание услуги'
}
```

### Отзывы (`src/components/Testimonials.jsx`):
```jsx
{
  text: 'Текст отзыва',
  author: 'Имя клиента',
  rating: 5
}
```

## Добавление новых секций

1. Создайте компонент в `src/components/NewSection.jsx`:

```jsx
import React from 'react'

const NewSection = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <h2 className="heading-2">Заголовок</h2>
        {/* Ваш контент */}
      </div>
    </section>
  )
}

export default NewSection
```

2. Добавьте в `src/App.jsx`:

```jsx
import NewSection from './components/NewSection'

// В компоненте App:
<NewSection />
```

## Изменение анимаций

В `tailwind.config.js` настройте анимации:

```js
animation: {
  'fade-in': 'fadeIn 0.6s ease-out',
  'slide-up': 'slideUp 0.6s ease-out',
  'scale-in': 'scaleIn 0.5s ease-out',
  // Добавьте свои:
  'bounce-slow': 'bounce 2s infinite',
}
```

## Режим работы

В `src/components/Footer.jsx`:

```jsx
<div className="space-y-2 text-sm">
  <div className="flex justify-between">
    <span>Пн-Пт:</span>
    <span className="text-white">10:00 - 20:00</span>
  </div>
  // ... остальные дни
</div>
```

## Социальные сети

В `src/components/Footer.jsx`:

```jsx
<a 
  href="https://instagram.com/your_username" 
  target="_blank" 
  rel="noopener noreferrer"
>
  <Instagram size={20} />
</a>
```

## Добавление карты

В `src/components/Footer.jsx` или создайте новую секцию:

```jsx
<div className="w-full h-96 rounded-3xl overflow-hidden">
  <iframe
    src="https://yandex.ru/map-widget/v1/?..."
    width="100%"
    height="100%"
    frameBorder="0"
    allowFullScreen
  ></iframe>
</div>
```

## FAQ вопросы

В `src/components/FAQ.jsx`:

```jsx
const faqs = [
  {
    question: 'Ваш вопрос?',
    answer: 'Ваш ответ'
  },
  // Добавьте больше вопросов
]
```

## Кнопки действий (CTA)

Измените поведение кнопок "Записаться":

### Вариант 1: Переход на форму
```jsx
<button onClick={() => window.location.href = '#form'}>
  Записаться
</button>
```

### Вариант 2: Открытие модального окна
```jsx
<button onClick={() => setShowModal(true)}>
  Записаться
</button>
```

### Вариант 3: Переход на внешний сервис
```jsx
<a href="https://yclients.com/..." target="_blank">
  Записаться
</a>
```

## Полезные утилиты Tailwind

```jsx
// Отступы секций
className="section-padding" // px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24

// Контейнер
className="container-custom" // max-w-7xl mx-auto

// Кнопки
className="btn-primary" // основная кнопка
className="btn-secondary" // вторичная кнопка

// Заголовки
className="heading-1" // h1
className="heading-2" // h2
className="heading-3" // h3

// Карточки
className="card-premium" // премиум карточка с hover эффектом
```

## Тестирование изменений

После внесения изменений:

1. Проверьте на разных устройствах
2. Проверьте все ссылки
3. Проверьте формы
4. Проверьте анимации
5. Проверьте скорость загрузки

## Полезные команды

```bash
# Запуск dev-сервера
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр сборки
npm run preview

# Проверка кода
npm run lint
```
