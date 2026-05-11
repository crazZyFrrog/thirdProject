# Инструкция по развертыванию

## Локальная разработка

1. Установите зависимости:
```bash
npm install
```

2. Запустите dev-сервер:
```bash
npm run dev
```

3. Откройте браузер: http://localhost:5173/

## Продакшен сборка

### Сборка проекта

```bash
npm run build
```

Готовые файлы будут в папке `dist/`

### Предпросмотр сборки

```bash
npm run preview
```

## Развертывание на Netlify

1. Создайте аккаунт на [Netlify](https://netlify.com)
2. Подключите ваш Git репозиторий
3. Настройки сборки:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy!

## Развертывание на Vercel

1. Создайте аккаунт на [Vercel](https://vercel.com)
2. Импортируйте проект из Git
3. Vercel автоматически определит настройки
4. Deploy!

## Развертывание на GitHub Pages

1. Установите gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Добавьте в `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/repository-name",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Обновите `vite.config.js`:
```js
export default defineConfig({
  plugins: [react()],
  base: '/repository-name/'
})
```

4. Деплой:
```bash
npm run deploy
```

## Переменные окружения

Создайте файл `.env` для локальной разработки:

```
VITE_PHONE_NUMBER=+79991234567
VITE_EMAIL=info@yourmaster.ru
VITE_WHATSAPP_NUMBER=79991234567
VITE_INSTAGRAM_URL=https://instagram.com/yourmaster
```

## Оптимизация

### Добавление изображений

1. Поместите изображения в `public/images/`
2. Используйте оптимизированные форматы (WebP, AVIF)
3. Добавьте lazy loading

### Настройка SEO

1. Обновите `index.html`:
   - meta description
   - meta keywords
   - Open Graph теги
   - Twitter Card теги

2. Создайте `public/robots.txt`
3. Создайте `public/sitemap.xml`

### Google Analytics

Добавьте в `index.html`:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Yandex Metrika

```html
<!-- Yandex.Metrika counter -->
<script type="text/javascript" >
   (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();
   for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
   k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym(XXXXXXXX, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
   });
</script>
```

## Чеклист перед деплоем

- [ ] Обновлены все контактные данные
- [ ] Добавлены реальные изображения
- [ ] Настроены мета-теги
- [ ] Проверена адаптивность на всех устройствах
- [ ] Протестированы все ссылки
- [ ] Добавлен favicon
- [ ] Настроена аналитика
- [ ] Проверена скорость загрузки
- [ ] Настроен SSL сертификат
- [ ] Протестированы формы

## Поддержка

Если возникли вопросы, проверьте:
- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
