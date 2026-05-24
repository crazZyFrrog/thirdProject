import React from 'react'
import { Phone } from 'lucide-react'
import { contacts } from '../config/contacts'

const Header = ({ show, onBookingClick }) => {
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        show 
          ? 'translate-y-0 bg-white/95 backdrop-blur-md shadow-lg' 
          : '-translate-y-full'
      }`}
    >
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <span className="font-display text-2xl font-bold text-accent-700">
              Мастерская красоты ЛТ
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-gray-700 hover:text-accent-600 transition-colors font-medium">
              Услуги
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-accent-600 transition-colors font-medium">
              Цены
            </a>
            <a href="#faq" className="text-gray-700 hover:text-accent-600 transition-colors font-medium">
              Вопросы
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <a 
              href={`tel:${contacts.phoneTel}`}
              className="hidden lg:flex items-center space-x-2 text-accent-700 hover:text-accent-800 transition-colors font-medium"
            >
              <Phone size={18} />
              <span>{contacts.phoneDisplay}</span>
            </a>
            <button onClick={onBookingClick} className="btn-primary py-3 px-6 text-sm">
              Записаться
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
