"use client"
import { useState } from "react"
import Image from "next/image"

export function PropertyImageGallery({ images, title }: { images: string[]; title: string }) {
  const [mainIndex, setMainIndex] = useState(0)
  const safeImages = images.length > 0 ? images : ["/placeholder.svg"]

  return (
    <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
      <div className="relative h-[500px]">
        <Image
          src={safeImages[mainIndex]}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>
      {safeImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3 p-4 bg-white">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setMainIndex(idx)}
              className={`relative h-24 rounded-lg overflow-hidden border ${mainIndex === idx ? "border-blue-500" : "border-gray-200"}`}
            >
              <Image
                src={img || "/placeholder.svg"}
                alt={`${title} ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}