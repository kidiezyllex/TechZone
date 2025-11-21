import React, { useState, useEffect } from 'react'
import { Zap } from 'lucide-react'
import { Badge } from '@/components/Common/Badge'

interface FlashSaleProps {
  endTime: Date
}

export function FlashSale({ endTime }: FlashSaleProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const diff = endTime.getTime() - now.getTime()

      if (diff > 0) {
        setTimeLeft({
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  return (
    <div className="bg-gradient-to-r from-accent/10 to-primary/10 border-2 border-accent rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="text-accent" size={32} />
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Flash Sale</h3>
            <p className="text-sm text-gray-600">Chiết khấu lên đến 50%</p>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="flex gap-4 text-center">
          <div className="bg-white border-2 border-accent rounded-lg px-4 py-3">
            <div className="text-2xl font-bold text-accent">{String(timeLeft.hours).padStart(2, '0')}</div>
            <div className="text-xs text-gray-600">Giờ</div>
          </div>
          <div className="bg-white border-2 border-accent rounded-lg px-4 py-3">
            <div className="text-2xl font-bold text-accent">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div className="text-xs text-gray-600">Phút</div>
          </div>
          <div className="bg-white border-2 border-accent rounded-lg px-4 py-3">
            <div className="text-2xl font-bold text-accent">{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div className="text-xs text-gray-600">Giây</div>
          </div>
        </div>

        <button className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
          Xem ngay
        </button>
      </div>
    </div>
  )
}
