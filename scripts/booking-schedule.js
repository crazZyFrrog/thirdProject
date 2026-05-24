import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const CONFIG_PATH = path.resolve(ROOT, 'public/api/service-config.json')
const BOOKINGS_PATH = path.resolve(ROOT, 'public/api/data/bookings.json')

let serviceConfig = null

function loadServiceConfig() {
  if (serviceConfig) return serviceConfig
  serviceConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'))
  return serviceConfig
}

function ensureBookingsFile() {
  const dir = path.dirname(BOOKINGS_PATH)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(BOOKINGS_PATH)) {
    fs.writeFileSync(BOOKINGS_PATH, '[]', 'utf-8')
  }
}

function readBookings() {
  ensureBookingsFile()
  try {
    const raw = fs.readFileSync(BOOKINGS_PATH, 'utf-8')
    const data = JSON.parse(raw || '[]')
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

function writeBookings(bookings) {
  ensureBookingsFile()
  fs.writeFileSync(BOOKINGS_PATH, JSON.stringify(bookings, null, 2), 'utf-8')
}

function dayKeyFromDate(date) {
  const map = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return map[date.getDay()]
}

function parseDateOnly(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new Error('Некорректная дата.')
  }
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    throw new Error('Некорректная дата.')
  }
  return date
}

function parseTimeOnly(timeStr) {
  const match = /^(\d{2}):(\d{2})$/.exec(timeStr)
  if (!match) throw new Error('Некорректное время.')
  return [Number(match[1]), Number(match[2])]
}

function setTime(date, hours, minutes) {
  const next = new Date(date)
  next.setHours(hours, minutes, 0, 0)
  return next
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000)
}

function getMasterMeta(masterId) {
  const config = loadServiceConfig()
  return config.masters?.[masterId] ?? null
}

function getMasterServiceIds(masterId) {
  const master = getMasterMeta(masterId)
  if (!master) return []

  const ids = []
  for (const group of master.serviceGroups ?? []) {
    for (const serviceId of group.services ?? []) {
      ids.push(String(serviceId))
    }
  }
  return [...new Set(ids)]
}

function masterOffersService(masterId, serviceId) {
  return getMasterServiceIds(masterId).includes(serviceId)
}

function getServiceMeta(service) {
  const config = loadServiceConfig()
  return config.services?.[service] ?? null
}

export function getBookingConfig() {
  const config = loadServiceConfig()
  const masters = []

  for (const [masterId, master] of Object.entries(config.masters ?? {})) {
    const groups = []
    for (const group of master.serviceGroups ?? []) {
      const options = []
      for (const serviceId of group.services ?? []) {
        const serviceMeta = getServiceMeta(String(serviceId))
        if (!serviceMeta) continue
        options.push({
          value: String(serviceId),
          label: serviceMeta.label,
          durationMinutes: serviceMeta.durationMinutes,
        })
      }
      if (options.length > 0) {
        groups.push({
          title: group.title ?? 'Услуги',
          options,
        })
      }
    }

    masters.push({
      id: masterId,
      name: master.name ?? masterId,
      role: master.role ?? '',
      serviceGroups: groups,
    })
  }

  return { masters }
}

function getBusinessWindow(date, masterId) {
  const config = loadServiceConfig()
  const dayKey = dayKeyFromDate(date)
  const master = getMasterMeta(masterId)
  const hours = master?.schedule?.[dayKey] ?? config.businessHours?.[dayKey]
  if (!hours?.open || !hours?.close) return null

  const [openH, openM] = parseTimeOnly(hours.open)
  const [closeH, closeM] = parseTimeOnly(hours.close)
  const open = setTime(date, openH, openM)
  const close = setTime(date, closeH, closeM)
  if (close <= open) return null
  return { open, close }
}

function intervalsOverlap(startA, endA, startB, endB) {
  return startA < endB && endA > startB
}

function getBookingsForDate(date, masterId) {
  const dayStart = setTime(date, 0, 0)
  const dayEnd = setTime(date, 23, 59, 59)

  return readBookings()
    .filter((row) => row.master_id === masterId)
    .map((row) => ({
      start: new Date(row.start_at),
      end: new Date(row.end_at),
    }))
    .filter((booking) => booking.start < dayEnd && booking.end > dayStart)
    .sort((a, b) => a.start - b.start)
}

function hasOverlap(start, end, existing) {
  return existing.some((booking) => intervalsOverlap(start, end, booking.start, booking.end))
}

export function formatDurationLabel(minutes) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0 && mins > 0) return `${hours} ч ${mins} мин`
  if (hours > 0) return `${hours} ч`
  return `${mins} мин`
}

export function getAvailableSlots(date, service, masterId) {
  const master = getMasterMeta(masterId)
  if (!master) throw new Error('Выберите мастера.')

  const serviceMeta = getServiceMeta(service)
  if (!serviceMeta || !masterOffersService(masterId, service)) {
    throw new Error('Эта услуга недоступна у выбранного мастера.')
  }

  const dateObj = parseDateOnly(date)
  const window = getBusinessWindow(dateObj, masterId)
  const duration = serviceMeta.durationMinutes

  if (!window) {
    return {
      date,
      service,
      master: masterId,
      masterName: master.name ?? masterId,
      durationMinutes: duration,
      durationLabel: formatDurationLabel(duration),
      slots: [],
      closed: true,
    }
  }

  const config = loadServiceConfig()
  const step = config.slotStepMinutes ?? 30
  const now = new Date()
  const existing = getBookingsForDate(dateObj, masterId)
  const slots = []

  for (let cursor = new Date(window.open); cursor < window.close; cursor = addMinutes(cursor, step)) {
    const end = addMinutes(cursor, duration)
    if (end > window.close) break
    if (cursor <= now) continue
    if (!hasOverlap(cursor, end, existing)) {
      const time = cursor.toTimeString().slice(0, 5)
      const endTime = end.toTimeString().slice(0, 5)
      slots.push({ time, endTime, label: `${time} – ${endTime}` })
    }
  }

  return {
    date,
    service,
    master: masterId,
    masterName: master.name ?? masterId,
    durationMinutes: duration,
    durationLabel: formatDurationLabel(duration),
    slots,
    closed: false,
  }
}

export function createBookingRecord(data) {
  const name = String(data.name ?? '').trim()
  const email = String(data.email ?? '').trim()
  const phone = String(data.phone ?? '').trim()
  const masterId = String(data.master ?? '').trim()
  const service = String(data.service ?? '').trim()
  const date = String(data.date ?? '').trim()
  const time = String(data.time ?? '').trim()
  const message = String(data.message ?? '').trim()

  if (!name) throw new Error('Введите ваше имя.')
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Введите корректный email.')
  if (!phone || !/^[\d\s+\-()]+$/.test(phone)) throw new Error('Введите корректный телефон.')
  if (!masterId) throw new Error('Выберите мастера.')
  if (!service) throw new Error('Выберите услугу.')
  if (!date || !time) throw new Error('Выберите дату и время.')

  const master = getMasterMeta(masterId)
  if (!master) throw new Error('Выберите мастера из списка.')

  const serviceMeta = getServiceMeta(service)
  if (!serviceMeta || !masterOffersService(masterId, service)) {
    throw new Error('Эта услуга недоступна у выбранного мастера.')
  }

  const dateObj = parseDateOnly(date)
  const [hour, minute] = parseTimeOnly(time)
  const start = setTime(dateObj, hour, minute)
  const duration = serviceMeta.durationMinutes
  const end = addMinutes(start, duration)
  const window = getBusinessWindow(dateObj, masterId)

  if (!window) throw new Error('В выбранный день мастер не работает.')
  if (start < window.open || end > window.close) throw new Error('Выбранное время вне рабочих часов мастера.')

  const now = new Date()
  if (start <= now) throw new Error('Нельзя записаться на прошедшее время.')

  const existing = getBookingsForDate(dateObj, masterId)
  if (hasOverlap(start, end, existing)) {
    throw new Error('Это время уже занято. Выберите другой слот.')
  }

  const bookings = readBookings()
  bookings.push({
    id: bookings.length > 0 ? Math.max(...bookings.map((b) => b.id ?? 0)) + 1 : 1,
    name,
    email,
    phone,
    master_id: masterId,
    master_name: master.name ?? masterId,
    service,
    service_label: serviceMeta.label,
    duration_minutes: duration,
    start_at: start.toISOString(),
    end_at: end.toISOString(),
    message,
    created_at: now.toISOString(),
  })
  writeBookings(bookings)

  return {
    name,
    email,
    phone,
    master_id: masterId,
    master_name: master.name ?? masterId,
    service,
    service_label: serviceMeta.label,
    duration_minutes: duration,
    start_at: start,
    end_at: end,
    message,
  }
}

export function buildBookingNotification(booking) {
  const startDate = booking.start_at.toLocaleDateString('ru-RU')
  const startTime = booking.start_at.toTimeString().slice(0, 5)
  const endTime = booking.end_at.toTimeString().slice(0, 5)
  const duration = formatDurationLabel(booking.duration_minutes)

  const lines = [
    '🆕 Новая запись с сайта!',
    '',
    `👤 Имя: ${booking.name}`,
  ]
  if (booking.email) lines.push(`📧 Email: ${booking.email}`)
  lines.push(
    `📱 Телефон: ${booking.phone}`,
    `👩‍🎨 Мастер: ${booking.master_name}`,
    `💇 Услуга: ${booking.service_label}`,
    `🕐 Время: ${startDate} ${startTime} – ${endTime} (${duration})`
  )
  if (booking.message) lines.push(`💬 Комментарий: ${booking.message}`)
  return lines.join('\n')
}
