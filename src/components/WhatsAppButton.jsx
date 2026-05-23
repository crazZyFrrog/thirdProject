import React, { useState, useEffect } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { getWhatsAppUrl } from '../config/contacts'

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    
    // Show tooltip after 3 seconds
    const timer = setTimeout(() => {
      setShowTooltip(true)
      setTimeout(() => setShowTooltip(false), 5000)
    }, 3000)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
    }`}>
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-4 animate-slide-up">
          <div className="bg-white rounded-2xl shadow-2xl p-4 pr-12 max-w-xs relative">
            <button 
              onClick={() => setShowTooltip(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
            <p className="text-sm text-gray-700 font-medium">
              Есть вопросы? Напишите нам в WhatsApp!
            </p>
          </div>
          <div className="w-4 h-4 bg-white transform rotate-45 absolute bottom-0 right-8 translate-y-2 shadow-lg"></div>
        </div>
      )}

      {/* WhatsApp Button */}
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block"
      >
        <div className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-100">
          <MessageCircle size={32} className="text-white" />
        </div>
        
        {/* Pulse animation */}
        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></div>
      </a>
    </div>
  )
}

export default WhatsAppButton
