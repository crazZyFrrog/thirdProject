import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { devBookingApiPlugin } from './scripts/dev-booking-api.js'
import { faqs } from './src/data/faq.js'
import { buildFaqSchema } from './src/data/seo.js'

function seoHtmlPlugin(env) {
  const metrikaId = env.VITE_YANDEX_METRIKA_ID
  const verification = env.VITE_YANDEX_VERIFICATION

  return {
    name: 'seo-html-inject',
    transformIndexHtml(html) {
      let result = html

      if (verification) {
        result = result.replace(
          '<!-- yandex-verification -->',
          `<meta name="yandex-verification" content="${verification}" />`
        )
      }

      const faqJson = JSON.stringify(buildFaqSchema(faqs)).replace(/</g, '\\u003c')
      result = result.replace('<!-- faq-schema -->', `<script type="application/ld+json">${faqJson}</script>`)

      if (metrikaId) {
        const noscript = `<noscript><div><img src="https://mc.yandex.ru/watch/${metrikaId}" style="position:absolute; left:-9999px;" alt="" /></div></noscript>`
        result = result.replace('<!-- yandex-metrika-noscript -->', noscript)
      }

      return result
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), devBookingApiPlugin(), seoHtmlPlugin(env)],
    server: {
      host: true,
      port: 5173,
      strictPort: false,
    },
  }
})
