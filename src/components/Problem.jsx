import React from 'react'
import { AlertCircle, Clock, Frown, MessageSquareX, TrendingDown } from 'lucide-react'

const Problem = () => {
  const problems = [
    {
      icon: MessageSquareX,
      title: 'Мастер не слышит пожелания',
      description: 'Вы объясняете, что хотите, но результат совсем другой'
    },
    {
      icon: Frown,
      title: 'Результат отличается от ожиданий',
      description: 'То, что получается, не совпадает с тем, что вы представляли'
    },
    {
      icon: Clock,
      title: 'Всё делается на потоке',
      description: 'Вас торопят, нет времени на консультацию и детали'
    },
    {
      icon: TrendingDown,
      title: 'Сложно укладывать самостоятельно',
      description: 'Стрижка выглядит хорошо в салоне, но дома всё иначе'
    },
    {
      icon: AlertCircle,
      title: 'Нет ощущения комфорта',
      description: 'В салоне некомфортно, нет доверия к мастеру'
    }
  ]

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="heading-2 mb-6">
            Найти «своего» мастера сегодня стало сложно
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Многие сталкиваются с тем, что:
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {problems.map((problem, index) => (
            <div 
              key={index}
              className="card-premium group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <problem.icon size={24} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {problem.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-accent-50 to-primary-50 rounded-3xl p-8 md:p-12 text-center border border-accent-100">
            <p className="text-xl text-gray-800 leading-relaxed font-medium">
              Хороший мастер — это не только техника. 
              <br className="hidden sm:block" />
              Это опыт, внимание и умение понять клиента.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Problem
