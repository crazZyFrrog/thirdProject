const counterId = import.meta.env.VITE_YANDEX_METRIKA_ID

let initialized = false

export function isMetrikaEnabled() {
  return Boolean(counterId)
}

export function initYandexMetrika() {
  if (!counterId || initialized || typeof window === 'undefined') return
  initialized = true

  window.ym =
    window.ym ||
    function (...args) {
      ;(window.ym.a = window.ym.a || []).push(args)
    }
  window.ym.l = Date.now()

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://mc.yandex.ru/metrika/tag.js'
  document.head.appendChild(script)

  window.ym(counterId, 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  })
}

export function reachMetrikaGoal(goal, params) {
  if (!counterId || typeof window === 'undefined' || typeof window.ym !== 'function') return
  window.ym(counterId, 'reachGoal', goal, params)
}
