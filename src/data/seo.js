export const siteUrl = 'https://salonlt.ru'

export const ogImage = `${siteUrl}/images/og.jpg`

/** Координаты ул. Глаголева, 9, Калуга (Яндекс Карты) */
export const geoCoordinates = {
  latitude: 54.513518,
  longitude: 36.261425,
}

export function buildFaqSchema(faqItems) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
