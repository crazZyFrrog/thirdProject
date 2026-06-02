import React from 'react'
import { Check, Heart, Award, Users } from 'lucide-react'
import { getVkMessagesUrl } from '../config/contacts'

const Hero = ({ onBookingClick }) => {
  const benefits = [
    { icon: Award, text: 'Мастера с опытом 15+ лет' },
    { icon: Users, text: 'Стрижки, ногти, брови' },
    { icon: Heart, text: 'Индивидуальный подход' },
    { icon: Check, text: 'Запись онлайн и в ВКонтакте' }
  ]

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="absolute top-20 right-10 w-72 h-72 bg-accent-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl"></div>
      
      <div className="container-custom section-padding relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8 animate-fade-in">
            <h1 className="heading-1 animate-slide-up">
              Мастерская красоты ЛТ — ваши мастера, которым доверяют годами
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Семейный салон на ул. Глаголева: стрижки и окрашивание, маникюр и педикюр, брови и ресницы. 
              В команде — опытные мастера с многолетним стажем. Спокойная атмосфера, внимание к деталям и результат, с которым вам комфортно каждый день.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <button onClick={onBookingClick} className="btn-primary text-lg">
                Записаться
              </button>
              <a
                href={getVkMessagesUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-lg text-center"
              >
                Написать в ВКонтакте
              </a>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4 pt-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3 text-gray-700">
                  <div className="flex-shrink-0 w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                    <benefit.icon size={20} className="text-accent-600" />
                  </div>
                  <span className="font-medium">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5]">
              <img 
                src="/images/salon_lt.jpg" 
                alt="Мастерская красоты ЛТ — салон красоты в Калуге"
                className="absolute inset-0 w-full h-full object-cover object-center"
                loading="eager"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl">
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <h3 className="font-display text-2xl font-semibold text-gray-900">Мастерская красоты ЛТ</h3>
                    <p className="text-sm text-gray-600 mt-1">Стрижки · Маникюр · Брови</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-3xl font-bold text-accent-700 font-display">15+</div>
                      <div className="text-sm text-gray-600 mt-1">Лет опыта мастеров</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-accent-700 font-display">4.5</div>
                      <div className="text-sm text-gray-600 mt-1">Рейтинг на Яндекс Картах</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent-300/50 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary-300/50 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
