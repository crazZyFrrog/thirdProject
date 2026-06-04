import React, { useState } from 'react'
import { workImages } from '../data/gallery'
import GalleryImage from './GalleryImage'
import ImageLightbox from './ImageLightbox'
import { galleryGridClass, gallerySpanClass } from './galleryLayout'

const WorksGallery = () => {
  const [lightboxImage, setLightboxImage] = useState(null)

  return (
    <section id="works" className="section-padding bg-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-600 mb-3">
            Портфолио
          </p>
          <h2 className="heading-2 mb-4">Наши работы</h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Стрижки, окрашивание, маникюр и брови — реальные результаты мастеров салона.
          </p>
        </div>

        {workImages.length === 0 ? (
          <div className="max-w-xl mx-auto text-center rounded-2xl border border-dashed border-primary-300 bg-primary-50/80 px-6 py-12">
            <p className="text-gray-700 leading-relaxed">Фотографии работ скоро появятся на сайте.</p>
          </div>
        ) : (
          <div className={galleryGridClass}>
            {workImages.map((image) => (
              <GalleryImage
                key={image.src}
                image={image}
                onOpen={setLightboxImage}
                className={`${gallerySpanClass(image.span)} h-full`}
              />
            ))}
          </div>
        )}
      </div>

      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </section>
  )
}

export default WorksGallery
