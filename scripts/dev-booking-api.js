import fs from 'node:fs'
import path from 'node:path'
import {
  addBlockedPeriod,
  buildBookingNotification,
  createBlockedSlot,
  createBookingRecord,
  deleteBlockedPeriod,
  deleteBooking,
  getAvailableSlots,
  getBookingConfig,
  insertBookingRecord,
  listBlockedPeriods,
  listBookingsAdmin,
} from './booking-schedule.js'

function loadConfig() {
  const configPath = path.resolve('public/api/config.php')
  if (!fs.existsSync(configPath)) {
    return null
  }

  const content = fs.readFileSync(configPath, 'utf-8')
  const read = (key) => {
    const match = content.match(new RegExp(`'${key}'\\s*=>\\s*'([^']*)'`))
    return match?.[1]?.trim() ?? ''
  }

  return {
    telegram_bot_token: read('telegram_bot_token'),
    telegram_chat_id: read('telegram_chat_id'),
    admin_password: read('admin_password'),
  }
}

function verifyAdmin(req, config) {
  const expected = (config?.admin_password ?? '').trim()
  if (!expected || expected.includes('CHANGE_ME')) {
    return { ok: false, status: 500, error: 'Задайте admin_password в public/api/config.php' }
  }
  const provided = (req.headers['x-admin-password'] ?? '').trim()
  if (!provided || provided !== expected) {
    return { ok: false, status: 401, error: 'Неверный пароль админки.' }
  }
  return { ok: true }
}

function getTelegramChatIds(config) {
  const ids = []
  const primary = (config.telegram_chat_id ?? '').trim()
  if (primary) ids.push(primary)
  return [...new Set(ids)]
}

async function sendTelegram(config, text) {
  const token = config.telegram_bot_token
  const chatIds = getTelegramChatIds(config)
  if (!token || chatIds.length === 0 || token.includes('YOUR_')) {
    return { ok: false, error: 'Укажите telegram_bot_token и telegram_chat_id в public/api/config.php' }
  }

  let lastError = 'Неизвестная ошибка Telegram'
  for (const chatId of chatIds) {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    })

    const data = await response.json()
    if (data?.ok === true) return { ok: true }

    lastError = data?.description || lastError
    if (lastError.includes('chat not found')) {
      return {
        ok: false,
        error: 'Telegram: чат не найден. Добавьте бота в группу и нажмите /start в личке.',
      }
    }
  }

  return { ok: false, error: `Telegram: ${lastError}` }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
    req.on('error', reject)
  })
}

function sendJson(res, status, payload) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(payload))
}

function parseQuery(url) {
  const query = new URL(url, 'http://localhost')
  return Object.fromEntries(query.searchParams.entries())
}

export function devBookingApiPlugin() {
  return {
    name: 'dev-booking-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const [pathname] = (req.url || '').split('?')

        if (pathname === '/api/booking-config.php' && req.method === 'GET') {
          try {
            return sendJson(res, 200, getBookingConfig())
          } catch (error) {
            return sendJson(res, 500, { error: error.message || 'Не удалось загрузить настройки записи' })
          }
        }

        if (pathname === '/api/admin.php') {
          const config = loadConfig()
          if (!config) {
            return sendJson(res, 500, { error: 'Сервер не настроен. Создайте public/api/config.php' })
          }

          const query = parseQuery(req.url || '')
          const action = query.action || ''

          if (action === 'ping' && req.method === 'GET') {
            const auth = verifyAdmin(req, config)
            if (!auth.ok) return sendJson(res, auth.status, { error: auth.error })
            return sendJson(res, 200, { ok: true })
          }

          const auth = verifyAdmin(req, config)
          if (!auth.ok) return sendJson(res, auth.status, { error: auth.error })

          try {
            const rawBody = await readBody(req)
            const body = JSON.parse(rawBody || '{}')

            if (action === 'bookings' && req.method === 'GET') {
              return sendJson(res, 200, { bookings: listBookingsAdmin(80) })
            }
            if (action === 'blocked-periods' && req.method === 'GET') {
              return sendJson(res, 200, { periods: listBlockedPeriods() })
            }
            if (action === 'phone-booking' && req.method === 'POST') {
              const booking = insertBookingRecord(body, 'phone', true)
              const text = buildBookingNotification(booking)
              const telegramResult = await sendTelegram(config, text)
              return sendJson(res, 200, {
                success: true,
                booking: {
                  master: booking.master_name,
                  date: booking.start_at.toISOString().slice(0, 10),
                  time: booking.start_at.toTimeString().slice(0, 5),
                  endTime: booking.end_at.toTimeString().slice(0, 5),
                  service: booking.service_label,
                },
                notified: { telegram: telegramResult.ok, vk: false },
              })
            }
            if (action === 'block-slot' && req.method === 'POST') {
              const slot = createBlockedSlot(body)
              return sendJson(res, 200, {
                success: true,
                slot: {
                  id: slot.id,
                  master: slot.master_name,
                  date: slot.start_at.toISOString().slice(0, 10),
                  time: slot.start_at.toTimeString().slice(0, 5),
                  endTime: slot.end_at.toTimeString().slice(0, 5),
                  note: slot.note,
                },
              })
            }
            if (action === 'blocked-period' && req.method === 'POST') {
              const period = addBlockedPeriod(body)
              return sendJson(res, 200, { success: true, period })
            }
            if (action === 'delete-booking' && req.method === 'POST') {
              deleteBooking(Number(body.id))
              return sendJson(res, 200, { success: true })
            }
            if (action === 'delete-blocked-period' && req.method === 'POST') {
              deleteBlockedPeriod(Number(body.id))
              return sendJson(res, 200, { success: true })
            }

            return sendJson(res, 400, { error: 'Неизвестное действие.' })
          } catch (error) {
            const status = /выберите|введите|нельзя|занято|некоррект|работает|укажите|найден/i.test(
              error.message
            )
              ? 400
              : 500
            return sendJson(res, status, { error: error.message || 'Ошибка сервера' })
          }
        }

        if (pathname === '/api/availability.php' && req.method === 'GET') {
          try {
            const { date = '', service = '', master = '' } = parseQuery(req.url || '')
            const result = getAvailableSlots(date, service, master)
            return sendJson(res, 200, result)
          } catch (error) {
            return sendJson(res, 400, { error: error.message || 'Не удалось получить слоты' })
          }
        }

        if (pathname !== '/api/booking.php') {
          return next()
        }

        if (req.method !== 'POST') {
          return sendJson(res, 405, { error: 'Метод не поддерживается' })
        }

        try {
          const config = loadConfig()
          if (!config) {
            return sendJson(res, 500, { error: 'Сервер не настроен. Создайте public/api/config.php' })
          }

          const rawBody = await readBody(req)
          const data = JSON.parse(rawBody || '{}')

          if (data.website) {
            return sendJson(res, 200, { success: true })
          }

          const booking = createBookingRecord(data)
          const text = buildBookingNotification(booking)
          const telegramResult = await sendTelegram(config, text)

          if (!telegramResult.ok) {
            return sendJson(res, 502, { error: telegramResult.error || 'Не удалось отправить заявку в Telegram' })
          }

          return sendJson(res, 200, {
            success: true,
            booking: {
              master: booking.master_name,
              date: booking.start_at.toISOString().slice(0, 10),
              time: booking.start_at.toTimeString().slice(0, 5),
              endTime: booking.end_at.toTimeString().slice(0, 5),
              service: booking.service_label,
            },
          })
        } catch (error) {
          const status = /выберите|введите|нельзя|занято|некоррект|работает/i.test(error.message) ? 400 : 500
          console.error('[dev-booking-api]', error)
          return sendJson(res, status, { error: error.message || 'Ошибка сервера при отправке заявки' })
        }
      })
    },
  }
}
