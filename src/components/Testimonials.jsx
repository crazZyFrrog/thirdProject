import React from 'react'
import { Star, Quote } from 'lucide-react'

const Testimonials = () => {
  const testimonials = [
    {
      text: 'Очень долго искала мастера, который действительно слышит клиента. После первой стрижки поняла — наконец нашла своего человека.',
      author: 'Елена',
      rating: 5
    },
    {
      text: 'Спокойная атмосфера и очень аккуратная работа. Видно огромный опыт и любовь к своему делу.',
      author: 'Ольга',
      rating: 5
    },
    {
      text: 'Уже несколько лет доверяю только ей. Всегда честно подскажет, что подойдёт, а что нет.',
      author: 'Мария',
      rating: 5
    }
  ]

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="heading-2 mb-6">
            Клиенты возвращаются снова и рекомендуют близким
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="card-premium group relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote icon */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-accent-600 to-accent-700 rounded-full flex items-center justify-center shadow-lg">
                <Quote size={24} className="text-white" />
              </div>

              <div className="space-y-4 pt-4">
                {/* Stars */}
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-gray-700 leading-relaxed italic">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-accent-50 to-primary-50 rounded-3xl p-8 text-center border border-accent-100">
            <p className="text-lg text-gray-800 leading-relaxed font-medium">
              Большинство новых клиентов приходят по рекомендациям — 
              и это лучший показатель доверия.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
