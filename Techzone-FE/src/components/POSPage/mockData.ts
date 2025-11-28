export interface Category {
  id: string;
  name: string;
}

export interface ProductSize {
  id: string;
  size: string;
  quantity: number;
  price: number;
}

export interface ProductColor {
  id: string;
  name: string;
  code: string;
  image: string;
  sizes: ProductSize[];
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  brand: string;
  colors: ProductColor[];
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  color: string;
  colorCode: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

export const categories: Category[] = [
  { id: 'cat-1', name: 'Tất cả' },
  { id: 'cat-2', name: 'Laptop Gaming' },
  { id: 'cat-3', name: 'Laptop Văn phòng' },
  { id: 'cat-4', name: 'Laptop Đồ họa' },
  { id: 'cat-5', name: 'Linh kiện PC' },
  { id: 'cat-6', name: 'Phụ kiện' },
  { id: 'cat-7', name: 'Màn hình' },
];

export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'ASUS ROG Strix G15',
    brand: 'ASUS',
    description: 'Laptop Gaming ASUS ROG Strix G15 chính hãng',
    colors: [
      {
        id: 'color-1',
        name: 'Đen',
        code: '#000000',
        image: 'https://m.media-amazon.com/images/I/61LlFyN+B3L._AC_SL1200_.jpg',
        sizes: [
          { id: 'size-1', size: 'i5/8GB/512GB', quantity: 12, price: 22990000 },
          { id: 'size-2', size: 'i7/16GB/512GB', quantity: 8, price: 27990000 },
          { id: 'size-3', size: 'i7/16GB/1TB', quantity: 5, price: 29990000 },
          { id: 'size-4', size: 'i9/32GB/1TB', quantity: 10, price: 34990000 },
        ],
      },
      {
        id: 'color-2',
        name: 'Xám',
        code: '#6B7280',
        image: 'https://m.media-amazon.com/images/I/61LlFyN+B3L._AC_SL1200_.jpg',
        sizes: [
          { id: 'size-5', size: 'i5/8GB/512GB', quantity: 7, price: 22990000 },
          { id: 'size-6', size: 'i7/16GB/512GB', quantity: 15, price: 27990000 },
          { id: 'size-7', size: 'i7/16GB/1TB', quantity: 9, price: 29990000 },
          { id: 'size-8', size: 'i9/32GB/1TB', quantity: 6, price: 34990000 },
        ],
      },
    ],
  },
  {
    id: 'prod-2',
    name: 'MacBook Pro M3',
    brand: 'Apple',
    description: 'MacBook Pro M3 14 inch chính hãng',
    colors: [
      {
        id: 'color-3',
        name: 'Bạc',
        code: '#C0C0C0',
        image: 'https://m.media-amazon.com/images/I/51ZqjuoQFWL._AC_SL1200_.jpg',
        sizes: [
          { id: 'size-9', size: 'M3/8GB/256GB', quantity: 4, price: 38990000 },
          { id: 'size-10', size: 'M3/8GB/512GB', quantity: 8, price: 42990000 },
          { id: 'size-11', size: 'M3 Pro/18GB/512GB', quantity: 12, price: 54990000 },
          { id: 'size-12', size: 'M3 Max/36GB/1TB', quantity: 7, price: 69990000 },
        ],
      },
      {
        id: 'color-4',
        name: 'Xám',
        code: '#4B5563',
        image: 'https://m.media-amazon.com/images/I/51ZqjuoQFWL._AC_SL1200_.jpg',
        sizes: [
          { id: 'size-13', size: 'M3/8GB/256GB', quantity: 5, price: 38990000 },
          { id: 'size-14', size: 'M3/8GB/512GB', quantity: 10, price: 42990000 },
          { id: 'size-15', size: 'M3 Pro/18GB/512GB', quantity: 8, price: 54990000 },
          { id: 'size-16', size: 'M3 Max/36GB/1TB', quantity: 6, price: 69990000 },
        ],
      },
    ],
  },
  {
    id: 'prod-3',
    name: 'RTX 4070 Super 12GB',
    brand: 'NVIDIA',
    description: 'Card đồ họa RTX 4070 Super 12GB chính hãng',
    colors: [
      {
        id: 'color-5',
        name: 'Đen',
        code: '#000000',
        image: 'https://m.media-amazon.com/images/I/81PChIf5pwL._AC_SL1500_.jpg',
        sizes: [
          { id: 'size-17', size: '12GB GDDR6X', quantity: 3, price: 17490000 },
          { id: 'size-18', size: '12GB GDDR6X OC', quantity: 5, price: 18990000 },
        ],
      },
    ],
  },
  {
    id: 'prod-4',
    name: 'Dell XPS 15 OLED',
    brand: 'Dell',
    description: 'Laptop Dell XPS 15 OLED chính hãng',
    colors: [
      {
        id: 'color-6',
        name: 'Bạc',
        code: '#E5E7EB',
        image: 'https://m.media-amazon.com/images/I/61XuP8qrI+L._AC_SL1500_.jpg',
        sizes: [
          { id: 'size-21', size: 'i7/16GB/512GB', quantity: 6, price: 28990000 },
          { id: 'size-22', size: 'i7/32GB/1TB', quantity: 8, price: 34990000 },
          { id: 'size-23', size: 'i9/32GB/1TB', quantity: 10, price: 39990000 },
        ],
      },
    ],
  },
  {
    id: 'prod-5',
    name: 'Intel Core i7-13700K',
    brand: 'Intel',
    description: 'CPU Intel Core i7-13700K chính hãng',
    colors: [
      {
        id: 'color-7',
        name: 'Bạc',
        code: '#C0C0C0',
        image: 'https://m.media-amazon.com/images/I/81PChIf5pwL._AC_SL1500_.jpg',
        sizes: [
          { id: 'size-25', size: 'Box', quantity: 9, price: 9990000 },
          { id: 'size-26', size: 'Tray', quantity: 11, price: 8990000 },
        ],
      },
    ],
  },
];

export const coupons = [
  {
    id: 'coupon-1',
    code: 'SUMMER23',
    discount: 15, 
    minOrder: 1000000,
    description: 'Giảm 15% cho đơn hàng từ 1,000,000đ',
  },
  {
    id: 'coupon-2',
    code: 'NEWCUSTOMER',
    discount: 10, 
    minOrder: 500000,
    description: 'Giảm 10% cho đơn hàng từ 500,000đ',
  },
]; 