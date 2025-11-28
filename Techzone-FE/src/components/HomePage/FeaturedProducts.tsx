import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Icon } from '@mdi/react';
import { mdiCartOutline, mdiHeartOutline, mdiArrowRight } from '@mdi/js';
import { useRef } from 'react';

const featuredProducts = [
  {
    id: 1,
    name: 'ASUS ROG Strix G15',
    price: 25990000,
    image: 'https://m.media-amazon.com/images/I/61LlFyN+B3L._AC_SL1200_.jpg',
    category: 'Laptop Gaming',
    discount: 10,
  },
  {
    id: 2,
    name: 'MacBook Pro M3',
    price: 42990000,
    image: 'https://m.media-amazon.com/images/I/51ZqjuoQFWL._AC_SL1200_.jpg',
    category: 'Laptop Đồ họa',
    discount: 5,
  },
  {
    id: 3,
    name: 'RTX 4070 Super',
    price: 18990000,
    image: 'https://m.media-amazon.com/images/I/81PChIf5pwL._AC_SL1500_.jpg',
    category: 'Card đồ họa',
    discount: 8,
  },
  {
    id: 4,
    name: 'Dell XPS 15',
    price: 32990000,
    image: 'https://m.media-amazon.com/images/I/61XuP8qrI+L._AC_SL1500_.jpg',
    category: 'Laptop Văn phòng',
    discount: 12,
  },
];


const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};


const ProductCard = ({ product, index }: { product: typeof featuredProducts[0], index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="group bg-white dark:bg-gray-800 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="relative">
        <div className="overflow-hidden aspect-square">
          <img
            src={product.image}
            alt={product.name}
            width={400}
            height={400}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>

        {product.discount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 left-3 bg-extra text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow-lg"
          >
            -{product.discount}%
          </motion.div>
        )}

        <div className="absolute top-3 right-3 space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full w-10 h-10 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 shadow-lg"
          >
            <Icon path={mdiHeartOutline} size={1} className="text-maintext dark:text-gray-300" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full w-10 h-10 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 shadow-lg"
          >
            <Icon path={mdiCartOutline} size={1} className="text-maintext dark:text-gray-300" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="text-sm text-maintext dark:text-maintext mb-2">{product.category}</div>
        <h3 className="font-semibold text-maintext dark:text-white text-lg mb-3 group-hover:text-primary transition-colors duration-300">
          {product.name}
        </h3>

        <div className="flex items-baseline justify-between">
          <div className="space-y-1">
            <span className="font-bold text-primary text-lg">{formatPrice(discountedPrice)}</span>
            {product.discount > 0 && (
              <span className="text-sm text-maintext dark:text-maintext line-through block">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const FeaturedProducts = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-maintext dark:text-white mb-4">
            Sản phẩm nổi bật
          </h2>
          <p className="text-maintext dark:text-gray-300 max-w-2xl mx-auto">
            Khám phá laptop, linh kiện PC và phụ kiện công nghệ mới nhất từ các thương hiệu hàng đầu
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 text-center"
        >
          <Button
            variant="outline"
            className="group border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
          >
            Xem tất cả sản phẩm
            <Icon path={mdiArrowRight} size={1} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;