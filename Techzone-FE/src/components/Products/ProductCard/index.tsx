import React from 'react'
import { Star, ShoppingCart, Eye } from 'lucide-react'
import { Card } from '@/components/Common/Card'
import { Badge } from '@/components/Common/Badge'

interface ProductCardProps {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  badge?: string
  onViewDetails?: () => void
  onAddToCart?: () => void
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  rating,
  reviews,
  badge,
  onViewDetails,
  onAddToCart,
}: ProductCardProps) {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return (
    <Card hover className="group">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-100 h-48">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {badge && (
          <div className="absolute top-3 right-3">
            <Badge variant="primary">{badge}</Badge>
          </div>
        )}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-error text-white px-2 py-1 rounded text-xs font-bold">
            -{discount}%
          </div>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="bg-white text-primary p-3 rounded-full hover:bg-primary hover:text-white transition-colors"
            >
              <Eye size={20} />
            </button>
          )}
          {onAddToCart && (
            <button
              onClick={onAddToCart}
              className="bg-primary text-white p-3 rounded-full hover:bg-primary/90 transition-colors"
            >
              <ShoppingCart size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">({reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">{price.toLocaleString()}đ</span>
          {originalPrice && <span className="text-sm text-gray-500 line-through">{originalPrice.toLocaleString()}đ</span>}
        </div>
      </div>
    </Card>
  )
}
