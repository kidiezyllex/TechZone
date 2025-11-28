import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ProductCard, Product } from '@/components/HomePage/ProductCard';

const newArrivalsData: Product[] = [
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
  },
  {
    id: 5,
    name: "Ant Esports GS170 Gaming Speaker for PC, Stereo 2.0 USB Powered Desktop Speaker with 3.5 mm Aux-in, in-line Volume Control",
    price: 2490000,
    originalPrice: 2990000,
    discount: 17,
    image: "https://m.media-amazon.com/images/I/611hOaZ2MVL._SL1500_.jpg",
    rating: 4,
    slug: "ant-esports-gs170",
    brand: "",
    colors: ["Đen", "Cam"],
    isBestSeller: false,
    stock: 12
  }
];

export const NewArrivals = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <section
      style={{
        backgroundImage: 'url(/images/new-arrivals.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      className="relative overflow-hidden py-20 pt-12 bg-gradient-to-b from-white to-[#F8FBF6] dark:from-gray-900 dark:to-gray-800">
      <div className="absolute inset-0 bg-[rgba(173,216,230,0.15)] pointer-events-none" aria-hidden="true" />
      <div className="relative z-10 container mx-auto">
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
          <p className="text-maintext dark:text-gray-300 max-w-3xl mx-auto text-lg">
            Khám phá laptop, linh kiện PC và phụ kiện công nghệ mới nhất với hiệu năng vượt trội
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {newArrivalsData.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals; 