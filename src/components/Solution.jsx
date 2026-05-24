import React from 'react'
import { Award, Clock, Heart, Shield, Scissors, Sparkles, Eye } from 'lucide-react'

const Solution = () => {
  const services = [
    {
      icon: Scissors,
      title: 'Парикмахерские услуги',
      description: 'Стрижки, окрашивание, укладки и причёски. Опытные мастера с многолетним стажем.'
    },
    {
      icon: Sparkles,
      title: 'Маникюр и педикюр',
      description: 'Классический и аппаратный маникюр, smart-педикюр, покрытие гель-лаком.'
    },
    {
      icon: Eye,
      title: 'Брови и ресницы',
      description: 'Коррекция и окрашивание бровей, окрашивание ресниц — аккуратно и с вниманием к деталям.'
    },
    {
      icon: Heart,
      title: 'Комфортная атмосфера',
      description: 'Тёплое пространство без спешки: чай, кофе и время на каждого клиента.'
    }
  ]

  const features = [
    {
      icon: Award,
      title: '20+ лет практики',
      description: 'Опытная команда: мастера-парикмахеры и мастер по ногтям и бровям.'
    },
    {
      icon: Clock,
      title: 'Без потока клиентов',
      description: 'Достаточно времени на каждого человека без спешки и суеты.'
    },
    {
      icon: Shield,
      title: 'Честные рекомендации',
      description: 'Подскажем, что подойдёт именно вам — без навязывания лишнего.'
    }
  ]

  return (
    <section id="services" className="section-padding bg-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="heading-2 mb-6">
            Всё для вашей красоты в одном месте
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Мастерская красоты ЛТ — это не только парикмахерская. Здесь вы найдёте полный спектр услуг 
            для волос, ногтей и бровей от профессионалов, которым доверяют уже много лет.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => (
            <div 
              key={index}
              className="card-premium group text-center"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-accent-100 to-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <service.icon size={32} className="text-accent-700" />
              </div>
              <h3 className="heading-3 text-lg mb-3">{service.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="card-premium group hover:shadow-accent-100 text-center"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-accent-100 to-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <feature.icon size={32} className="text-accent-700" />
              </div>
              <h3 className="heading-3 text-xl mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Solution
