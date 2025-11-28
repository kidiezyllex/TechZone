import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Icon } from '@mdi/react';
import { mdiArrowLeft, mdiChevronLeft } from '@mdi/js';
import { InteractiveHoverButton } from '../Common/InteractiveHoverButton';
import { ProductCard } from './ProductCard';

const bestSellerData = [
  {
    id: 1,
    name: "Lenovo Legion Pro 5 2025 Intel Core Ultra 7 255HX",
    price: 32990000,
    originalPrice: 35990000,
    discount: 8,
    image: "https://m.media-amazon.com/images/I/71bhP2ueWmL._SL1500_.jpg",
    rating: 5,
    slug: "lenovo-legion-pro-5-2025-intel-core-ultra-7-255hx",
    brand: "Lenovo",
    colors: ["Đen", "Xanh"],
    isBestSeller: true,
    stock: 7
  },
  {
    id: 2,
    name: "Acer Predator Helios Neo16S AI, Intel Ultra 7 255HX Processor",
    price: 27990000,
    originalPrice: 30990000,
    discount: 10,
    image: "https://m.media-amazon.com/images/I/51S7YnmsUnL._SL1280_.jpg",
    rating: 4,
    slug: "acer-predator-helios-neo",
    brand: "Acer",
    colors: ["Đen"],
    isBestSeller: true,
    stock: 11
  },
  {
    id: 3,
    name: "HP Victus, 13th Gen Intel Core i7-13620H",
    price: 37990000,
    originalPrice: 41990000,
    discount: 10,
    image: "https://m.media-amazon.com/images/I/71ZDvI4yXAL._SL1500_.jpg",
    rating: 5,
    slug: "hp-victus-13th-gen-intel-core-i7-13620h",
    brand: "Razer",
    colors: ["Bạc", "Đen"],
    isBestSeller: true,
    stock: 5
  },
  {
    id: 4,
    name: "GIGABYTE Aorus 15 9Kf-E3In583Sh Windows 11, Intel Core i5 12Th Gen",
    price: 33990000,
    originalPrice: 36990000,
    discount: 8,
    image: "https://m.media-amazon.com/images/I/61F5n9hnifL._SL1200_.jpg",
    rating: 5,
    slug: "gigabyte-aorus-15-9kf-e3in583sh-windows-11-intel-core-i5-12th-gen",
    brand: "Gigabyte",
    colors: ["Đen", "Cam"],
    isBestSeller: true,
    stock: 9
  },
  {
    id: 5,
    name: "Intel NUC 13 Pro Kit NUC13ANHi5 Mini PC Business Desktop Computer",
    price: 25990000,
    originalPrice: 28990000,
    discount: 10,
    image: "https://m.media-amazon.com/images/I/41ZwCdoDmAL._SL1500_.jpg",
    rating: 4,
    slug: "intel-nuc-13-extreme",
    brand: "Intel",
    colors: ["Đen"],
    isBestSeller: true,
    stock: 14
  },
  {
    id: 6,
    name: "ASUS TUF A15 (2025), AMD Ryzen 7 7445HS, Gaming Laptop",
    price: 30990000,
    originalPrice: 34990000,
    discount: 11,
    image: "https://m.media-amazon.com/images/I/81nPkLHN3vL._SL1500_.jpg",
    rating: 5,
    slug: "asus-proart-studiobook",
    brand: "ASUS",
    colors: ["Xám"],
    isBestSeller: true,
    stock: 8
  },
  {
    id: 7,
    name: "Kingston FURY Renegade 1TB PCIe Gen 4.0 NVMe M.2 Internal Gaming SSD",
    price: 5490000,
    originalPrice: 6290000,
    discount: 13,
    image: "https://m.media-amazon.com/images/I/719a6tbF1gL._SL1500_.jpg",
    rating: 4,
    slug: "kingston-fury-renegade-2tb",
    brand: "Kingston",
    colors: ["Đen", "Bạc"],
    isBestSeller: false,
    stock: 16
  },
  {
    id: 8,
    name: "CORSAIR DDR5-7200MHz Desktop PC Memory Dominator Titanium DDR5 Series",
    price: 6490000,
    originalPrice: 7490000,
    discount: 13,
    image: "https://m.media-amazon.com/images/I/61FvCy+l77L._SL1500_.jpg",
    rating: 4,
    slug: "corsair-dominator-titanium-64gb",
    brand: "Corsair",
    colors: ["Đen", "Trắng"],
    isBestSeller: false,
    stock: 10
  },
  {
    id: 9,
    name: "MSI Stealth 16 AI Studio, Intel 1st Gen. Ultra 9 185H",
    price: 35990000,
    originalPrice: 39990000,
    discount: 10,
    image: "https://m.media-amazon.com/images/I/71cI7-kW2yL._SL1500_.jpg",
    rating: 5,
    slug: "msi-stealth-16-studio",
    brand: "MSI",
    colors: ["Đen", "Trắng"],
    isBestSeller: true,
    stock: 9
  },
  {
    id: 10,
    name: "HyperX Pulsefire Haste 2 Wireless Gaming Mouse Ultra Lightweight",
    price: 3990000,
    originalPrice: 4490000,
    discount: 11,
    image: "https://m.media-amazon.com/images/I/51x7IElGq+L._SL1500_.jpg",
    rating: 5,
    slug: "hyperx-pulsefire-haste-2-wireless-gaming-mouse-ultra-lightweight",
    brand: "Logitech",
    colors: ["Đen", "Trắng", "Hồng"],
    isBestSeller: true,
    stock: 20
  }
];

export const BestSeller = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

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
          <p className="text-maintext dark:text-gray-300 max-w-4xl mx-auto text-lg">
            Khám phá laptop và linh kiện PC bán chạy nhất với hiệu năng và chất lượng vượt trội
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {bestSellerData.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
        <div className="flex w-full flex-col items-center justify-end flex-1 mt-8">
          <InteractiveHoverButton className='!rounded-full uppercase font-normal w-fit text-sm px-6'>
            Xem tất cả
            <Icon path={mdiChevronLeft} size={1} className="
        ml-2 group-hover:translate-x-1 transition-transform transform scale-x-[-1]" />
          </InteractiveHoverButton>
        </div>
      </div>
    </section>
  );
};

export default BestSeller; 