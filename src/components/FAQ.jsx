import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: 'А если я не знаю, какая стрижка мне подойдёт?',
      answer: 'Перед работой проводится консультация. Подберём вариант с учётом формы лица, структуры волос и вашего образа жизни.'
    },
    {
      question: 'А если у меня был неудачный опыт?',
      answer: 'Многие клиенты приходят именно после таких ситуаций. Здесь важны спокойствие, внимание и постепенная работа над результатом.'
    },
    {
      question: 'Сколько времени занимает процедура?',
      answer: 'Зависит от услуги, но время всегда закладывается с запасом — без спешки и потока.'
    },
    {
      question: 'Можно ли записаться на консультацию отдельно?',
      answer: 'Да, можно сначала обсудить пожелания и только потом принять решение.'
    },
    {
      question: 'Какие материалы используются?',
      answer: 'Только проверенные профессиональные средства для бережной работы с волосами.'
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="section-padding bg-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="heading-2 mb-6">
            Частые вопросы
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden transition-all duration-300 hover:border-accent-200"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 text-lg pr-4">
                  {faq.question}
                </span>
                <ChevronDown 
                  size={24} 
                  className={`flex-shrink-0 text-accent-600 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-8 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
