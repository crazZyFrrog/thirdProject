export const gallerySpanClass = (span) => {
  if (span === 'tall') return 'sm:row-span-2 aspect-[3/4] sm:aspect-auto sm:min-h-[280px]'
  if (span === 'wide') return 'sm:col-span-2 aspect-[16/10]'
  return 'aspect-square sm:aspect-[4/5]'
}

export const galleryGridClass =
  'grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-6xl mx-auto sm:auto-rows-[180px]'
