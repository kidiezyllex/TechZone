import React from 'react'
import { Monitor, SquareChevronRight } from 'lucide-react'

interface Category {
  id: number
  name: string
  icon: React.ReactNode
  count?: number
}

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <div
          key={category.id}
          className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg hover:border-primary transition-all cursor-pointer group"
        >
          <div className="flex justify-center mb-3 text-gray-400 group-hover:text-primary transition-colors">
            {category.icon}
          </div>
          <h3 className="font-semibold text-gray-900 text-sm mb-1">{category.name}</h3>
          {category.count && <p className="text-xs text-gray-500">{category.count} sản phẩm</p>}
        </div>
      ))}
    </div>
  )
}
