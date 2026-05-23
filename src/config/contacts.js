const phoneTel = (import.meta.env.VITE_PHONE || '+74842559572').replace(/\s/g, '')
const phoneDisplay = import.meta.env.VITE_PHONE_DISPLAY || '+7 (4842) 55-95-72'
const email = import.meta.env.VITE_EMAIL || 'info@yourmaster.ru'
const whatsapp = (import.meta.env.VITE_WHATSAPP || '784842559572').replace(/\D/g, '')
const instagram = import.meta.env.VITE_INSTAGRAM || 'https://instagram.com'
const vk = import.meta.env.VITE_VK || ''
const address = import.meta.env.VITE_ADDRESS || 'г. Калуга, ул. Глаголева, д. 9'

export const contacts = {
  phoneTel,
  phoneDisplay,
  email,
  whatsapp,
  instagram,
  vk,
  address,
}

export function getWhatsAppUrl(text = 'Здравствуйте! Хочу записаться на консультацию') {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`
}
