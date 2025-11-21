import React from 'react'

interface Brand {
  id: number
  name: string
  logo: string
}

interface BrandGridProps {
  brands: Brand[]
}

export function BrandGrid({ brands }: BrandGridProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
      {brands.map((brand) => (
        <div
          key={brand.id}
          className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-center h-24 hover:shadow-lg hover:border-primary transition-all cursor-pointer"
        >
          <img src={brand.logo} alt={brand.name} className="max-w-full max-h-16 object-contain" />
        </div>
      ))}
    </div>
  )
}
