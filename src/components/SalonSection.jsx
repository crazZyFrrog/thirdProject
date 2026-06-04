import React, { useMemo, useState } from 'react'
import { salonImages, shuffleGalleryImages } from '../data/gallery'
import GalleryImage from './GalleryImage'
import ImageLightbox from './ImageLightbox'
import { galleryGridClass, gallerySpanClass } from './galleryLayout'

const SalonSection = () => {
  const [lightboxImage, setLightboxImage] = useState(null)
  const images = useMemo(() => shuffleGalleryImages(salonImages), [])

  if (images.length === 0) return null

  return (
    <section id="salon" className="section-padding-tight bg-gradient-to-b from-white to-primary-50">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-600 mb-3">
            Наш салон
          </p>
          <h2 className="heading-2 mb-3 text-3xl sm:text-4xl lg:text-[2.75rem]">Уютное пространство на ул. Глаголева</h2>
          <p className="text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Спокойная атмосфера без спешки — чай, кофе и время для каждого клиента.
          </p>
        </div>

        <div className={galleryGridClass}>
          {images.map((image) => (
            <GalleryImage
              key={image.src}
              image={image}
              onOpen={setLightboxImage}
              className={`${gallerySpanClass(image.span)} h-full`}
            />
          ))}
        </div>
      </div>

      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </section>
  )
}

export default SalonSection
