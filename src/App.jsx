import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Problem from './components/Problem'
import Solution from './components/Solution'
import SalonSection from './components/SalonSection'
import Masters from './components/Masters'
import WorksGallery from './components/WorksGallery'
import HowItWorks from './components/HowItWorks'
import Testimonials from './components/Testimonials'
import Pricing from './components/Pricing'
import FAQ from './components/FAQ'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import BookingModal from './components/BookingModal'

function App() {
  const [showHeader, setShowHeader] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowHeader(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const openBookingModal = () => setShowBookingModal(true)
  const closeBookingModal = () => setShowBookingModal(false)

  return (
    <div className="relative">
      <Header show={showHeader} onBookingClick={openBookingModal} />
      <Hero onBookingClick={openBookingModal} />
      <Problem />
      <Solution />
      <SalonSection />
      <Masters />
      <WorksGallery />
      <HowItWorks />
      <Testimonials />
      <Pricing onBookingClick={openBookingModal} />
      <FAQ />
      <FinalCTA onBookingClick={openBookingModal} />
      <Footer onBookingClick={openBookingModal} />
      <WhatsAppButton />
      <BookingModal isOpen={showBookingModal} onClose={closeBookingModal} />
    </div>
  )
}

export default App
