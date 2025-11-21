'use client'

import React from 'react'
import { Container } from '@/components/Common/Container'
import { Section } from '@/components/Common/Section'
import { Card, CardContent } from '@/components/Common/Card'
import { Badge } from '@/components/Common/Badge'
import { ProductCard } from '@/components/Products/ProductCard'
import { HeroSlider } from '@/components/Home/HeroSlider'
import { ProductCarousel } from '@/components/Home/ProductCarousel'
import { CategoryGrid } from '@/components/Home/CategoryGrid'
import { FlashSale } from '@/components/Home/FlashSale'
import { BrandGrid } from '@/components/Home/BrandGrid'
import { BlogGrid } from '@/components/Home/BlogGrid'
import { Monitor, Cpu, Zap, Headphones, Keyboard, Mouse, Truck, CreditCard, Shield } from 'lucide-react'

// Mock data
const heroBanners = [
  {
    id: 1,
    title: 'Laptop Gaming Mạnh Mẽ',
    subtitle: 'RTX 4090, Intel Core i9 - Giải phóng sức mạnh chơi game',
    image: 'https://via.placeholder.com/1400x400?text=Banner+1',
    badge: 'Khuyến mãi lớn',
  },
  {
    id: 2,
    title: 'PC Workstation Chuyên Nghiệp',
    subtitle: 'Dành cho designers, editors, developers',
    image: 'https://via.placeholder.com/1400x400?text=Banner+2',
    badge: 'Giảm đến 40%',
  },
  {
    id: 3,
    title: 'Phụ Kiện Gaming Cao Cấp',
    subtitle: 'Keyboard, Mouse, Headset RGB đầy đủ',
    image: 'https://via.placeholder.com/1400x400?text=Banner+3',
    badge: 'Mua 2 giảm 15%',
  },
]

const categories = [
  { id: 1, name: 'Laptop', icon: <Monitor size={32} />, count: 542 },
  { id: 2, name: 'PC', icon: <Cpu size={32} />, count: 328 },
  { id: 3, name: 'VGA', icon: <Zap size={32} />, count: 215 },
  { id: 4, name: 'CPU', icon: <Cpu size={32} />, count: 189 },
  { id: 5, name: 'Tai nghe', icon: <Headphones size={32} />, count: 412 },
  { id: 6, name: 'Bàn phím', icon: <Keyboard size={32} />, count: 356 },
]

const latestProducts = [
  {
    id: 1,
    name: 'Laptop Gaming ASUS ROG',
    price: 28900000,
    originalPrice: 32900000,
    image: 'https://via.placeholder.com/300x300?text=Product+1',
    rating: 4.8,
    reviews: 156,
    badge: 'Mới',
  },
  {
    id: 2,
    name: 'PC Gaming High-end',
    price: 45000000,
    image: 'https://via.placeholder.com/300x300?text=Product+2',
    rating: 4.7,
    reviews: 89,
  },
  {
    id: 3,
    name: 'GPU RTX 4090',
    price: 24500000,
    originalPrice: 29999000,
    image: 'https://via.placeholder.com/300x300?text=Product+3',
    rating: 4.9,
    reviews: 234,
  },
  {
    id: 4,
    name: 'Monitor Gaming 240Hz',
    price: 8900000,
    originalPrice: 11900000,
    image: 'https://via.placeholder.com/300x300?text=Product+4',
    rating: 4.6,
    reviews: 127,
  },
]

const topProducts = [
  {
    id: 1,
    name: 'Laptop ASUS TUF',
    price: 19900000,
    image: 'https://via.placeholder.com/300x300?text=Top+1',
    rating: 4.8,
    reviews: 524,
  },
  {
    id: 2,
    name: 'Chuột Gaming Logitech',
    price: 2490000,
    image: 'https://via.placeholder.com/300x300?text=Top+2',
    rating: 4.7,
    reviews: 1256,
  },
  {
    id: 3,
    name: 'Bàn phím Cơ RGB',
    price: 3200000,
    image: 'https://via.placeholder.com/300x300?text=Top+3',
    rating: 4.9,
    reviews: 892,
  },
  {
    id: 4,
    name: 'Tai nghe Gaming SteelSeries',
    price: 4500000,
    image: 'https://via.placeholder.com/300x300?text=Top+4',
    rating: 4.6,
    reviews: 678,
  },
]

const brands = [
  { id: 1, name: 'ASUS', logo: 'https://via.placeholder.com/150x80?text=ASUS' },
  { id: 2, name: 'MSI', logo: 'https://via.placeholder.com/150x80?text=MSI' },
  { id: 3, name: 'Dell', logo: 'https://via.placeholder.com/150x80?text=Dell' },
  { id: 4, name: 'Gigabyte', logo: 'https://via.placeholder.com/150x80?text=Gigabyte' },
  { id: 5, name: 'Corsair', logo: 'https://via.placeholder.com/150x80?text=Corsair' },
  { id: 6, name: 'Nvidia', logo: 'https://via.placeholder.com/150x80?text=Nvidia' },
]

const blogs = [
  {
    id: 1,
    title: 'GPU RTX 4090 có thực sự cần thiết cho gamer?',
    excerpt: 'Hãy cùng tìm hiểu thông số, hiệu năng và giá trị thực sự của card đồ họa hàng đầu này...',
    image: 'https://via.placeholder.com/500x300?text=Blog+1',
    date: '21 Nov 2025',
    author: 'Phạm Huy',
  },
  {
    id: 2,
    title: 'Hướng dẫn chọn Laptop Gaming phù hợp ngân sách',
    excerpt: 'Từ 15 triệu đến 40 triệu, nên mua loại nào? Đọc bài này để không hối tiếc...',
    image: 'https://via.placeholder.com/500x300?text=Blog+2',
    date: '20 Nov 2025',
    author: 'Trần Minh',
  },
  {
    id: 3,
    title: 'Bảng so sánh SSD NVMe: Samsung vs WD vs Crucial',
    excerpt: 'Performance, độ bền, giá cả - toàn bộ so sánh chi tiết trong một bài viết...',
    image: 'https://via.placeholder.com/500x300?text=Blog+3',
    date: '19 Nov 2025',
    author: 'Lê Công',
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero Slider */}
      <Container className="mb-12">
        <HeroSlider banners={heroBanners} />
      </Container>

      <Container>
        {/* Featured Categories */}
        <Section title="Danh mục nổi bật" subtitle="Khám phá các sản phẩm chính">
          <CategoryGrid categories={categories} />
        </Section>

        {/* Flash Sale */}
        <Section title="" className="mb-12">
          <FlashSale endTime={new Date(Date.now() + 8 * 60 * 60 * 1000)} />
        </Section>

        {/* Latest Products - Carousel */}
        <Section title="Sản phẩm mới nhất" subtitle="Hàng vừa cập nhật">
          <ProductCarousel products={latestProducts} />
        </Section>

        {/* Top Selling Products - Carousel */}
        <Section title="Sản phẩm bán chạy (Top 10)" subtitle="Những sản phẩm yêu thích nhất của khách hàng" className="mt-12">
          <ProductCarousel products={topProducts} />
        </Section>

        {/* Featured Brands */}
        <Section title="Thương hiệu nổi bật" subtitle="Các hãng uy tín hàng đầu thế giới" className="mt-12">
          <BrandGrid brands={brands} />
        </Section>

        {/* Mid Banner - Promotions */}
        <Section className="mt-12 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <Truck className="text-primary mb-3" size={40} />
                <h3 className="font-semibold text-gray-900 mb-2">Miễn phí vận chuyển</h3>
                <p className="text-sm text-gray-600">Cho hóa đơn từ 3 triệu đồng</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <CreditCard className="text-secondary mb-3" size={40} />
                <h3 className="font-semibold text-gray-900 mb-2">Trả góp 0%</h3>
                <p className="text-sm text-gray-600">Lên đến 12 tháng</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <Shield className="text-accent mb-3" size={40} />
                <h3 className="font-semibold text-gray-900 mb-2">Bảo hành</h3>
                <p className="text-sm text-gray-600">Chính hãng 100%</p>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* Category Recommendations */}
        <Section title="Gợi ý theo danh mục" subtitle="Những sản phẩm nổi bật nhất" className="mb-12">
          <div className="space-y-8">
            {[
              { name: 'Laptop Gaming', emoji: '🎮' },
              { name: 'Laptop Văn phòng', emoji: '💼' },
              { name: 'Linh kiện PC', emoji: '🖥️' },
            ].map((category, idx) => (
              <div key={idx}>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  {category.emoji} {category.name}
                </h4>
                <ProductCarousel products={latestProducts.slice(0, 4)} showNavigation={true} />
              </div>
            ))}
          </div>
        </Section>

        {/* Blog Section */}
        <Section title="Tin tức / Blog nổi bật" subtitle="Cập nhật kiến thức công nghệ mỗi ngày" className="mb-12">
          <BlogGrid posts={blogs} />
        </Section>
      </Container>
    </>
  )
}
