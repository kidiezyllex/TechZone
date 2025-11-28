import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Icon } from '@mdi/react';
import { mdiCartOutline, mdiHeartOutline, mdiStar, mdiEye, mdiArrowRight, mdiArrowLeft } from '@mdi/js';
import { InteractiveHoverButton } from '../Common/InteractiveHoverButton';

const bestSellerData = [
  {
    id: 1,
    name: "ASUS ROG Strix G15",
    price: 22990000,
    originalPrice: 25990000,
    discount: 12,
    image: "https://m.media-amazon.com/images/I/61LlFyN+B3L._AC_SL1200_.jpg",
    rating: 5,
    slug: "asus-rog-strix-g15",
    brand: "ASUS",
    colors: ["Đen", "Xám"],
    isBestSeller: true,
    stock: 8
  },
  {
    id: 2,
    name: "MacBook Pro M3 14 inch",
    price: 38990000,
    originalPrice: 42990000,
    discount: 9,
    image: "https://m.media-amazon.com/images/I/51ZqjuoQFWL._AC_SL1200_.jpg",
    rating: 5,
    slug: "macbook-pro-m3-14",
    brand: "Apple",
    colors: ["Bạc", "Xám"],
    isBestSeller: true,
    stock: 12
  },
  {
    id: 3,
    name: "RTX 4070 Super 12GB",
    price: 17490000,
    originalPrice: 18990000,
    discount: 8,
    image: "https://m.media-amazon.com/images/I/81PChIf5pwL._AC_SL1500_.jpg",
    rating: 5,
    slug: "rtx-4070-super-12gb",
    brand: "NVIDIA",
    colors: ["Đen"],
    isBestSeller: true,
    stock: 10
  },
  {
    id: 4,
    name: "Dell XPS 15 OLED",
    price: 28990000,
    originalPrice: 32990000,
    discount: 12,
    image: "https://m.media-amazon.com/images/I/61XuP8qrI+L._AC_SL1500_.jpg",
    rating: 5,
    slug: "dell-xps-15-oled",
    brand: "Dell",
    colors: ["Bạc", "Đen"],
    isBestSeller: true,
    stock: 15
  },
  {
    id: 5,
    name: "Intel Core i7-13700K",
    price: 9990000,
    originalPrice: 11990000,
    discount: 17,
    image: "https://m.media-amazon.com/images/I/81PChIf5pwL._AC_SL1500_.jpg",
    rating: 5,
    slug: "intel-core-i7-13700k",
    brand: "Intel",
    colors: ["Bạc"],
    isBestSeller: true,
    stock: 18
  },
  {
    id: 6,
    name: "HP Pavilion 15",
    price: 14990000,
    originalPrice: 17990000,
    discount: 17,
    image: "https://m.media-amazon.com/images/I/51ZqjuoQFWL._AC_SL1200_.jpg",
    rating: 4,
    slug: "hp-pavilion-15",
    brand: "HP",
    colors: ["Bạc", "Đen"],
    isBestSeller: true,
    stock: 6
  },
  {
    id: 7,
    name: "Samsung 980 PRO 1TB",
    price: 2990000,
    originalPrice: 3490000,
    discount: 14,
    image: "https://m.media-amazon.com/images/I/81PChIf5pwL._AC_SL1500_.jpg",
    rating: 4,
    slug: "samsung-980-pro-1tb",
    brand: "Samsung",
    colors: ["Đen"],
    isBestSeller: false,
    stock: 8
  },
  {
    id: 8,
    name: "Corsair Vengeance 32GB",
    price: 3990000,
    originalPrice: 4490000,
    discount: 11,
    image: "https://m.media-amazon.com/images/I/81PChIf5pwL._AC_SL1500_.jpg",
    rating: 4,
    slug: "corsair-vengeance-32gb",
    brand: "Corsair",
    colors: ["Đen", "Trắng"],
    isBestSeller: false,
    stock: 12
  }
];

const fallbackImages = [
  "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-300x300.jpg",
  "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-1-300x300.jpg",
  "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-2-300x300.jpg",
  "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-4-300x300.jpg",
  "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-5-300x300.jpg",
  "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-7-300x300.jpg",
  "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-6-300x300.jpg",
  "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-3-300x300.jpg"
];


const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1 items-center">
      {[...Array(5)].map((_, i) => (
        <Icon
          key={i}
          path={mdiStar}
          size={0.7}
          className={i < rating ? "text-amber-500" : "text-gray-300"}
        />
      ))}
      <span className="text-xs text-maintext ml-1">({rating}.0)</span>
    </div>
  );
};


const DiscountBadge = ({ discount }: { discount: number }) => {
  if (!discount) return null;

  return (
    <div className="absolute top-3 left-3 z-10 px-2 py-1 rounded-none font-medium text-xs text-white bg-gradient-to-r from-red-500 to-amber-500">
      -{discount}%
    </div>
  );
};


const BestSellerBadge = ({ isBestSeller }: { isBestSeller: boolean }) => {
  if (!isBestSeller) return null;

  return (
    <div className="absolute top-3 left-3 z-10 px-2 py-1 rounded-none font-medium text-xs text-white bg-gradient-to-r from-primary to-secondary">
      Best Seller
    </div>
  );
};


const ColorOptions = ({ colors }: { colors: string[] }) => {
  return (
    <div className="flex gap-1 items-center">
      {colors.map((color, i) => (
        <div key={i} className="group relative">
          <div
            className="w-4 h-4 rounded-full border cursor-pointer hover:scale-110 transition-transform duration-200"
            style={{
              backgroundColor: color === 'Đen' ? 'black' :
                color === 'Trắng' ? 'white' :
                  color === 'Xanh' ? '#3B82F6' :
                    color === 'Xanh đen' ? '#1e293b' :
                      color === 'Đỏ' ? '#EF4444' :
                        color === 'Hồng' ? '#EC4899' :
                          color === 'Xám' ? '#6B7280' :
                            color === 'Cam' ? '#F97316' :
                              color === 'Vàng' ? '#EAB308' :
                                color === 'Kem' ? '#FEF3C7' :
                                  color === 'Xanh rêu' ? '#4D7C0F' : '#9CA3AF'
            }}
          />
        </div>
      ))}
    </div>
  );
};


const ProductCard = ({ product, index }: { product: typeof bestSellerData[0], index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-white dark:bg-gray-800 rounded-[6px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 pb-4 flex flex-col border border-gray-100"
    >
      <a href={`/products/${product.slug}`} className="block relative overflow-hidden">
        <div className="relative aspect-square w-full overflow-hidden">
          {product.discount > 0 && <DiscountBadge discount={product.discount} />}
          {product.isBestSeller && <BestSellerBadge isBestSeller={product.isBestSeller} />}

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

          <img
            src={product.image.startsWith('//') ? `https:${product.image}` : product.image}
            alt={product.name}
            className="object-cover transition-transform duration-700 group-hover:scale-110 w-full h-full"
            draggable="false"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = fallbackImages[index % fallbackImages.length];
            }}
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-center items-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full w-9 h-9 bg-white/80 hover:bg-white shadow-md backdrop-blur-sm flex items-center justify-center"
            title="Xem nhanh"
          >
            <Icon path={mdiEye} size={0.7} className="text-maintext" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full w-9 h-9 bg-white/80 hover:bg-white shadow-md backdrop-blur-sm flex items-center justify-center"
            title="Yêu thích"
          >
            <Icon path={mdiHeartOutline} size={0.7} className="text-maintext" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full w-9 h-9 bg-white/80 hover:bg-white shadow-md backdrop-blur-sm flex items-center justify-center"
            title="Thêm vào giỏ hàng"
          >
            <Icon path={mdiCartOutline} size={0.7} className="text-maintext" />
          </Button>
        </div>
      </a>

      <div className="p-4 pb-0 flex flex-col gap-1">
        <div className="text-xs font-medium text-primary uppercase tracking-wider">
          {product.brand}
        </div>
        <h3 className="text-maintext dark:text-white font-semibold text-lg truncate group-hover:text-primary transition-colors duration-200">
          <a href={`/products/${product.slug}`}>
            {product.name}
          </a>
        </h3>
        <div className="">
          <RatingStars rating={product.rating} />
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {formatPrice(product.price)}
          </span>
          {product.discount > 0 && (
            <span className="text-sm text-maintext line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        <div className='flex gap-1 items-center justify-between mb-4'>
          <ColorOptions colors={product.colors} />

          {product.stock <= 10 && (
            <div className="text-xs text-orange-600 font-medium">
              (Chỉ còn {product.stock} sản phẩm)
            </div>
          )}</div>
      </div>
      <div className="flex w-full flex-col items-center justify-end flex-1">
        <InteractiveHoverButton className='rounded-none uppercase font-normal w-fit'>
          Xem chi tiết
          <Icon path={mdiArrowRight} size={0.7} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </InteractiveHoverButton>
      </div>
    </motion.div>
  );
};

export const BestSeller = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  return (
    <section className="py-20 pt-12 bg-[#FAFAFB] dark:bg-gray-900">
      <div className="container mx-auto">
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full">Bán chạy nhất</span>
          <h2 className="text-3xl font-bold text-center mb-4 relative">
            <span className="inline-block relative">
              <span className="uppercase bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-sm">
                Sản phẩm bán chạy
              </span>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            </span>
          </h2>
          <p className="text-maintext dark:text-gray-300 max-w-2xl mx-auto">
            Khám phá laptop và linh kiện PC bán chạy nhất với hiệu năng và chất lượng vượt trội
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {bestSellerData.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
        <div className="flex w-full flex-col items-center justify-end flex-1 mt-8">
          <InteractiveHoverButton className='!rounded-full uppercase font-normal w-fit'>
            Xem tất cả
            <Icon path={mdiArrowLeft} size={1} className="
        ml-2 group-hover:translate-x-1 transition-transform transform scale-x-[-1]" />
          </InteractiveHoverButton>
        </div>
      </div>
    </section>
  );
};

export default BestSeller; 