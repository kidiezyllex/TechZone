import { MenuItem } from '@/interface/types';
import {
  mdiChartBar,
  mdiTagMultiple,
  mdiRestart,
  mdiLaptop,
  mdiDesk,
  mdiOrderBoolDescendingVariant,
  mdiAccount,
  mdiStore,
} from '@mdi/js';

export const menuItems: MenuItem[] = [
  {
    id: 'statistics',
    name: 'Thống kê',
    path: '/admin/statistics',
    icon: mdiChartBar,
  },
  {
    id: 'pos',
    name: 'Bán hàng tại quầy',
    path: '/admin/pos',
    icon: mdiDesk,
  },
  {
    id: 'orders',
    name: 'Quản lý đơn hàng',
    path: '/admin/orders',
    icon: mdiOrderBoolDescendingVariant,
  },
  {
    id: 'products',
    name: 'Quản lý sản phẩm',
    path: '/admin/products',
    icon: mdiLaptop,
    subMenu: [
      {
        id: 'products-list',
        name: 'Sản phẩm',
        path: '/admin/products',
      },
      {
        id: 'products-brands',
        name: 'Thương hiệu',
        path: '/admin/products/brands',
      },
      {
        id: 'products-categories',
        name: 'Danh mục',
        path: '/admin/products/categories',
      },
    ],
  },
  {
    id: 'accounts',
    name: 'Quản lý người dùng',
    path: '/admin/accounts',
    icon: mdiAccount,
  },
  {
    id: 'stores',
    name: 'Quản lý cửa hàng',
    path: '/admin/stores',
    icon: mdiStore,
  }
]; 