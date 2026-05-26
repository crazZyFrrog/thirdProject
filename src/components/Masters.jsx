import React from 'react'
import { masters } from '../data/masters'

const Masters = () => {
  return (
    <section id="masters" className="section-padding bg-gradient-to-b from-primary-50 to-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="heading-2 mb-6">Наши мастера</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            В команде — три специалиста с опытом 15+ лет. У каждого свой профиль услуг и индивидуальный подход к клиенту.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {masters.map((master) => (
            <article
              key={master.id}
              className="card-premium overflow-hidden group text-center p-0"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={master.image}
                  alt={`${master.name} — ${master.role} в салоне Мастерская красоты ЛТ`}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="heading-3 text-xl mb-1">{master.name}</h3>
                <p className="text-accent-700 font-medium text-sm mb-4">{master.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{master.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Masters
