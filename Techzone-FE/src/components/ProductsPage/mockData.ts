export interface Brand {
  id: string;
  name: string;
  logo?: string;
}

export interface SoleType {
  id: string;
  name: string;
}

export interface ShoeType {
  id: string;
  name: string;
}

export interface Material {
  id: string;
  name: string;
}

export interface ProductSize {
  size: string;
  quantity: number;
  price: number;
  weight?: number;
}

export interface ProductColor {
  id: string;
  name: string;
  code: string;
  images: string[];
  sizes: ProductSize[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  brandId: string;
  shoeTypeId: string;
  soleTypeId: string;
  materialIds: string[];
  colors: ProductColor[];
  createdAt: string;
  updatedAt: string;
}

export const brands: Brand[] = [
  {
    id: 'brand-1',
    name: 'ASUS',
    logo: 'https://logos-world.net/wp-content/uploads/2020/11/Asus-Logo.png',
  },
  {
    id: 'brand-2',
    name: 'Dell',
    logo: 'https://logos-world.net/wp-content/uploads/2017/07/Dell-Logo.png',
  },
  {
    id: 'brand-3',
    name: 'HP',
    logo: 'https://logos-world.net/wp-content/uploads/2020/06/HP-Logo.png',
  },
  {
    id: 'brand-4',
    name: 'Lenovo',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Lenovo-Logo.png',
  },
  {
    id: 'brand-5',
    name: 'Apple',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png',
  },
];

export const soleTypes: SoleType[] = [
  { id: 'sole-1', name: 'Intel Core i5' },
  { id: 'sole-2', name: 'Intel Core i7' },
  { id: 'sole-3', name: 'Intel Core i9' },
  { id: 'sole-4', name: 'AMD Ryzen 5' },
  { id: 'sole-5', name: 'AMD Ryzen 7' },
];

export const shoeTypes: ShoeType[] = [
  { id: 'type-1', name: 'Laptop Gaming' },
  { id: 'type-2', name: 'Laptop Văn phòng' },
  { id: 'type-3', name: 'Laptop Đồ họa' },
  { id: 'type-4', name: 'Laptop Ultrabook' },
  { id: 'type-5', name: 'Linh kiện PC' },
];

export const materials: Material[] = [
  { id: 'material-1', name: 'Nhôm' },
  { id: 'material-2', name: 'Nhựa cao cấp' },
  { id: 'material-3', name: 'Carbon Fiber' },
  { id: 'material-4', name: 'Magnesium Alloy' },
  { id: 'material-5', name: 'Kim loại' },
  { id: 'material-6', name: 'Polycarbonate' },
  { id: 'material-7', name: 'Titanium' },
  { id: 'material-8', name: 'Glass' },
];

export const products: Product[] = [
  {
    id: 'prod-001',
    name: 'ASUS ROG Strix G15',
    slug: 'asus-rog-strix-g15',
    sku: 'AS-ROG-G15-001',
    description: 'Laptop Gaming ASUS ROG Strix G15 chính hãng với CPU Intel Core i7, card đồ họa RTX 4060. Màn hình 15.6 inch 144Hz, RAM 16GB DDR5, SSD 512GB. Hiệu năng mạnh mẽ cho gaming và đồ họa.',
    brandId: 'brand-1',
    shoeTypeId: 'type-1',
    soleTypeId: 'sole-2',
    materialIds: ['material-1', 'material-2'],
    colors: [
      {
        id: 'color-1',
        name: 'Đen',
        code: '#000000',
        images: [
          'https://m.media-amazon.com/images/I/61LlFyN+B3L._AC_SL1200_.jpg',
          'https://m.media-amazon.com/images/I/61LlFyN+B3L._AC_SL1200_.jpg',
          'https://m.media-amazon.com/images/I/61LlFyN+B3L._AC_SL1200_.jpg',
        ],
        sizes: [
          { size: 'i5/8GB/512GB', quantity: 12, price: 22990000, weight: 2100 },
          { size: 'i7/16GB/512GB', quantity: 8, price: 27990000, weight: 2100 },
          { size: 'i7/16GB/1TB', quantity: 5, price: 29990000, weight: 2100 },
          { size: 'i9/32GB/1TB', quantity: 10, price: 34990000, weight: 2100 },
        ],
      },
      {
        id: 'color-2',
        name: 'Xám',
        code: '#6B7280',
        images: [
          'https://m.media-amazon.com/images/I/61LlFyN+B3L._AC_SL1200_.jpg',
          'https://m.media-amazon.com/images/I/61LlFyN+B3L._AC_SL1200_.jpg',
          'https://m.media-amazon.com/images/I/61LlFyN+B3L._AC_SL1200_.jpg',
        ],
        sizes: [
          { size: 'i5/8GB/512GB', quantity: 7, price: 22990000, weight: 2100 },
          { size: 'i7/16GB/512GB', quantity: 15, price: 27990000, weight: 2100 },
          { size: 'i7/16GB/1TB', quantity: 9, price: 29990000, weight: 2100 },
          { size: 'i9/32GB/1TB', quantity: 6, price: 34990000, weight: 2100 },
        ],
      },
    ],
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2023-05-20T14:45:00Z',
  },
  {
    id: 'prod-002',
    name: 'MacBook Pro M3',
    slug: 'macbook-pro-m3',
    sku: 'AP-MBP-M3-002',
    description: 'MacBook Pro M3 14 inch với chip Apple M3 mạnh mẽ, màn hình Liquid Retina XDR sắc nét. RAM 8GB, SSD 256GB. Hiệu năng vượt trội cho công việc đồ họa và lập trình.',
    brandId: 'brand-5',
    shoeTypeId: 'type-3',
    soleTypeId: 'sole-1',
    materialIds: ['material-1', 'material-8'],
    colors: [
      {
        id: 'color-3',
        name: 'Bạc',
        code: '#C0C0C0',
        images: [
          'https://m.media-amazon.com/images/I/51ZqjuoQFWL._AC_SL1200_.jpg',
          'https://m.media-amazon.com/images/I/51ZqjuoQFWL._AC_SL1200_.jpg',
          'https://m.media-amazon.com/images/I/51ZqjuoQFWL._AC_SL1200_.jpg',
        ],
        sizes: [
          { size: 'M3/8GB/256GB', quantity: 4, price: 38990000, weight: 1600 },
          { size: 'M3/8GB/512GB', quantity: 8, price: 42990000, weight: 1600 },
          { size: 'M3 Pro/18GB/512GB', quantity: 12, price: 54990000, weight: 1600 },
          { size: 'M3 Max/36GB/1TB', quantity: 7, price: 69990000, weight: 1600 },
        ],
      },
      {
        id: 'color-4',
        name: 'Xám',
        code: '#4B5563',
        images: [
          'https://m.media-amazon.com/images/I/51ZqjuoQFWL._AC_SL1200_.jpg',
          'https://m.media-amazon.com/images/I/51ZqjuoQFWL._AC_SL1200_.jpg',
          'https://m.media-amazon.com/images/I/51ZqjuoQFWL._AC_SL1200_.jpg',
        ],
        sizes: [
          { size: 'M3/8GB/256GB', quantity: 5, price: 38990000, weight: 1600 },
          { size: 'M3/8GB/512GB', quantity: 10, price: 42990000, weight: 1600 },
          { size: 'M3 Pro/18GB/512GB', quantity: 8, price: 54990000, weight: 1600 },
          { size: 'M3 Max/36GB/1TB', quantity: 6, price: 69990000, weight: 1600 },
        ],
      },
    ],
    createdAt: '2023-02-10T09:15:00Z',
    updatedAt: '2023-06-05T11:20:00Z',
  },
  {
    id: 'prod-003',
    name: 'RTX 4070 Super 12GB',
    slug: 'rtx-4070-super-12gb',
    sku: 'NV-RTX4070-003',
    description: 'Card đồ họa NVIDIA RTX 4070 Super 12GB với hiệu năng mạnh mẽ cho gaming và render. Hỗ trợ Ray Tracing và DLSS 3.0, làm mát bằng quạt tản nhiệt hiệu quả.',
    brandId: 'brand-1',
    shoeTypeId: 'type-5',
    soleTypeId: 'sole-2',
    materialIds: ['material-5', 'material-2'],
    colors: [
      {
        id: 'color-5',
        name: 'Đen',
        code: '#000000',
        images: [
          'https://m.media-amazon.com/images/I/81PChIf5pwL._AC_SL1500_.jpg',
          'https://m.media-amazon.com/images/I/81PChIf5pwL._AC_SL1500_.jpg',
          'https://m.media-amazon.com/images/I/81PChIf5pwL._AC_SL1500_.jpg',
        ],
        sizes: [
          { size: '12GB GDDR6X', quantity: 3, price: 17490000, weight: 1200 },
          { size: '12GB GDDR6X OC', quantity: 5, price: 18990000, weight: 1200 },
        ],
      },
    ],
    createdAt: '2023-03-05T14:45:00Z',
    updatedAt: '2023-04-18T16:30:00Z',
  },
]; 