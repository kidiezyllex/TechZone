import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Icon } from '@mdi/react';
import { mdiCartOutline, mdiHeartOutline, mdiEye, mdiArrowRight } from '@mdi/js';
import { InteractiveHoverButton } from '../Common/InteractiveHoverButton';

export interface Product {
    id: number;
    name: string;
    price: number;
    originalPrice: number;
    discount: number;
    image: string;
    rating: number;
    slug: string;
    brand: string;
    colors: string[];
    isBestSeller: boolean;
    stock: number;
}

interface ProductCardProps {
    product: Product;
    index: number;
}

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

export const ProductCard = ({ product, index }: ProductCardProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const formatPrice = (price: number) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative bg-white dark:bg-gray-800 rounded-md overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 pb-3 flex flex-col border border-slate-200"
        >
            <a href={`/products/${product.slug}`} className="block relative overflow-hidden">
                <div className="relative aspect-square w-full overflow-hidden h-48">
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

            <div className="p-3 pb-0 flex flex-col gap-1">
                <div className="text-xs font-medium text-primary uppercase tracking-wider">{product.brand}</div>
                <h3 className="text-maintext dark:text-white font-medium text-lg truncate group-hover:text-primary transition-colors duration-200">
                    <a href={`/products/${product.slug}`}>{product.name}</a>
                </h3>
                <div className="flex items-baseline gap-2 mb-1 justify-between">
                    <span className="font-semibold text-lg text-primary">
                        {formatPrice(product.price)}
                    </span>
                    {product.discount > 0 && (
                        <span className="text-sm text-maintext line-through">{formatPrice(product.originalPrice)}</span>
                    )}
                </div>
            </div>
            <div className="flex w-full flex-col items-center justify-end flex-1 mt-2 px-3">
                <InteractiveHoverButton className="rounded-none uppercase font-normal h-9 max-h-9 w-full text-sm">
                    Xem chi tiết
                    <Icon path={mdiArrowRight} size={0.7} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </InteractiveHoverButton>
            </div>
        </motion.div>
    );
};

