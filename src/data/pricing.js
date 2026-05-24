export const pricingCategories = [
  {
    title: 'Брови и ресницы',
    items: [
      { name: 'Коррекция бровей', price: 'от 400 ₽' },
      { name: 'Окрашивание бровей', price: 'от 400 ₽' },
      { name: 'Окрашивание ресниц', price: 'от 400 ₽' },
    ],
  },
  {
    title: 'Маникюр и педикюр',
    items: [
      { name: 'Коррекция ногтей', price: 'от 2000 ₽' },
      { name: 'Ремонт одного ногтя', price: 'от 250 ₽' },
      { name: 'Покрытие гель-лаком', price: 'от 1800 ₽' },
      { name: 'Аппаратный маникюр', price: 'от 800 ₽' },
      { name: 'Европейский маникюр', price: 'от 800 ₽' },
      { name: 'Классический маникюр', price: 'от 800 ₽' },
      { name: 'Мужской педикюр', price: 'от 2800 ₽' },
      { name: 'Smart педикюр', price: 'от 2700 ₽' },
    ],
  },
  {
    title: 'Причёски и укладки',
    items: [
      { name: 'Причёска', price: 'от 1500 ₽' },
      { name: 'Укладка волос', price: 'от 1000 ₽' },
      { name: 'Мытьё головы', price: '200 ₽' },
    ],
  },
  {
    title: 'Окрашивание',
    items: [
      { name: 'Окрашивание корней', price: 'от 1100 ₽' },
      { name: 'Колорирование волос', price: 'от 4000 ₽' },
      { name: 'Мелирование волос', price: 'от 2000 ₽' },
      { name: 'Окрашивание волос в 1 тон', price: 'от 2000 ₽' },
    ],
  },
  {
    title: 'Стрижки',
    items: [
      { name: 'Стрижка детская', price: 'от 700 ₽' },
      { name: 'Модельная стрижка', price: 'от 700 ₽' },
      { name: 'Удлинённая стрижка', price: 'от 700 ₽' },
      { name: 'Стрижка полубокс', price: 'от 600 ₽' },
      { name: 'Стрижка бокс', price: 'от 600 ₽' },
      { name: 'Стрижка налысо', price: 'от 300 ₽' },
      { name: 'Стрижка каре', price: 'от 700 ₽' },
      { name: 'Стрижка челки', price: 'от 300 ₽' },
    ],
  },
]

export const bookingServiceOptions = [
  { group: 'Брови и ресницы', options: [
    { value: 'brows-correction', label: 'Коррекция бровей' },
    { value: 'brows-coloring', label: 'Окрашивание бровей' },
    { value: 'lashes-coloring', label: 'Окрашивание ресниц' },
  ]},
  { group: 'Маникюр и педикюр', options: [
    { value: 'nails-correction', label: 'Коррекция ногтей' },
    { value: 'gel-polish', label: 'Покрытие гель-лаком' },
    { value: 'hardware-manicure', label: 'Аппаратный маникюр' },
    { value: 'classic-manicure', label: 'Классический маникюр' },
    { value: 'smart-pedicure', label: 'Smart педикюр' },
    { value: 'mens-pedicure', label: 'Мужской педикюр' },
  ]},
  { group: 'Причёски', options: [
    { value: 'hairstyle', label: 'Причёска' },
    { value: 'styling', label: 'Укладка волос' },
  ]},
  { group: 'Окрашивание', options: [
    { value: 'roots-coloring', label: 'Окрашивание корней' },
    { value: 'coloring', label: 'Колорирование / окрашивание' },
    { value: 'highlights', label: 'Мелирование' },
  ]},
  { group: 'Стрижки', options: [
    { value: 'womens-haircut', label: 'Женская стрижка' },
    { value: 'mens-haircut', label: 'Мужская стрижка' },
    { value: 'kids-haircut', label: 'Детская стрижка' },
    { value: 'consultation', label: 'Консультация' },
  ]},
]
