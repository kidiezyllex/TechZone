import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Icon } from '@mdi/react';
import { mdiChevronDoubleRight, mdiWhatsapp, mdiStar } from '@mdi/js';
import { InteractiveHoverButton } from '../Common/InteractiveHoverButton';

export const HotDeals = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  };
  
  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { 
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="py-16 bg-gradient-to-br from-white to-[#f9fbf6] dark:from-gray-900 dark:to-gray-800 overflow-hidden"
    >
      <div className="container mx-auto">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col md:flex-row gap-4 items-center"
        >
          {}
          <motion.div 
            className="w-full md:w-1/2 flex justify-center"
          >
            <div 
            style={{
              backgroundImage: 'url(/images/hot-deals-bg.svg)',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              width: '100%',
              height: '100%',
            }}
            className="
            w-full
            relative overflow-hidden transform hover:scale-105 transition-transform duration-700">
              <div className="absolute z-10"></div>
              <img 
                src="/images/hot-deals-product.png" 
                alt="Laptop Gaming hiệu năng cao" 
                width={700} 
                height={700}
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>
          
          {}
          <motion.div
            className="w-full md:w-1/2 flex flex-col space-y-4"
          >
            <motion.div>
              <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider text-extra uppercase bg-extra/10 dark:bg-extra/20 rounded-full">
                Ưu đãi hấp dẫn
              </span>
              <h2 className="text-3xl md:text-4xl font-bold uppercase mb-2 bg-gradient-to-r from-primary via-secondary to-extra bg-clip-text text-transparent drop-shadow-sm">
                Laptop Gaming Hiệu Năng Cao
              </h2>
            </motion.div>
            
            <motion.div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">18.990.000₫</span>
                <span className="text-lg text-maintext line-through">24.990.000₫</span>
              </div>
              
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2 text-maintext dark:text-gray-300">ĐÁNH GIÁ</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Icon key={i} path={mdiStar} size={0.7} className="text-amber-500" />
                  ))}
                </div>
              </div>
            </motion.div>
            
            <motion.ul className="space-y-4">
              {[
                "CPU Intel Core i7-13700H hiệu năng mạnh mẽ",
                "Card đồ họa RTX 4060 8GB cho gaming mượt mà",
                "Màn hình 15.6 inch 144Hz Full HD sắc nét",
                "RAM 16GB DDR5 và SSD 512GB tốc độ cao"
              ].map((text, index) => (
                <li key={index} className="flex items-start">
                  <Icon path={mdiChevronDoubleRight} size={0.7} className="mt-1 mr-2 text-secondary" />
                  <span className="text-maintext dark:text-gray-300 text-sm">{text}</span>
                </li>
              ))}
            </motion.ul>
            
            <motion.p
              className="text-maintext dark:text-maintext text-sm leading-relaxed"
            >
              Laptop gaming hiệu năng cao với thiết kế mạnh mẽ và công nghệ tiên tiến. Sự kết hợp hoàn hảo giữa hiệu năng vượt trội và thiết kế đẳng cấp mang đến trải nghiệm gaming tuyệt vời nhất.
            </motion.p>
            
            <motion.div
              className="flex flex-wrap gap-4 items-center mt-2"
            >
              <InteractiveHoverButton className="uppercase font-medium rounded-none bg-gradient-to-r from-primary to-secondary text-white px-16">
                Mua ngay
              </InteractiveHoverButton>
              
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center w-10 h-10 rounded-none bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-primary/30 transition-all duration-300"
              >
                <Icon path={mdiWhatsapp} size={1} />
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HotDeals; 