/**
 * Галерея салона и работ.
 * Файлы: public/images/salon/, public/images/works/
 */

export const gallerySpans = ['normal', 'tall', 'normal', 'wide', 'normal', 'tall', 'normal', 'normal', 'tall', 'normal']

/** Fisher–Yates: случайный порядок + заново расставляет span для сетки */
export function shuffleGalleryImages(images) {
  const shuffled = [...images]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.map((image, i) => ({
    ...image,
    span: gallerySpans[i % gallerySpans.length],
  }))
}

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
