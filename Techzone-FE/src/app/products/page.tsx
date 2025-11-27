'use client'

import React, { useState } from 'react'
import { Container } from '@/components/Common/Container'
import { PageHeader } from '@/components/Common/PageHeader'
import { Section } from '@/components/Common/Section'
import { ProductCard } from '@/components/Products/ProductCard'
import { Badge } from '@/components/Common/Badge'
import { LoadingGrid } from '@/components/Common/Loading'
import { EmptyState } from '@/components/Common/EmptyState'
import { Package, Search } from 'lucide-react'


const mockProducts = [
  {
    id: 1,
    name: 'Áo thun cotton basic',
    price: 99000,
    originalPrice: 149000,
    image: 'https://via.placeholder.com/300x300?text=Product+1',
    rating: 4.5,
    reviews: 128,
    badge: 'Bán chạy',
  },
  {
    id: 2,
    name: 'Quần jean nam',
    price: 249000,
    originalPrice: 349000,
    image: 'https://via.placeholder.com/300x300?text=Product+2',
    rating: 4.8,
    reviews: 256,
    badge: 'Mới',
  },
  {
    id: 3,
    name: 'Áo khoác lông',
    price: 599000,
    image: 'https://via.placeholder.com/300x300?text=Product+3',
    rating: 4.3,
    reviews: 89,
  },
  {
    id: 4,
    name: 'Giày sneaker',
    price: 449000,
    originalPrice: 599000,
    image: 'https://via.placeholder.com/300x300?text=Product+4',
    rating: 4.6,
    reviews: 342,
  },
]

export default function ProductsPage() {
  const [isLoading] = useState(false)

  if (isLoading) {
    return (
      <Container>
        <PageHeader title="Danh sách sản phẩm" />
        <LoadingGrid count={8} />
      </Container>
    )
  }

  return (
    <Container>
      <PageHeader
        title="Danh sách sản phẩm"
        subtitle="Khám phá bộ sưu tập sản phẩm chất lượng cao của chúng tôi"
        action={
          <div className="flex gap-2">
            <Badge variant="primary">Tất cả</Badge>
            <Badge variant="secondary">Mới nhất</Badge>
            <Badge variant="success">Bán chạy</Badge>
          </div>
        }
      />

      <Section title="Sản phẩm nổi bật" subtitle="Các sản phẩm được yêu thích nhất">
        {mockProducts.length === 0 ? (
          <EmptyState
            icon={<Package size={48} />}
            title="Không có sản phẩm nào"
            description="Hiện tại không có sản phẩm nào có sẵn. Vui lòng quay lại sau."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {mockProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onViewDetails={() => console.log('View', product.id)}
                onAddToCart={() => console.log('Add to cart', product.id)}
              />
            ))}
          </div>
        )}
      </Section>
    </Container>
  )
}
