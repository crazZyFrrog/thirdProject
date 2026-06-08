import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { getVkMessagesUrl, trackVkClick } from '../config/contacts'

const VkIcon = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.525-2.049-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.271.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.49-.085.744-.576.744z"/>
  </svg>
)

const VkMessageButton = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)

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
              Есть вопросы? Напишите нам в ВКонтакте!
            </p>
          </div>
          <div className="w-4 h-4 bg-white transform rotate-45 absolute bottom-0 right-8 translate-y-2 shadow-lg"></div>
        </div>
      )}

      <a
        href={getVkMessagesUrl()}
        target="_blank"
        rel="noopener noreferrer"
        onClick={trackVkClick}
        className="group relative block"
        aria-label="Написать в ВКонтакте"
      >
        <div className="w-16 h-16 bg-[#0077FF] hover:bg-[#0066DD] rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-100">
          <VkIcon className="w-8 h-8 text-white" />
        </div>
        <div className="absolute inset-0 rounded-full bg-[#0077FF] animate-ping opacity-20"></div>
      </a>
    </div>
  )
}

export default VkMessageButton
