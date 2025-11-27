'use client'

import React, { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductCard } from '@/components/Products/ProductCard'

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  badge?: string
}

interface ProductCarouselProps {
  products: Product[]
  title?: string
  showNavigation?: boolean
}

export function ProductCarousel({ products, showNavigation = true }: ProductCarouselProps) {
  const prevRef = useRef(null)
  const nextRef = useRef(null)

  return (
    <div className="relative group">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={16}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onInit={(swiper) => {
          if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
            swiper.params.navigation.prevEl = prevRef.current
            swiper.params.navigation.nextEl = nextRef.current
            swiper.navigation.init()
            swiper.navigation.update()
          }
        }}
        className="pb-12"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard {...product} />
          </SwiperSlide>
        ))}
      </Swiper>

      {}
      {showNavigation && (
        <>
          <button
            ref={prevRef}
            className="absolute -left-5 top-1/2 -translate-y-1/2 bg-white border border-gray-200 hover:border-primary text-primary p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            ref={nextRef}
            className="absolute -right-5 top-1/2 -translate-y-1/2 bg-white border border-gray-200 hover:border-primary text-primary p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}
    </div>
  )
}
