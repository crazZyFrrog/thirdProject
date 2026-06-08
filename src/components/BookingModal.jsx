import React, { useEffect, useMemo, useState } from 'react'
import { X, User, Mail, Phone, Calendar, MessageSquare, Check, Loader2, Clock, Scissors } from 'lucide-react'
import { reachMetrikaGoal } from '../lib/yandexMetrika'

const PHONE_PREFIX = '+7 '

const getMinDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const normalizePhone = (value) => {
  const digits = value.replace(/\D/g, '')
  let national = digits

  if (national.startsWith('7')) {
    national = national.slice(1)
  } else if (national.startsWith('8')) {
    national = national.slice(1)
  }

  national = national.slice(0, 10)
  return PHONE_PREFIX + national
}

const BookingModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    master: '',
    name: '',
    email: '',
    phone: PHONE_PREFIX,
    service: '',
    date: '',
    time: '',
    message: '',
    website: '',
  })
  const [bookingConfig, setBookingConfig] = useState(null)
  const [isConfigLoading, setIsConfigLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [errors, setErrors] = useState({})
  const [slotInfo, setSlotInfo] = useState(null)
  const [confirmedBooking, setConfirmedBooking] = useState(null)

  const minDate = useMemo(() => getMinDate(), [])

  const selectedMaster = useMemo(
    () => bookingConfig?.masters?.find((master) => master.id === formData.master) ?? null,
    [bookingConfig, formData.master]
  )

  useEffect(() => {
    if (!isOpen) return

    setFormData((prev) => ({
      ...prev,
      phone: prev.phone.startsWith('+7') ? prev.phone : PHONE_PREFIX,
    }))

    const controller = new AbortController()
    setIsConfigLoading(true)
    setSubmitError('')

    fetch('/api/booking-config.php', { signal: controller.signal })
      .then(async (response) => {
        const rawText = await response.text()
        const data = rawText ? JSON.parse(rawText) : {}
        if (!response.ok) {
          throw new Error(data.error || 'Не удалось загрузить список мастеров')
        }
        setBookingConfig(data)
      })
      .catch((error) => {
        if (error.name === 'AbortError') return
        setBookingConfig(null)
        setSubmitError(error.message || 'Не удалось загрузить список мастеров')
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsConfigLoading(false)
        }
      })

    return () => controller.abort()
  }, [isOpen])

  useEffect(() => {
    if (!formData.master || !formData.service || !formData.date) {
      setSlotInfo(null)
      return
    }

    const controller = new AbortController()
    setIsLoadingSlots(true)
    setSubmitError('')

    const params = new URLSearchParams({
      date: formData.date,
      service: formData.service,
      master: formData.master,
    })

    fetch(`/api/availability.php?${params.toString()}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const rawText = await response.text()
        const data = rawText ? JSON.parse(rawText) : {}
        if (!response.ok) {
          throw new Error(data.error || 'Не удалось загрузить свободное время')
        }
        setSlotInfo(data)
        setFormData((prev) => {
          if (prev.time && !data.slots?.some((slot) => slot.time === prev.time)) {
            return { ...prev, time: '' }
          }
          return prev
        })
      })
      .catch((error) => {
        if (error.name === 'AbortError') return
        setSlotInfo(null)
        setSubmitError(error.message || 'Не удалось загрузить свободное время')
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoadingSlots(false)
        }
      })

    return () => controller.abort()
  }, [formData.master, formData.service, formData.date])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.master) {
      newErrors.master = 'Выберите мастера'
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Введите ваше имя'
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email'
    }

    const phoneDigits = formData.phone.replace(/\D/g, '')
    if (phoneDigits.length < 11 || !phoneDigits.startsWith('7')) {
      newErrors.phone = 'Введите номер полностью: +7 и 10 цифр'
    }

    if (!formData.service) {
      newErrors.service = 'Выберите услугу'
    }

    if (!formData.date) {
      newErrors.date = 'Выберите дату'
    }

    if (!formData.time) {
      newErrors.time = 'Выберите время'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/booking.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const rawText = await response.text()
      let result = {}

      if (rawText) {
        try {
          result = JSON.parse(rawText)
        } catch {
          throw new Error('Сервер вернул некорректный ответ. Перезапустите npm run dev.')
        }
      } else {
        throw new Error('API недоступен. Перезапустите npm run dev.')
      }

      if (!response.ok) {
        throw new Error(result.error || 'Не удалось отправить заявку')
      }

      setConfirmedBooking(result.booking ?? null)
      setIsSubmitted(true)
      reachMetrikaGoal('booking_success')

      setTimeout(() => {
        onClose()
        setFormData({
          master: '',
          name: '',
          email: '',
          phone: PHONE_PREFIX,
          service: '',
          date: '',
          time: '',
          message: '',
          website: '',
        })
        setIsSubmitted(false)
        setConfirmedBooking(null)
        setSlotInfo(null)
        setErrors({})
        setSubmitError('')
      }, 4000)
    } catch (error) {
      setSubmitError(error.message || 'Произошла ошибка. Попробуйте позже или позвоните нам.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhoneChange = (e) => {
    const value = normalizePhone(e.target.value)
    setFormData((prev) => ({ ...prev, phone: value }))
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: '' }))
    }
    if (submitError) {
      setSubmitError('')
    }
  }

  const handlePhoneFocus = () => {
    setFormData((prev) => {
      if (prev.phone.startsWith('+7')) return prev
      return { ...prev, phone: PHONE_PREFIX }
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const next = { ...prev, [name]: value }
      if (name === 'master') {
        next.service = ''
        next.date = ''
        next.time = ''
      }
      if (name === 'service' || name === 'date') {
        next.time = ''
      }
      return next
    })
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    if (submitError) {
      setSubmitError('')
    }
  }

  const handleSlotSelect = (time) => {
    setFormData((prev) => ({ ...prev, time }))
    if (errors.time) {
      setErrors((prev) => ({ ...prev, time: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8 sm:p-12">
          {!isSubmitted ? (
            <>
              <div className="text-center mb-8">
                <h2 className="heading-2 mb-4">Записаться на приём</h2>
                <p className="text-gray-600 leading-relaxed">
                  Выберите мастера, услугу и удобное время — у каждого специалиста свой график и список услуг
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute opacity-0 pointer-events-none h-0 w-0"
                />

                <div>
                  <label htmlFor="master" className="block text-sm font-medium text-gray-700 mb-2">
                    Мастер *
                  </label>
                  {isConfigLoading ? (
                    <div className="flex items-center gap-2 text-gray-500 py-3">
                      <Loader2 size={18} className="animate-spin" />
                      Загружаем список мастеров...
                    </div>
                  ) : (
                    <div className="relative">
                      <Scissors size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        id="master"
                        name="master"
                        value={formData.master}
                        onChange={handleChange}
                        disabled={isLoading || !bookingConfig?.masters?.length}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                          errors.master ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors appearance-none bg-white disabled:opacity-60`}
                      >
                        <option value="">Выберите мастера</option>
                        {bookingConfig?.masters?.map((master) => (
                          <option key={master.id} value={master.id}>
                            {master.name} — {master.role}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {errors.master && <p className="mt-2 text-sm text-red-600">{errors.master}</p>}
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                    Услуга *
                  </label>
                  <div className="relative">
                    <Calendar size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      disabled={isLoading || !formData.master}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                        errors.service ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors appearance-none bg-white disabled:opacity-60`}
                    >
                      <option value="">
                        {formData.master ? 'Выберите услугу' : 'Сначала выберите мастера'}
                      </option>
                      {selectedMaster?.serviceGroups?.map((group) => (
                        <optgroup key={group.title} label={group.title}>
                          {group.options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  {errors.service && <p className="mt-2 text-sm text-red-600">{errors.service}</p>}
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    Дата *
                  </label>
                  <div className="relative">
                    <Calendar size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      id="date"
                      name="date"
                      min={minDate}
                      value={formData.date}
                      onChange={handleChange}
                      disabled={isLoading || !formData.service}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                        errors.date ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors disabled:opacity-60`}
                    />
                  </div>
                  {errors.date && <p className="mt-2 text-sm text-red-600">{errors.date}</p>}
                </div>

                {formData.master && formData.service && formData.date && (
                  <div>
                    <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
                      <label className="block text-sm font-medium text-gray-700">
                        Свободное время *
                      </label>
                      <div className="flex items-center gap-2 flex-wrap">
                        {slotInfo?.masterName && (
                          <span className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                            {slotInfo.masterName}
                          </span>
                        )}
                        {slotInfo?.durationLabel && (
                          <span className="text-xs text-accent-700 bg-accent-50 px-3 py-1 rounded-full">
                            Длительность: {slotInfo.durationLabel}
                          </span>
                        )}
                      </div>
                    </div>

                    {isLoadingSlots ? (
                      <div className="flex items-center gap-2 text-gray-500 py-4">
                        <Loader2 size={18} className="animate-spin" />
                        Загружаем свободные слоты...
                      </div>
                    ) : slotInfo?.closed ? (
                      <p className="text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3">
                        В этот день мастер не работает. Выберите другую дату.
                      </p>
                    ) : slotInfo?.slots?.length ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {slotInfo.slots.map((slot) => (
                          <button
                            key={slot.time}
                            type="button"
                            onClick={() => handleSlotSelect(slot.time)}
                            disabled={isLoading}
                            className={`px-3 py-3 rounded-xl border text-sm font-medium transition-colors ${
                              formData.time === slot.time
                                ? 'border-accent-600 bg-accent-600 text-white'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-accent-300 hover:bg-accent-50'
                            }`}
                          >
                            <span className="flex items-center justify-center gap-1">
                              <Clock size={14} />
                              {slot.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3">
                        На эту дату нет свободных окон для выбранной услуги. Попробуйте другую дату.
                      </p>
                    )}
                    {errors.time && <p className="mt-2 text-sm text-red-600">{errors.time}</p>}
                  </div>
                )}

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
                      disabled={isLoading}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors disabled:opacity-60`}
                      placeholder="Например, Мария"
                    />
                  </div>
                  {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                </div>

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
                      onChange={handlePhoneChange}
                      onFocus={handlePhoneFocus}
                      disabled={isLoading}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors disabled:opacity-60`}
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>
                  {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email (необязательно)
                  </label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors disabled:opacity-60`}
                      placeholder="Email, если хотите получить ответ письмом"
                    />
                  </div>
                  {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                </div>

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
                      disabled={isLoading}
                      rows={4}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors resize-none disabled:opacity-60"
                      placeholder="Напишите ваши пожелания или вопросы..."
                    ></textarea>
                  </div>
                </div>

                {submitError && (
                  <p className="text-sm text-red-600 text-center bg-red-50 rounded-xl py-3 px-4">
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading || isLoadingSlots || isConfigLoading || !formData.time}
                  className="btn-primary w-full text-lg disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    'Подтвердить запись'
                  )}
                </button>

                <p className="text-center text-sm text-gray-500">
                  Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                </p>
              </form>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} className="text-green-600" />
              </div>
              <h3 className="heading-3 mb-4">Запись подтверждена!</h3>
              <p className="text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
                {confirmedBooking ? (
                  <>
                    {confirmedBooking.master && (
                      <>
                        {confirmedBooking.master}
                        <br />
                      </>
                    )}
                    {confirmedBooking.service}
                    <br />
                    {confirmedBooking.date} · {confirmedBooking.time} – {confirmedBooking.endTime}
                  </>
                ) : (
                  'Спасибо! Мы получили вашу заявку и свяжемся с вами в ближайшее время.'
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingModal
