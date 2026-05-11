import React from 'react'
import { MessageSquare, Sparkles, Calendar, Smile } from 'lucide-react'

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      icon: MessageSquare,
      title: 'Оставьте заявку',
      description: 'Через сайт, WhatsApp или по телефону.'
    },
    {
      number: '02',
      icon: Sparkles,
      title: 'Получите консультацию',
      description: 'Обсудим ваши пожелания, состояние волос и подберём подходящую услугу.'
    },
    {
      number: '03',
      icon: Calendar,
      title: 'Приходите в удобное время',
      description: 'Без очередей и спешки — время полностью посвящено вам.'
    },
    {
      number: '04',
      icon: Smile,
      title: 'Наслаждайтесь результатом',
      description: 'Стрижка или окрашивание, которое легко носить в повседневной жизни.'
    }
  ]

  return (
    <section className="section-padding bg-gradient-to-b from-white to-primary-50">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="heading-2 mb-6">
            Записаться очень просто
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-accent-200 via-accent-300 to-accent-200 -translate-y-1/2" 
                 style={{ top: '80px' }}></div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="card-premium text-center group hover:shadow-accent-100">
                    {/* Step number */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent-600 to-accent-700 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {index + 1}
                      </div>
                    </div>
                    
                    <div className="pt-6 space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-accent-50 to-primary-50 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                        <step.icon size={32} className="text-accent-600" />
                      </div>
                      
                      <h3 className="font-display text-xl font-semibold text-gray-900">
                        {step.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
