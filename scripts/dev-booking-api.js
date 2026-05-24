import fs from 'node:fs'
import path from 'node:path'
import {
  buildBookingNotification,
  createBookingRecord,
  getAvailableSlots,
  getBookingConfig,
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
  }
}

async function sendTelegram(config, text) {
  const token = config.telegram_bot_token
  const chatId = config.telegram_chat_id
  if (!token || !chatId || token.includes('YOUR_')) {
    return { ok: false, error: 'Укажите telegram_bot_token и telegram_chat_id в public/api/config.php' }
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  })

  const data = await response.json()
  if (data?.ok === true) return { ok: true }

  const description = data?.description || 'Неизвестная ошибка Telegram'
  if (description.includes('chat not found')) {
    return {
      ok: false,
      error: 'Telegram: чат не найден. Откройте @salon_lt_bot и нажмите /start.',
    }
  }

  return { ok: false, error: `Telegram: ${description}` }
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
