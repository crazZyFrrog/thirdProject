import React, { useState } from 'react'

const GalleryImage = ({ image, className = '', onOpen }) => {
  const [failed, setFailed] = useState(false)

  if (failed) return null

  return (
    <button
      type="button"
      onClick={() => onOpen(image)}
      className={`group block w-full overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ${className}`}
    >
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
    </button>
  )
}

export default GalleryImage
