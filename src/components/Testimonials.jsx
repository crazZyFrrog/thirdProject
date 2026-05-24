import React from 'react'
import { Star, Quote, ExternalLink } from 'lucide-react'
import { testimonials, yandexRating } from '../data/testimonials'

const Testimonials = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h2 className="heading-2 mb-6">
            Отзывы клиентов
          </h2>
          <div className="inline-flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-full px-5 py-2">
            <div className="flex space-x-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={i < Math.floor(yandexRating.score) ? 'fill-amber-400 text-amber-400' : 'fill-amber-200 text-amber-200'}
                />
              ))}
            </div>
            <span className="font-semibold text-gray-900">{yandexRating.score}</span>
            <span className="text-gray-600 text-sm">· {yandexRating.count} оценок на Яндекс Картах</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="card-premium group relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-accent-600 to-accent-700 rounded-full flex items-center justify-center shadow-lg">
                <Quote size={24} className="text-white" />
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-gray-700 leading-relaxed italic">
                  «{testimonial.text}»
                </p>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-xs text-gray-500 mt-1">{testimonial.source}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-gradient-to-br from-accent-50 to-primary-50 rounded-3xl p-8 text-center border border-accent-100">
            <p className="text-lg text-gray-800 leading-relaxed font-medium">
              Большинство новых клиентов приходят по рекомендациям — 
              и это лучший показатель доверия.
            </p>
          </div>
          <div className="text-center">
            <a
              href={yandexRating.reviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent-700 hover:text-accent-800 font-medium transition-colors"
            >
              Все отзывы на Яндекс Картах
              <ExternalLink size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
