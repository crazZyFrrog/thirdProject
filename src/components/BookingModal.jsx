import React, { useState } from 'react'
import { X, User, Mail, Phone, Calendar, MessageSquare, Check } from 'lucide-react'

const BookingModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Введите ваше имя'
    }
    
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email'
    }
    
    if (!formData.phone.trim() || !/^[\d\s\+\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Введите корректный телефон'
    }
    
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // Здесь можно добавить отправку на сервер
    console.log('Form submitted:', formData)
    
    // Показываем успешное сообщение
    setIsSubmitted(true)
    
    // Через 3 секунды закрываем модалку и сбрасываем форму
    setTimeout(() => {
      onClose()
      setFormData({ name: '', email: '', phone: '', service: '', message: '' })
      setIsSubmitted(false)
      setErrors({})
    }, 3000)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Убираем ошибку при вводе
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors z-10"
        >
          <X size={20} />
        </button>
        
        <div className="p-8 sm:p-12">
          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="heading-2 mb-4">Записаться на приём</h2>
                <p className="text-gray-600 leading-relaxed">
                  Заполните форму, и мы свяжемся с вами в ближайшее время для подтверждения записи
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Ваше имя *
                  </label>
                  <div className="relative">
                    <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                        errors.name 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-accent-500'
                      } focus:ring-2 focus:border-transparent transition-colors`}
                      placeholder="Например, Мария"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                        errors.email 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-accent-500'
                      } focus:ring-2 focus:border-transparent transition-colors`}
                      placeholder="your@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Телефон *
                  </label>
                  <div className="relative">
                    <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                        errors.phone 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-accent-500'
                      } focus:ring-2 focus:border-transparent transition-colors`}
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {/* Service */}
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                    Желаемая услуга (необязательно)
                  </label>
                  <div className="relative">
                    <Calendar size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors appearance-none bg-white"
                    >
                      <option value="">Выберите услугу</option>
                      <option value="haircut">Женская стрижка</option>
                      <option value="coloring">Окрашивание</option>
                      <option value="complex">Стрижка + окрашивание</option>
                      <option value="consultation">Консультация</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Комментарий (необязательно)
                  </label>
                  <div className="relative">
                    <MessageSquare size={20} className="absolute left-4 top-4 text-gray-400" />
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors resize-none"
                      placeholder="Напишите ваши пожелания или вопросы..."
                    ></textarea>
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  className="btn-primary w-full text-lg"
                >
                  Отправить заявку
                </button>

                <p className="text-center text-sm text-gray-500">
                  Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                </p>
              </form>
            </>
          ) : (
            // Success Message
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} className="text-green-600" />
              </div>
              <h3 className="heading-3 mb-4">Заявка отправлена!</h3>
              <p className="text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
                Спасибо! Мы получили вашу заявку и свяжемся с вами в ближайшее время.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingModal
