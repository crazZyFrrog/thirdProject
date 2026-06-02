import React from 'react'
import { Check } from 'lucide-react'
import { pricingCategories } from '../data/pricing'

const Pricing = ({ onBookingClick }) => {
  return (
    <section id="pricing" className="section-padding bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="heading-2 mb-6">
            Прайс-лист
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Стрижки, окрашивание, маникюр, педикюр, брови и ресницы — честные цены без скрытых доплат
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Цены ориентировочные, уточняются при записи. Возможна корректировка.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
          {pricingCategories.map((category) => (
            <div
              key={category.title}
              className="rounded-3xl p-8 bg-accent-600/25 backdrop-blur-sm border border-accent-500/30 shadow-md"
            >
              <h3 className="font-display text-xl sm:text-2xl font-semibold text-accent-900 mb-2">
                {category.title}
              </h3>
              {category.note && (
                <p className="text-xs text-gray-600 mb-4 pb-4 border-b border-accent-400/25">{category.note}</p>
              )}
              {!category.note && <div className="mb-6 pb-4 border-b border-accent-400/25" />}
              <ul className="space-y-3">
                {category.items.map((item) => (
                  <li key={item.name} className="flex items-start justify-between gap-4">
                    <span className="text-gray-800 text-sm leading-relaxed">
                      {item.name}
                      {item.note && (
                        <span className="block text-xs text-gray-500 mt-0.5">{item.note}</span>
                      )}
                    </span>
                    <span className="text-accent-800 font-bold whitespace-nowrap text-sm font-display">
                      {item.price}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-accent-50 to-primary-50 rounded-3xl p-8 text-center border border-accent-100">
            <p className="text-gray-800 leading-relaxed mb-6">
              <strong>Точная стоимость зависит от сложности и объёма работы.</strong>
              <br />
              Всё обсуждается заранее — без неожиданных доплат.
            </p>
            <button onClick={onBookingClick} className="btn-primary inline-flex items-center gap-2">
              <Check size={20} />
              Записаться
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pricing
