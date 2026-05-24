import React from 'react'
import { Phone, MapPin, Instagram, MessageCircle } from 'lucide-react'
import { contacts, getWhatsAppUrl } from '../config/contacts'

const VkIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.525-2.049-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.271.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.49-.085.744-.576.744z"/>
  </svg>
)

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
              Салон красоты в Калуге: стрижки, окрашивание, маникюр, педикюр, брови и ресницы. Опытные мастера и комфортная атмосфера.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-white text-lg">Контакты</h4>
            <div className="space-y-3">
              <a href={`tel:${contacts.phoneTel}`} className="flex items-center space-x-3 hover:text-accent-400 transition-colors">
                <Phone size={18} />
                <span>{contacts.phoneDisplay}</span>
              </a>
              <a href={`tel:${contacts.phoneMobileTel}`} className="flex items-center space-x-3 hover:text-accent-400 transition-colors">
                <Phone size={18} />
                <span>{contacts.phoneMobileDisplay}</span>
              </a>
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="flex-shrink-0 mt-1" />
                <a
                  href={contacts.yandexMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent-400 transition-colors"
                >
                  {contacts.address}
                </a>
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
              {contacts.instagram && (
                <a 
                  href={contacts.instagram}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-accent-600 transition-colors"
                >
                  <Instagram size={20} />
                </a>
              )}
              {contacts.vk && (
                <a 
                  href={contacts.vk}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-accent-600 transition-colors"
                >
                  <VkIcon />
                </a>
              )}
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
