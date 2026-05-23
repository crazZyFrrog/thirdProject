import React from 'react'
import { Phone, Mail, MapPin, Instagram, MessageCircle } from 'lucide-react'
import { contacts, getWhatsAppUrl } from '../config/contacts'

const Footer = ({ onBookingClick }) => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom section-padding">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-bold text-white">
              Мастерская красоты ЛТ
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Парикмахерская с опытом работы мастеров более 25 лет. Индивидуальный подход и комфортная атмосфера.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-white text-lg">Контакты</h4>
            <div className="space-y-3">
              <a href={`tel:${contacts.phoneTel}`} className="flex items-center space-x-3 hover:text-accent-400 transition-colors">
                <Phone size={18} />
                <span>{contacts.phoneDisplay}</span>
              </a>
              <a href={`mailto:${contacts.email}`} className="flex items-center space-x-3 hover:text-accent-400 transition-colors">
                <Mail size={18} />
                <span>{contacts.email}</span>
              </a>
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="flex-shrink-0 mt-1" />
                <span>{contacts.address}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-white text-lg">Режим работы</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Пн-Пт:</span>
                <span className="text-white">10:00 - 20:00</span>
              </div>
              <div className="flex justify-between">
                <span>Суббота:</span>
                <span className="text-white">10:00 - 18:00</span>
              </div>
              <div className="flex justify-between">
                <span>Воскресенье:</span>
                <span className="text-white">Выходной</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-white text-lg">Мы в соцсетях</h4>
            <div className="flex space-x-4">
              <a 
                href={contacts.instagram}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-accent-600 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a 
                href={getWhatsAppUrl()}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-accent-600 transition-colors"
              >
                <MessageCircle size={20} />
              </a>
            </div>
            <button onClick={onBookingClick} className="btn-primary w-full mt-6">
              Записаться онлайн
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Мастерская красоты ЛТ. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
