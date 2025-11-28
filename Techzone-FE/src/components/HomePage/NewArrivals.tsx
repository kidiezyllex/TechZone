import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Icon } from '@mdi/react';
import { mdiCartOutline, mdiHeartOutline, mdiStar, mdiEye, mdiArrowRight } from '@mdi/js';
import { InteractiveHoverButton } from '../Common/InteractiveHoverButton';


const newArrivalsData = [
  {
    id: 1,
    name: "Acer Nitro KG271 X1",
    price: 24990000,
    originalPrice: 27990000,
    discount: 11,
    image: "https://m.media-amazon.com/images/I/816E2HRfkgL._SL1500_.jpg",
    rating: 5,
    slug: "acer-nitro-kg271-x1",
    brand: "Acer",
    colors: ["Đen", "Xám"],
    isBestSeller: true,
    stock: 15
  },
  {
    id: 2,
    name: "GIGABYTE Geforce RTX 4060 Eagle Oc 8G Graphics Card, 3X Windforce Fans",
    price: 24990000,
    originalPrice: 28990000,
    discount: 14,
    image: "https://m.media-amazon.com/images/I/71g2Lc8urJL._SL1500_.jpg",
    rating: 5,
    slug: "gigabyte-geforce-rtx-4060-eagle-oc-8g-graphics-card-3x-windforce-fans",
    brand: "GIGABYTE",
    colors: ["Đen"],
    isBestSeller: false,
    stock: 20
  },
  {
    id: 3,
    name: "Razer Viper V3 Pro Faker Edition - Ultralight Wireless Esports Gaming Mouse - 8k Hz HyperPolling",
    price: 1990000,
    originalPrice: 2490000,
    discount: 20,
    image: "https://m.media-amazon.com/images/I/71pHfo4qfML._SL1500_.jpg",
    rating: 5,
    slug: "razer-viper-v3-pro-faker-edition-ultralight-wireless-esports-gaming-mouse-8k-hz-hyperpolling",
    brand: "Razer",
    colors: ["Đỏ"],
    isBestSeller: true,
    stock: 8
  },
  {
    id: 4,
    name: "Keychron K3 Version 2, 84 Keys Ultra-Slim Wireless Bluetooth/USB Wired Mechanical Keyboard with White LED Backlit",
    price: 2490000,
    originalPrice: 2990000,
    discount: 17,
    image: "https://m.media-amazon.com/images/I/61x3nRatR9L._SL1500_.jpg",
    rating: 4,
    slug: "keychron-k3-version-2-84-keys-ultra-slim-wireless-bluetoothusb-wired-mechanical-keyboard-with-white-led-backlit",
    brand: "Keychron",
    colors: ["Đen", "Cam"],
    isBestSeller: false,
    stock: 12
  }
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
                    color === 'Đỏ' ? '#EF4444' :
                      color === 'Hồng' ? '#EC4899' :
                        color === 'Xám' ? '#6B7280' :
                          color === 'Cam' ? '#F97316' :
                            color === 'Navy' ? '#1E3A8A' :
                              color === 'Olive' ? '#65A30D' :
                                color === 'Xanh rêu' ? '#4D7C0F' : '#9CA3AF'
            }}
          />
        </div>
      ))}
    </div>
  );
};


const ProductCard = ({ product, index }: { product: typeof newArrivalsData[0], index: number }) => {
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
            src={product.image}
            alt={product.name}
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            draggable="false"
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

export const NewArrivals = () => {
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
    <section
      style={{
        backgroundImage: 'url(/images/new-arrivals.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      className="py-20 pt-12 bg-gradient-to-b from-white to-[#F8FBF6] dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto">
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full">Mới ra mắt</span>
          <h2 className="text-3xl font-bold text-center mb-4 relative">
            <span className="inline-block relative">
              <span className="uppercase bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-sm">
                Sản phẩm mới nhất
              </span>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>

            </span>
          </h2>
          <p className="text-maintext dark:text-gray-300 max-w-2xl mx-auto">
            Khám phá laptop, linh kiện PC và phụ kiện công nghệ mới nhất với hiệu năng vượt trội
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {newArrivalsData.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals; 