/**
 * Gallery Component
 * Displays images in a grid gallery
 */

import { useState } from 'react'
import { X, ZoomIn } from 'lucide-react'

export function GalleryComponent({ config }) {
  const {
    images = [],
    title = 'Gallery',
    columns = 3,
    showCaptions = true
  } = config

  const [lightboxImage, setLightboxImage] = useState(null)

  if (!images || images.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-500 text-center">No images in gallery</p>
      </div>
    )
  }

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4'
  }

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      )}

      <div className={`grid ${gridCols[columns] || gridCols[3]} gap-4`}>
        {images.map((image, index) => (
          <div
            key={index}
            className="relative group cursor-pointer overflow-hidden rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
            onClick={() => setLightboxImage(image)}
          >
            <img
              src={image.url || image.src || image}
              alt={image.alt || image.caption || `Image ${index + 1}`}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
              <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
            </div>

            {showCaptions && (image.caption || image.title) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                <p className="text-white text-sm font-medium">
                  {image.caption || image.title}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setLightboxImage(null)}
          >
            <X size={32} />
          </button>

          <div className="max-w-5xl max-h-[90vh]">
            <img
              src={lightboxImage.url || lightboxImage.src || lightboxImage}
              alt={lightboxImage.alt || lightboxImage.caption || 'Image'}
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {(lightboxImage.caption || lightboxImage.title) && (
              <p className="text-white text-center mt-4">
                {lightboxImage.caption || lightboxImage.title}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default GalleryComponent
