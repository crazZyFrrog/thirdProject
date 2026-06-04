import React, { useEffect } from 'react'
import { X } from 'lucide-react'

const ImageLightbox = ({ image, onClose }) => {
  useEffect(() => {
    if (!image) return undefined

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [image, onClose])

  if (!image) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Просмотр фото"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
        aria-label="Закрыть"
      >
        <X size={24} />
      </button>
      <img
        src={image.src}
        alt={image.alt}
        className="max-h-[85vh] max-w-full rounded-lg shadow-2xl object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}

export default ImageLightbox
