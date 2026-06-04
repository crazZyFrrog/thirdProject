/**
 * Галерея салона и работ.
 * Файлы: public/images/salon/, public/images/works/
 */

export const gallerySpans = ['normal', 'tall', 'normal', 'wide', 'normal', 'tall', 'normal', 'normal', 'tall', 'normal']

const salonAlts = [
  'Интерьер салона Мастерская красоты ЛТ',
  'Зона ожидания в салоне',
  'Рабочее место мастера',
  'Салон на ул. Глаголева, Калуга',
  'Уютная атмосфера салона',
  'Интерьер парикмахерского зала',
  'Маникюрный кабинет',
  'Салон красоты Мастерская ЛТ',
  'Пространство для клиентов',
  'Интерьер мастерской красоты',
  'Зал салона',
  'Рабочая зона мастеров',
  'Салон Мастерская ЛТ — Калуга',
  'Интерьер салона',
]

export const salonImages = Array.from({ length: 14 }, (_, i) => {
  const n = i + 1
  return {
    src: `/images/salon/int${n}.jpg`,
    alt: salonAlts[i] ?? `Интерьер салона — фото ${n}`,
    span: gallerySpans[i % gallerySpans.length],
  }
})

export const workImages = Array.from({ length: 31 }, (_, i) => {
  const n = i + 1
  return {
    src: `/images/works/ph${n}.jpg`,
    alt: `Работа мастера — Мастерская красоты ЛТ, фото ${n}`,
    span: gallerySpans[i % gallerySpans.length],
  }
})
