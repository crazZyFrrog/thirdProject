import React from 'react'
import { MessageCircle, Phone, Award, Heart, Sparkles } from 'lucide-react'

const FinalCTA = ({ onBookingClick }) => {
  return (
    <section className="section-padding bg-gradient-to-br from-accent-700 via-accent-600 to-accent-700 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block">
            <span className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles size={16} />
              <span>Запишитесь сегодня</span>
            </span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Пора найти мастера, к которому захочется возвращаться
          </h2>
          
          <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
            Запишитесь на консультацию и получите рекомендации именно для ваших волос.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button 
              onClick={onBookingClick}
              className="bg-white text-accent-700 hover:bg-gray-50 font-medium px-10 py-5 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-100 text-lg"
            >
              Записаться сейчас
            </button>
            <a 
              href="https://wa.me/79991234567" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-medium px-10 py-5 rounded-full border-2 border-white/30 transition-all duration-300 hover:scale-105 active:scale-100 inline-flex items-center justify-center space-x-3 text-lg"
            >
              <MessageCircle size={24} />
              <span>Написать в WhatsApp</span>
            </a>
          </div>

          <div className="pt-12 flex flex-wrap items-center justify-center gap-8 text-white/90">
            <div className="flex items-center space-x-2">
              <Award size={20} />
              <span className="font-medium">25+ лет опыта</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/30"></div>
            <div className="flex items-center space-x-2">
              <Heart size={20} />
              <span className="font-medium">Индивидуальный подход</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/30"></div>
            <div className="flex items-center space-x-2">
              <Sparkles size={20} />
              <span className="font-medium">Спокойная атмосфера</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FinalCTA
