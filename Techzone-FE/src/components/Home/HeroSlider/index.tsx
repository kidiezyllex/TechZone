'use client'

import React, { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface HeroBanner {
  id: number
  title: string
  subtitle: string
  image: string
  link?: string
  badge?: string
}

interface HeroSliderProps {
  banners: HeroBanner[]
}

export function HeroSlider({ banners }: HeroSliderProps) {
  const prevRef = useRef(null)
  const nextRef = useRef(null)

  return (
    <div className="relative rounded-lg overflow-hidden group">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, el: '.swiper-pagination' }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onInit={(swiper) => {
          if (swiper.params.navigation) {
            swiper.params.navigation.prevEl = prevRef.current
            swiper.params.navigation.nextEl = nextRef.current
            swiper.navigation.init()
            swiper.navigation.update()
          }
        }}
        className="h-96 md:h-96 lg:h-[450px] w-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="relative w-full h-full">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-start p-8">
                <div className="max-w-md">
                  {banner.badge && (
                    <span className="inline-block bg-accent text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                      {banner.badge}
                    </span>
                  )}
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">{banner.title}</h2>
                  <p className="text-lg text-gray-100 mb-6">{banner.subtitle}</p>
                  <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                    Mua ngay
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <button
        ref={prevRef}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-primary p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        ref={nextRef}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-primary p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="swiper-pagination absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex justify-center gap-2">
      </div>
    </div>
  )
}
