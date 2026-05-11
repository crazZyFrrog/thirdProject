import React from 'react'
import { Scissors, Palette, Sparkles, Check, TrendingDown, Calendar, Award } from 'lucide-react'

const Pricing = ({ onBookingClick }) => {
  const pricingPlans = [
    {
      icon: Scissors,
      title: 'Женская стрижка',
      price: 'от 2500₽',
      priceBreakdown: '~833₽/месяц',
      comparisonText: 'В обычных салонах: от 3500₽',
      duration: 'Результат держится 2-3 месяца',
      description: 'Консультация, стрижка, рекомендации по укладке',
      features: [
        'Консультация перед процедурой',
        'Профессиональная стрижка',
        'Укладка',
        'Советы по домашнему уходу'
      ]
    },
    {
      icon: Palette,
      title: 'Окрашивание',
      price: 'от 5000₽',
      priceBreakdown: '~1250₽/месяц',
      comparisonText: 'В сетевых салонах: от 7000₽',
      duration: 'Результат держится 3-4 месяца',
      description: 'Подбор оттенка, окрашивание, рекомендации по уходу',
      features: [
        'Подбор индивидуального оттенка',
        'Профессиональное окрашивание',
        'Уход после процедуры',
        'Рекомендации по поддержанию цвета'
      ],
      featured: true,
      savings: 'Экономия до 2000₽'
    },
    {
      icon: Sparkles,
      title: 'Стрижка + окрашивание',
      price: 'от 7500₽',
      priceBreakdown: '~1875₽/месяц',
      comparisonText: 'Раздельно вышло бы: 8500₽',
      duration: 'Комплексное обновление образа',
      description: 'Комплексный подход для обновления образа',
      features: [
        'Полная консультация',
        'Окрашивание',
        'Стрижка',
        'Укладка и рекомендации'
      ],
      savings: 'Выгода 1000₽'
    }
  ]

  return (
    <section id="pricing" className="section-padding bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="heading-2 mb-6">
            Честные цены. Без скрытых доплат.
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            25 лет опыта, качественные материалы и индивидуальный подход — по справедливой цене
          </p>
        </div>

        {/* Value Proposition */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-accent-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                  <TrendingDown size={20} className="text-accent-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Честное сравнение</h3>
              </div>
              <p className="text-sm text-gray-600">Цены ниже, чем в сетевых салонах, при том же качестве</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-accent-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                  <Calendar size={20} className="text-accent-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Долгий результат</h3>
              </div>
              <p className="text-sm text-gray-600">Стрижки и окрашивание держатся 2-4 месяца</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-accent-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                  <Award size={20} className="text-accent-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Без навязывания</h3>
              </div>
              <p className="text-sm text-gray-600">Только то, что действительно нужно вашим волосам</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index}
              className={`relative ${
                plan.featured 
                  ? 'card-premium border-2 border-accent-300 shadow-2xl scale-105' 
                  : 'card-premium'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-accent-600 to-accent-700 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                    Популярное
                  </span>
                </div>
              )}

              <div className="text-center space-y-6">
                {/* Savings Badge */}
                {plan.savings && (
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium inline-block">
                    {plan.savings}
                  </div>
                )}

                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-accent-100 to-primary-100 rounded-2xl flex items-center justify-center mx-auto">
                  <plan.icon size={32} className="text-accent-700" />
                </div>

                {/* Title */}
                <div>
                  <h3 className="heading-3 text-2xl mb-2">
                    {plan.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="py-4">
                  <div className="text-4xl font-bold text-accent-700 font-display mb-2">
                    {plan.price}
                  </div>
                  <div className="text-sm text-gray-500">
                    {plan.priceBreakdown}
                  </div>
                </div>

                {/* Comparison & Duration */}
                <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-gray-600">
                    <TrendingDown size={16} className="text-accent-600" />
                    <span className="line-through text-gray-400">{plan.comparisonText.split(': ')[1]}</span>
                  </div>
                  <p className="text-xs text-gray-500">{plan.comparisonText.split(': ')[0]}</p>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-center space-x-2 text-accent-700">
                      <Calendar size={16} />
                      <span className="font-medium">{plan.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 text-left pt-4 border-t border-gray-100">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <Check size={20} className="text-accent-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <button 
                  onClick={onBookingClick}
                  className={
                    plan.featured 
                      ? 'btn-primary w-full' 
                      : 'btn-secondary w-full'
                  }
                >
                  Записаться
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Price Justification */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100">
            <h3 className="heading-3 text-center mb-8">За что вы платите?</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Award size={20} className="text-accent-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">25 лет опыта</h4>
                    <p className="text-sm text-gray-600">Знание сотен техник, понимание разных типов волос, умение предугадать результат</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles size={20} className="text-accent-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Профессиональные материалы</h4>
                    <p className="text-sm text-gray-600">Качественные краски и средства, которые бережно работают с волосами</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check size={20} className="text-accent-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Индивидуальный подход</h4>
                    <p className="text-sm text-gray-600">Достаточно времени на консультацию, работу и советы по уходу</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Calendar size={20} className="text-accent-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Долговременный результат</h4>
                    <p className="text-sm text-gray-600">Стрижка или окрашивание, которое выглядит хорошо все 2-4 месяца</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final Note */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-accent-50 to-primary-50 rounded-3xl p-8 text-center border border-accent-100">
            <p className="text-gray-800 leading-relaxed mb-6">
              <strong>Точная стоимость зависит от длины волос и сложности работы.</strong>
              <br />
              Всё обсуждается на консультации заранее — без неожиданных доплат.
            </p>
            <button onClick={onBookingClick} className="btn-secondary">
              Узнать точную стоимость
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pricing
