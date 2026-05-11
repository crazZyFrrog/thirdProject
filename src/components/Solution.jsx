import React from 'react'
import { Award, Clock, Heart, Shield } from 'lucide-react'

const Solution = () => {
  const features = [
    {
      icon: Award,
      title: '25+ лет практики',
      description: 'Опыт работы с разными типами волос и задачами — от классических стрижек до сложного окрашивания.'
    },
    {
      icon: Clock,
      title: 'Без потока клиентов',
      description: 'Достаточно времени на каждого человека без спешки и суеты.'
    },
    {
      icon: Shield,
      title: 'Честные рекомендации',
      description: 'Если процедура не подойдёт вашим волосам — вы услышите об этом честно.'
    },
    {
      icon: Heart,
      title: 'Комфортная атмосфера',
      description: 'Тёплое пространство, где можно расслабиться и довериться мастеру.'
    }
  ]

  return (
    <section id="services" className="section-padding bg-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="heading-2 mb-6">
            Спокойный подход и опыт, проверенный годами
          </h2>
          <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
            <p>
              Каждая работа начинается с консультации. Мы обсуждаем:
            </p>
            <ul className="text-left max-w-xl mx-auto space-y-2">
              <li className="flex items-start">
                <span className="text-accent-600 mr-3">•</span>
                <span>что вам нравится</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent-600 mr-3">•</span>
                <span>как вы ухаживаете за волосами</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent-600 mr-3">•</span>
                <span>сколько времени готовы тратить на укладку</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent-600 mr-3">•</span>
                <span>какой результат хотите получить</span>
              </li>
            </ul>
            <p className="pt-4 font-medium text-gray-800">
              Главная задача — сделать не просто красивую стрижку или окрашивание, 
              а образ, который подойдёт именно вам.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="card-premium group hover:shadow-accent-100"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-100 to-primary-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <feature.icon size={32} className="text-accent-700" />
                </div>
                <h3 className="heading-3 text-xl">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Solution
