const phoneTel = (import.meta.env.VITE_PHONE || '+74842559572').replace(/\s/g, '')
const phoneDisplay = import.meta.env.VITE_PHONE_DISPLAY || '+7 (4842) 55-95-72'
const phoneMobileTel = (import.meta.env.VITE_PHONE_MOBILE || '+79029883535').replace(/\s/g, '')
const phoneMobileDisplay = import.meta.env.VITE_PHONE_MOBILE_DISPLAY || '+7 (902) 988-35-35'
const email = import.meta.env.VITE_EMAIL || ''
const whatsapp = (import.meta.env.VITE_WHATSAPP || '79029883535').replace(/\D/g, '')
const instagram = import.meta.env.VITE_INSTAGRAM || ''
const vk = import.meta.env.VITE_VK || 'https://vk.com/salon_lt'
const address = import.meta.env.VITE_ADDRESS || 'г. Калуга, ул. Глаголева, д. 9'
const yandexMapsUrl = import.meta.env.VITE_YANDEX_MAPS || 'https://yandex.ru/maps/org/masterskaya_krasoty_lt/1246399476/'

export const contacts = {
  phoneTel,
  phoneDisplay,
  phoneMobileTel,
  phoneMobileDisplay,
  email,
  whatsapp,
  instagram,
  vk,
  address,
  yandexMapsUrl,
}

export function getWhatsAppUrl(text = 'Здравствуйте! Хочу записаться на консультацию') {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`
}
