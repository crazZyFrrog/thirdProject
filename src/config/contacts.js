import { reachMetrikaGoal } from '../lib/yandexMetrika'

const phoneTel = (import.meta.env.VITE_PHONE || '+74842559572').replace(/\s/g, '')
const phoneDisplay = import.meta.env.VITE_PHONE_DISPLAY || '+7 (4842) 55-95-72'
const email = import.meta.env.VITE_EMAIL || ''
const instagram = import.meta.env.VITE_INSTAGRAM || ''
const vk = import.meta.env.VITE_VK || 'https://vk.com/salon_lt'
const vkMessages =
  import.meta.env.VITE_VK_MESSAGES || 'https://vk.com/im?sel=-126807901'
const address = import.meta.env.VITE_ADDRESS || 'г. Калуга, ул. Глаголева, д. 9'
const yandexMapsUrl = import.meta.env.VITE_YANDEX_MAPS || 'https://yandex.ru/maps/org/masterskaya_krasoty_lt/1246399476/'

export const contacts = {
  phoneTel,
  phoneDisplay,
  email,
  instagram,
  vk,
  vkMessages,
  address,
  yandexMapsUrl,
}

export function getVkMessagesUrl() {
  return vkMessages
}

export function trackVkClick() {
  reachMetrikaGoal('vk_click')
}
