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
            <div key={category.title} className="card-premium">
              <h3 className="heading-3 text-xl mb-6 pb-4 border-b border-gray-100">
                {category.title}
              </h3>
              <ul className="space-y-3">
                {category.items.map((item) => (
                  <li key={item.name} className="flex items-start justify-between gap-4">
                    <span className="text-gray-700 text-sm leading-relaxed">{item.name}</span>
                    <span className="text-accent-700 font-semibold whitespace-nowrap text-sm">
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
