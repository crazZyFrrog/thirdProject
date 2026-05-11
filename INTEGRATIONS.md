# Интеграции и расширения

## Форма записи онлайн

### 1. YClients (рекомендуется)

YClients - популярная CRM для салонов красоты с онлайн-записью.

**Интеграция:**

```jsx
// Создайте компонент BookingForm.jsx
const BookingForm = () => {
  return (
    <div className="w-full">
      <iframe
        src="https://n123456.yclients.com/company/123456/menu"
        width="100%"
        height="800px"
        frameBorder="0"
        title="Онлайн запись"
      ></iframe>
    </div>
  )
}
```

### 2. EasyWeek

**Виджет записи:**

```html
<!-- Добавьте в index.html перед </body> -->
<script src="https://widget.easyweek.io/dist/js/widget.js"></script>
<script>
  EasyweekWidget.init({
    id: 'your-business-id',
    type: 'button',
    buttonText: 'Записаться онлайн'
  });
</script>
```

### 3. Простая форма с Email

```jsx
// src/components/SimpleBookingForm.jsx
import React, { useState } from 'react'

const SimpleBookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    date: '',
    message: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Отправка через EmailJS, Formspree или ваш backend
    const response = await fetch('/api/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    
    if (response.ok) {
      alert('Спасибо! Мы свяжемся с вами в ближайшее время.')
      setFormData({ name: '', phone: '', service: '', date: '', message: '' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ваше имя
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Телефон
        </label>
        <input
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Услуга
        </label>
        <select
          required
          value={formData.service}
          onChange={(e) => setFormData({...formData, service: e.target.value})}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
        >
          <option value="">Выберите услугу</option>
          <option value="haircut">Женская стрижка</option>
          <option value="coloring">Окрашивание</option>
          <option value="complex">Стрижка + окрашивание</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Желаемая дата
        </label>
        <input
          type="date"
          required
          value={formData.date}
          onChange={(e) => setFormData({...formData, date: e.target.value})}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Комментарий (необязательно)
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
        ></textarea>
      </div>

      <button type="submit" className="btn-primary w-full">
        Отправить заявку
      </button>
    </form>
  )
}

export default SimpleBookingForm
```

## EmailJS (отправка email без backend)

1. Зарегистрируйтесь на [EmailJS](https://www.emailjs.com/)
2. Установите пакет:

```bash
npm install @emailjs/browser
```

3. Используйте в компоненте:

```jsx
import emailjs from '@emailjs/browser'

const sendEmail = (formData) => {
  emailjs.send(
    'YOUR_SERVICE_ID',
    'YOUR_TEMPLATE_ID',
    {
      name: formData.name,
      phone: formData.phone,
      service: formData.service,
      date: formData.date,
      message: formData.message
    },
    'YOUR_PUBLIC_KEY'
  )
  .then((result) => {
    console.log('Email sent!', result.text)
  })
  .catch((error) => {
    console.log('Error:', error.text)
  })
}
```

## Formspree (простая форма)

1. Зарегистрируйтесь на [Formspree](https://formspree.io/)
2. Создайте форму:

```jsx
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
  <input type="text" name="name" required />
  <input type="email" name="email" required />
  <input type="tel" name="phone" required />
  <button type="submit">Отправить</button>
</form>
```

## Google Maps

### Яндекс Карты

```jsx
// src/components/Map.jsx
const Map = () => {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <h2 className="heading-2 mb-12 text-center">Как нас найти</h2>
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <iframe
            src="https://yandex.ru/map-widget/v1/?um=constructor:YOUR_MAP_ID"
            width="100%"
            height="500"
            frameBorder="0"
            allowFullScreen
            title="Карта"
          ></iframe>
        </div>
      </div>
    </section>
  )
}
```

### Google Maps

```jsx
<iframe
  src="https://www.google.com/maps/embed?pb=YOUR_EMBED_CODE"
  width="100%"
  height="500"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
></iframe>
```

## Instagram Feed

### React Instagram Embed

```bash
npm install react-instagram-embed
```

```jsx
import InstagramEmbed from 'react-instagram-embed'

const InstagramSection = () => {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <h2 className="heading-2 mb-12 text-center">
          Мы в Instagram
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <InstagramEmbed
            url="https://www.instagram.com/p/POST_ID/"
            maxWidth={400}
            hideCaption={false}
            containerTagName="div"
          />
          {/* Добавьте больше постов */}
        </div>
      </div>
    </section>
  )
}
```

## Чат-боты

### Jivo Chat

```html
<!-- Добавьте в index.html перед </body> -->
<script src="//code.jivo.ru/widget/YOUR_WIDGET_ID" async></script>
```

### Telegram Widget

```html
<script
  async
  src="https://telegram.org/js/telegram-widget.js?22"
  data-telegram-login="YOUR_BOT_NAME"
  data-size="large"
  data-userpic="false"
></script>
```

## Галерея работ

### React Image Gallery

```bash
npm install react-image-gallery
```

```jsx
import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'

const Gallery = () => {
  const images = [
    {
      original: '/images/work-1.jpg',
      thumbnail: '/images/work-1-thumb.jpg',
      description: 'Стрижка каскад'
    },
    // Добавьте больше изображений
  ]

  return (
    <section className="section-padding">
      <div className="container-custom">
        <h2 className="heading-2 mb-12 text-center">Наши работы</h2>
        <div className="max-w-4xl mx-auto">
          <ImageGallery items={images} />
        </div>
      </div>
    </section>
  )
}
```

## Модальное окно записи

```jsx
// src/components/BookingModal.jsx
import React, { useState } from 'react'
import { X } from 'lucide-react'

const BookingModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="p-8">
          <h2 className="heading-2 mb-6">Записаться на прием</h2>
          {/* Ваша форма здесь */}
        </div>
      </div>
    </div>
  )
}

export default BookingModal
```

**Использование:**

```jsx
// В App.jsx или другом компоненте
const [showModal, setShowModal] = useState(false)

<button onClick={() => setShowModal(true)}>
  Записаться
</button>

<BookingModal 
  isOpen={showModal} 
  onClose={() => setShowModal(false)} 
/>
```

## Отзывы с сервисов

### Yandex Reviews Widget

```html
<div id="yandex-reviews"></div>
<script>
  (function(w, d, n, s, t) {
    w[n] = w[n] || [];
    w[n].push(function() {
      Ya.Context.AdvManager.render({
        blockId: "YOUR_BLOCK_ID",
        renderTo: "yandex-reviews"
      })
    })
  })(window, document, "yandexContextAsyncCallbacks")
</script>
```

### Google Reviews

Используйте сервис типа [Elfsight](https://elfsight.com/google-reviews-widget/) для виджета отзывов.

## Аналитика событий

### Google Analytics события

```jsx
// Отслеживание кликов по кнопкам
const handleBookingClick = () => {
  // Google Analytics
  window.gtag('event', 'click', {
    'event_category': 'Booking',
    'event_label': 'Hero Section'
  })
  
  // Yandex Metrika
  window.ym(XXXXXXXX, 'reachGoal', 'booking_click')
}

<button onClick={handleBookingClick}>
  Записаться
</button>
```

## Cookie Consent

```bash
npm install react-cookie-consent
```

```jsx
import CookieConsent from "react-cookie-consent"

<CookieConsent
  location="bottom"
  buttonText="Принимаю"
  cookieName="cookieConsent"
  style={{ background: "#2B373B" }}
  buttonStyle={{ 
    background: "#4CAF50", 
    color: "#fff",
    fontSize: "14px",
    borderRadius: "8px"
  }}
>
  Этот сайт использует cookies для улучшения пользовательского опыта.
</CookieConsent>
```

## Telegram уведомления

```jsx
// Backend endpoint для отправки в Telegram
const sendToTelegram = async (formData) => {
  const botToken = 'YOUR_BOT_TOKEN'
  const chatId = 'YOUR_CHAT_ID'
  
  const message = `
🆕 Новая заявка!

👤 Имя: ${formData.name}
📱 Телефон: ${formData.phone}
💇 Услуга: ${formData.service}
📅 Дата: ${formData.date}
💬 Комментарий: ${formData.message}
  `
  
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message
    })
  })
}
```

## SEO оптимизация

### React Helmet для динамических мета-тегов

```bash
npm install react-helmet-async
```

```jsx
import { Helmet } from 'react-helmet-async'

const App = () => {
  return (
    <>
      <Helmet>
        <title>Парикмахер с опытом 25+ лет | Семейная парикмахерская</title>
        <meta name="description" content="Ваше описание" />
        <meta property="og:title" content="Ваш заголовок" />
        <meta property="og:description" content="Ваше описание" />
        <meta property="og:image" content="/images/og-image.jpg" />
      </Helmet>
      {/* Ваш контент */}
    </>
  )
}
```
