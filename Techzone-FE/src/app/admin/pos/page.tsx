'use client';

import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@mdi/react';
import {
  mdiMagnify,
  mdiPlus,
  mdiMinus,
  mdiDelete,
  mdiCashRegister,
  mdiTag,
  mdiCashMultiple,
  mdiInformationOutline,
  mdiReceipt,
  mdiClock,
  mdiAccount,
  mdiContentCopy,
  mdiPrinter,
  mdiChevronLeft,
  mdiPalette,
  mdiCheck,
  mdiRuler,
  mdiCurrencyUsd,
  mdiPackageVariant,
  mdiCartPlus,
  mdiBarcode,
  mdiInvoicePlus,
  mdiClose,
  mdiCart,
  mdiChevronDown,
  mdiViewGridOutline,
  mdiTableLarge,
  mdiEye,
  mdiBankTransfer
} from '@mdi/js';
import { checkImageUrl, cn } from '@/lib/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { useVouchers, useIncrementVoucherUsage } from '@/hooks/voucher';
import { getAllVouchers } from '@/api/voucher';
import { useProducts, useSearchProducts } from '@/hooks/product';
import { usePromotions } from '@/hooks/promotion';
import { applyPromotionsToProducts, filterActivePromotions } from '@/lib/promotions';
import { IProductFilter } from '@/interface/request/product';
import { usePosStore } from '@/stores/posStore';
import { useCreatePOSOrder } from '@/hooks/order';
import { IPOSOrderCreateRequest } from '@/interface/request/order';
import { usePOSCartStore, POSCartItem } from '@/stores/usePOSCartStore';
import { usePendingCartsStore, PendingCart } from '@/stores/usePendingCartsStore';
import { useAccounts } from '@/hooks/account';
import { IAccount } from '@/interface/response/account';
import { getSizeLabel } from '@/utils/sizeMapping';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import VouchersDialog from './components/VouchersDialog';
import InvoiceDialog from './components/InvoiceDialog';


const QRCodeComponent = ({ value, size = 200 }: { value: string; size?: number }) => {
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`;

  return (
    <img
      src={qrCodeUrl}
      alt="QR Code"
      width={size}
      height={size}
      className="border border-gray-200 rounded"
    />
  );
};


const CardSkeleton = () => (
  <div className="bg-white rounded-md border border-border shadow-sm overflow-hidden">
    <Skeleton className="h-48 w-full" />
    <div className="p-4">
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2 mb-2" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-1/3" />
        <div className="flex -space-x-1">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-8 w-full mt-3" />
    </div>
  </div>
);


interface ApiVariant {
  id: string;
  colorId?: { id: string; name: string; code: string; images?: string[] };
  sizeId?: { id: string; name: string; value?: string; };
  price: number;
  stock: number;
  images?: string[];
  sku?: string;
  actualSizeId?: string;
}


interface ApiProduct {
  id: string;
  name: string;
  brand: { id: string; name: string; } | string;
  category: { id: string; name: string; } | string;
  description?: string;
  variants: ApiVariant[];
  status?: string;
  createdAt: string;
}


interface InvoiceShopInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}


interface InvoiceCustomerInfo {
  name: string;
  phone: string;
}


interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
  color: string;
  size: string;
}


interface InvoiceData {
  shopInfo: InvoiceShopInfo;
  customerInfo: InvoiceCustomerInfo;
  orderId: string;
  employee: string;
  createdAt: string;
  items: InvoiceItem[];
  subTotal: number;
  discount: number;
  voucherCode?: string;
  total: number;
  cashReceived: number;
  changeGiven: number;
  paymentMethod: string;
}


const getVariantImageUrl = (variant: any) => {
  if (!variant?.images || !Array.isArray(variant.images) || variant.images.length === 0) {
    return '/images/white-image.png';
  }


  const firstImage = variant.images[0];
  if (typeof firstImage === 'string') {
    return firstImage;
  } else if (typeof firstImage === 'object' && firstImage?.imageUrl) {
    return firstImage.imageUrl;
  } else if (typeof firstImage === 'object' && firstImage?.url) {
    return firstImage.url;
  }

  return '/images/white-image.png';
};


const convertVariantToApiVariant = (variant: any): ApiVariant => {

  if (!variant) {
    return {
      id: '',
      price: 0,
      stock: 0,
      images: []
    };
  }


  let colorData = undefined;
  if (variant.color) {

    colorData = {
      id: variant.color.id?.toString() || '',
      name: variant.color.name || 'N/A',
      code: variant.color.code || '#000000',
      images: variant.color.images || []
    };
  } else if (variant.colorId) {

    if (typeof variant.colorId === 'object') {
      colorData = {
        id: variant.colorId.id?.toString() || '',
        name: variant.colorId.name || 'N/A',
        code: variant.colorId.code || '#000000',
        images: variant.colorId.images || []
      };
    } else {
      colorData = {
        id: variant.colorId.toString(),
        name: 'N/A',
        code: '#000000',
        images: []
      };
    }
  }


  let sizeData = undefined;
  if (variant.size) {

    sizeData = {
      id: variant.size.id?.toString() || '',
      name: variant.size.name || (variant.size.value ? getSizeLabel(Number(variant.size.value)) : 'N/A'),
      value: variant.size.value?.toString()
    };
  } else if (variant.sizeId) {

    if (typeof variant.sizeId === 'object') {
      sizeData = {
        id: variant.sizeId.id?.toString() || '',
        name: variant.sizeId.name || (variant.sizeId.value ? getSizeLabel(Number(variant.sizeId.value)) : 'N/A'),
        value: variant.sizeId.value?.toString()
      };
    } else {
      sizeData = {
        id: variant.sizeId.toString(),
        name: 'N/A',
        value: undefined
      };
    }
  }


  return {
    id: variant.id?.toString() || variant._id?.toString() || '',
    colorId: colorData,
    sizeId: sizeData,
    price: parseFloat(variant.price?.toString() || '0'),
    stock: parseInt(variant.stock?.toString() || '0'),
    images: variant.images?.map((img: any) => typeof img === 'string' ? img : img.imageUrl || img.url) || [],
    sku: variant.sku || '',
    actualSizeId: sizeData?.id || ''
  };
};


const convertProductToApiProduct = (product: any): ApiProduct => {
  if (!product) {
    return {
      id: '',
      name: 'Unknown Product',
      brand: 'Unknown',
      category: 'Unknown',
      variants: [],
      createdAt: new Date().toISOString()
    };
  }

  return {
    id: product.id?.toString() || product._id?.toString() || '',
    name: product.name || 'Unknown Product',
    brand: product.brand || 'Unknown',
    category: product.category || 'Unknown',
    description: product.description,
    variants: product.variants?.map(convertVariantToApiVariant) || [],
    status: product.status,
    createdAt: product.createdAt || new Date().toISOString()
  };
};


export default function POSPage() {

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<ApiProduct | null>(null);
  const [selectedApiVariant, setSelectedApiVariant] = useState<ApiVariant | null>(null);


  const {
    carts: pendingCarts,
    activeCartId,
    createNewCart,
    deleteCart,
    setActiveCart,
    addItemToCart: addItemToPendingCart,
    removeItemFromCart: removeItemFromPendingCart,
    updateItemQuantityInCart: updateItemQuantityInPendingCart,
    clearCartItems: clearPendingCartItems,
    setCartDiscount: setPendingCartDiscount,
    getActiveCart,
  } = usePendingCartsStore();


  const activeCart = getActiveCart();
  const cartItems = activeCart?.items || [];
  const appliedDiscount = activeCart?.appliedDiscount || 0;
  const appliedVoucher = activeCart?.appliedVoucher || null;
  const couponCode = activeCart?.couponCode || '';

  const {
    items: mainCartItems,
    appliedDiscount: mainAppliedDiscount,
    appliedVoucher: mainAppliedVoucher,
    couponCode: mainCouponCode,
    addToCart: addToCartStore,
    removeFromCart: removeFromCartStore,
    updateQuantity: updateQuantityStore,
    clearCart: clearCartStore,
    setDiscount,
    setVoucher,
    setCouponCode,
    calculateSubtotal,
    calculateTotal
  } = usePOSCartStore();

  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [showCheckoutDialog, setShowCheckoutDialog] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>('guest');
  const [checkoutIsLoading, setCheckoutIsLoading] = useState<boolean>(false);
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState<boolean>(false);
  const [transferPaymentCompleted, setTransferPaymentCompleted] = useState<boolean>(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 6 });
  const [filters, setFilters] = useState<IProductFilter>({ status: 'ACTIVE' });
  const [sortOption, setSortOption] = useState<string>('newest');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeCategoryName, setActiveCategoryName] = useState<string>('Tất cả sản phẩm');
  const [showVouchersDialog, setShowVouchersDialog] = useState<boolean>(false);

  const [cashReceived, setCashReceived] = useState<number | string>('');
  const [showInvoiceDialog, setShowInvoiceDialog] = useState<boolean>(false);
  const [currentInvoiceData, setCurrentInvoiceData] = useState<InvoiceData | null>(null);
  const [showDeleteCartDialog, setShowDeleteCartDialog] = useState<boolean>(false);
  const [cartToDelete, setCartToDelete] = useState<string | null>(null);
  const [showCartItemsDialog, setShowCartItemsDialog] = useState<boolean>(false);
  const [selectedCartForView, setSelectedCartForView] = useState<string | null>(null);

  const stats = usePosStore((state) => state.stats);
  const updateStatsOnCheckout = usePosStore((state) => state.updateStatsOnCheckout);
  const createOrderMutation = useCreatePOSOrder();

  const [recentTransactions, setRecentTransactions] = useState([
    { id: 'TX-1234', customer: 'Nguyễn Văn A', amount: 1250000, time: '10:25', status: 'completed' },
    { id: 'TX-1233', customer: 'Trần Thị B', amount: 850000, time: '09:40', status: 'completed' },
    { id: 'TX-1232', customer: 'Lê Văn C', amount: 2100000, time: '09:15', status: 'pending' }
  ]);

  const { mutate: incrementVoucherUsageMutation } = useIncrementVoucherUsage();

  const accountsParams = useMemo(() => ({
    role: 'CUSTOMER' as const,
    status: 'ACTIVE' as const,
    limit: 100
  }), []);

  const { data: usersData, isLoading: isLoadingUsers } = useAccounts(accountsParams);


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsSearching(searchQuery.trim().length > 0);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);


  useEffect(() => {
    setFilters(prevFilters => {
      const isAllProducts = activeCategoryName === 'Tất cả sản phẩm';

      if (isAllProducts) {

        const { categories, ...restFilters } = prevFilters;
        return categories ? restFilters : prevFilters;
      } else {

        const newCategories = [activeCategoryName];
        if (prevFilters.categories?.[0] === activeCategoryName) {
          return prevFilters;
        }
        return { ...prevFilters, categories: newCategories };
      }
    });


    setPagination(prev => ({ ...prev, page: 1 }));
  }, [activeCategoryName]);


  const productsHookParams: IProductFilter = useMemo(() => ({
    ...pagination,
    ...filters,
  }), [pagination.page, pagination.limit, filters.status, filters.categories]);

  const productsQuery = useProducts(productsHookParams);


  const searchQueryParams = useMemo(() => {
    if (!isSearching) return { keyword: '' };
    return {
      keyword: searchQuery,
      status: 'ACTIVE' as const,
      page: pagination.page,
      limit: pagination.limit,
      ...(filters.categories && { categories: filters.categories })
    };
  }, [isSearching, searchQuery, pagination.page, pagination.limit, filters.categories]);

  const searchQueryHook = useSearchProducts(searchQueryParams);

  const {
    data: rawData,
    isLoading: apiIsLoading,
    isError: apiIsError,
  } = isSearching ? searchQueryHook : productsQuery;


  const promotionsParams = useMemo(() => ({ status: 'ACTIVE' as const }), []);
  const { data: promotionsData } = usePromotions(promotionsParams);

  const dataWithPromotions = useMemo(() => {
    if (!rawData?.data?.products) return rawData;

    let products = rawData.data.products;

    if (promotionsData?.data?.promotions?.length > 0) {
      const activePromotions = filterActivePromotions(promotionsData.data.promotions);
      products = applyPromotionsToProducts([...products], activePromotions);
    }

    return {
      ...rawData,
      data: {
        ...rawData.data,
        products,
      },
    };
  }, [rawData?.data?.products, promotionsData?.data?.promotions]);


  const processedProducts = useMemo(() => {
    const products = dataWithPromotions?.data?.products;
    if (!products?.length) return [];


    if (sortOption === 'default' || sortOption === 'newest') {
      return products;
    }


    return [...products].sort((a, b) => {
      const priceA = (a as any).hasDiscount ? (a as any).discountedPrice : (a.variants[0]?.price || 0);
      const priceB = (b as any).hasDiscount ? (b as any).discountedPrice : (b.variants[0]?.price || 0);

      switch (sortOption) {
        case 'price-asc':
          return priceA - priceB;
        case 'price-desc':
          return priceB - priceA;
        default:
          return 0;
      }
    });
  }, [dataWithPromotions?.data?.products, sortOption]);


  const dynamicCategories = useMemo(() => {
    const baseCategories = [{ id: 'all', name: 'Tất cả sản phẩm' }];
    const products = dataWithPromotions?.data?.products;

    if (!products?.length) return baseCategories;

    const uniqueCatObjects = new Map<string, { id: string; name: string }>();

    for (const product of products) {
      if (product.category && typeof product.category === 'object' && (product.category as any).id && product.category.name) {
        if (!uniqueCatObjects.has((product.category as any).id)) {
          uniqueCatObjects.set((product.category as any).id, { id: (product.category as any).id, name: product.category.name });
        }
      } else if (typeof product.category === 'string' && !uniqueCatObjects.has(product.category)) {
        uniqueCatObjects.set(product.category, { id: product.category, name: product.category });
      }
    }

    return [...baseCategories, ...Array.from(uniqueCatObjects.values())];
  }, [dataWithPromotions?.data?.products?.length]);


  const handleProductSelect = (product: any) => {

    const productWithPromotion = { ...product };


    const convertedProduct = convertProductToApiProduct(product);


    if ((product as any).hasDiscount) {
      (convertedProduct as any).hasDiscount = (product as any).hasDiscount;
      (convertedProduct as any).discountedPrice = (product as any).discountedPrice;
      (convertedProduct as any).originalPrice = (product as any).originalPrice;
      (convertedProduct as any).discountPercent = (product as any).discountPercent;
      (convertedProduct as any).appliedPromotion = (product as any).appliedPromotion;
    }

    setSelectedProduct(convertedProduct);

    if (convertedProduct.variants && convertedProduct.variants.length > 0) {

      const variantWithStock = convertedProduct.variants.find(v => v.stock > 0);
      const selectedVariant = variantWithStock || convertedProduct.variants[0];
      setSelectedApiVariant(selectedVariant);

      if (!variantWithStock) {
        toast.warn('Sản phẩm này hiện tại đã hết hàng.');
      }
    } else {
      setSelectedApiVariant(null);
      toast.warn('Sản phẩm này không có biến thể.');
    }
  };


  const handleColorSelectFromDetail = (colorId: string) => {
    if (!selectedProduct) return;


    const variantsWithThisColor = selectedProduct.variants.filter(v => v.colorId?.id === colorId);
    if (variantsWithThisColor.length === 0) return;


    const variantWithStock = variantsWithThisColor.find(v => v.stock > 0);
    if (variantWithStock) {
      setSelectedApiVariant(variantWithStock);
    } else {

      setSelectedApiVariant(variantsWithThisColor[0]);
      toast.warn("Màu này đã hết hàng.");
    }
  };


  const handleSizeSelectFromDetail = (sizeId: string) => {
    if (!selectedProduct || !selectedApiVariant?.colorId) return;


    const variantWithThisSizeAndColor = selectedProduct.variants.find(v =>
      v.colorId?.id === selectedApiVariant.colorId?.id && v.sizeId?.id === sizeId
    );

    if (variantWithThisSizeAndColor) {
      setSelectedApiVariant(variantWithThisSizeAndColor);
      if (variantWithThisSizeAndColor.stock === 0) {
        toast.warn("Kích thước này với màu đã chọn đã hết hàng.");
      }
    }
  };


  const addItemToCorrectCart = (product: any, variant: any, isAlreadyConverted = false) => {

    const convertedProduct = isAlreadyConverted ? product : convertProductToApiProduct(product);
    const convertedVariant = isAlreadyConverted ? variant : convertVariantToApiVariant(variant);


    const cartItemId = `${convertedProduct.id}-${convertedVariant.id}`;


    let finalPrice = convertedVariant.price;
    let originalPrice = undefined;
    let discountPercent = undefined;
    let hasDiscount = false;


    if ((product as any).hasDiscount) {

      finalPrice = (product as any).discountedPrice;
      originalPrice = (product as any).originalPrice;
      discountPercent = (product as any).discountPercent;
      hasDiscount = true;
    } else if (promotionsData?.data?.promotions?.length > 0) {

      const activePromotions = filterActivePromotions(promotionsData.data.promotions);
      const productWithPromotions = applyPromotionsToProducts([convertedProduct], activePromotions);
      const promotedProduct = productWithPromotions[0];

      if (promotedProduct?.hasDiscount) {
        finalPrice = promotedProduct.discountedPrice;
        originalPrice = promotedProduct.originalPrice;
        discountPercent = promotedProduct.discountPercent;
        hasDiscount = true;
      }
    }


    const newItem: POSCartItem = {
      id: cartItemId,
      productId: convertedProduct.id,
      variantId: convertedVariant.id,
      name: convertedProduct.name,
      colorName: convertedVariant.colorId?.name || 'N/A',
      colorCode: convertedVariant.colorId?.code || '#000000',
      sizeName: convertedVariant.sizeId?.name || 'N/A',
      price: finalPrice,
      originalPrice: originalPrice,
      discountPercent: discountPercent,
      hasDiscount: hasDiscount,
      quantity: 1,
      image: getVariantImageUrl(convertedVariant) || '/placeholder.svg',
      stock: convertedVariant.stock,
      actualColorId: convertedVariant.colorId?.id || '',
      actualSizeId: convertedVariant.sizeId?.id || '',
    };

    if (activeCartId) {

      const existingItem = cartItems.find(item => item.id === cartItemId);
      const activeCartName = pendingCarts.find(cart => cart.id === activeCartId)?.name || 'Giỏ hàng';

      if (existingItem) {

        if (existingItem.quantity < convertedVariant.stock) {
          updateItemQuantityInPendingCart(activeCartId, cartItemId, 1);
          toast.success(`Đã cập nhật số lượng sản phẩm trong ${activeCartName}.`);
        } else {
          toast.warn('Số lượng sản phẩm trong kho không đủ.');
        }
      } else {

        addItemToPendingCart(activeCartId, newItem);
        toast.success(`Đã thêm sản phẩm vào ${activeCartName}`);
      }
    } else {

      const existingItem = mainCartItems.find(item => item.id === cartItemId);
      if (existingItem) {
        if (existingItem.quantity < convertedVariant.stock) {
          updateQuantityStore(cartItemId, 1);
          toast.success('Đã cập nhật số lượng sản phẩm.');
        } else {
          toast.warn('Số lượng sản phẩm trong kho không đủ.');
        }
      } else {
        addToCartStore(newItem);
        toast.success('Đã thêm sản phẩm vào giỏ hàng');
      }
    }
  };


  const addToCart = () => {
    if (!selectedProduct || !selectedApiVariant) {
      toast.error('Vui lòng chọn sản phẩm và biến thể.');
      return;
    }

    if (selectedApiVariant.stock <= 0) {
      toast.error('Sản phẩm đã hết hàng.');
      return;
    }

    addItemToCorrectCart(selectedProduct, selectedApiVariant, true);
  };


  const updateCartItemQuantity = (id: string, amount: number) => {
    const item = cartItems.find(item => item.id === id);
    if (!item) return;

    const variant = selectedProduct?.variants.find(v =>
      `${selectedProduct.id}-${v.id}` === id
    );

    if (!variant) return;

    const newQuantity = item.quantity + amount;

    if (newQuantity <= 0) {
      removeCartItem(id);
      return;
    }

    if (newQuantity > variant.stock) {
      toast.error('Số lượng vượt quá hàng tồn kho.');
      return;
    }

    if (activeCartId) {
      updateItemQuantityInPendingCart(activeCartId, id, amount);
    } else {
      updateQuantityStore(id, amount);
    }
  };


  const removeCartItem = (id: string) => {
    if (activeCartId) {
      removeItemFromPendingCart(activeCartId, id);
      const cartName = pendingCarts.find(cart => cart.id === activeCartId)?.name || 'Giỏ hàng';
      toast.success(`Đã xóa sản phẩm khỏi ${cartName}`);
    } else {
      removeFromCartStore(id);
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    }
  };


  const removeItemFromSpecificCart = (cartId: string, itemId: string) => {
    removeItemFromPendingCart(cartId, itemId);
    const cartName = pendingCarts.find(cart => cart.id === cartId)?.name || 'Giỏ hàng';
    toast.success(`Đã xóa sản phẩm khỏi ${cartName}`);
  };


  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Vui lòng nhập mã giảm giá');
      return;
    }

    try {
      const response = await getAllVouchers({ status: 'ACTIVE' });
      const vouchers = response.data.vouchers;

      const validVoucher = vouchers.find(v =>
        v.code === couponCode &&
        v.status === 'ACTIVE' &&
        new Date(v.startDate) <= new Date() &&
        new Date(v.endDate) >= new Date() &&
        v.quantity > v.usedCount
      );

      if (!validVoucher) {
        toast.error('Mã giảm giá không hợp lệ hoặc đã hết hạn');
        return;
      }


      if (activeCartId) {
        const cart = pendingCarts.find(c => c.id === activeCartId);
        if (cart) {
          const cartName = cart.name || 'Giỏ hàng';
          setPendingCartDiscount(activeCartId, validVoucher.discountValue);
          toast.success(`Đã áp dụng mã giảm giá cho ${cartName}`);
        }
      } else {
        setVoucher(validVoucher);
        toast.success('Đã áp dụng mã giảm giá');
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error('Có lỗi xảy ra khi áp dụng mã giảm giá');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateTimeForInvoice = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const handleCheckout = async () => {

    if (cartItems.length === 0) {
      toast.error('Giỏ hàng đang trống');
      return;
    }


    const totalAmount = calculateCartTotal();
    const cashReceivedNum = parseFloat(cashReceived.toString());


    if (paymentMethod === 'cash' && (isNaN(cashReceivedNum) || cashReceivedNum < totalAmount)) {
      toast.error('Số tiền khách đưa không đủ hoặc không hợp lệ.');
      return;
    }


    setCheckoutIsLoading(true);


    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const generatedOrderId = `POS${hours}${minutes}${seconds}`;


    const orderPayload: IPOSOrderCreateRequest = {
      orderId: generatedOrderId,
      customer: customerName || 'Khách tại quầy',
      items: cartItems.map(item => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
        variant: {
          colorId: item.actualColorId || '',
          sizeId: item.actualSizeId || '',
        }
      })),
      subTotal: calculateCartSubtotal(),
      total: totalAmount,
      shippingAddress: {
        name: customerName || 'Khách vãng lai',
        phoneNumber: customerPhone || 'N/A',
        provinceId: 'N/A',
        districtId: 'N/A',
        wardId: 'N/A',
        specificAddress: 'Tại quầy'
      },
      paymentMethod: paymentMethod === 'cash' ? 'CASH' : 'BANK_TRANSFER',
      orderStatus: "HOAN_THANH",
      discount: appliedDiscount,
      voucher: appliedVoucher?.id || '',
    };

    try {

      const orderResponse = await createOrderMutation.mutateAsync(orderPayload);

      if (orderResponse.success && orderResponse.data) {

        const orderCode = orderResponse.data.orderNumber || `POS-${Math.floor(1000 + Math.random() * 9000)}`;


        updateStatsOnCheckout(totalAmount);


        const newTransaction = {
          id: orderCode,
          customer: customerName || 'Khách vãng lai',
          amount: totalAmount,
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          status: 'completed'
        };
        setRecentTransactions([newTransaction, ...recentTransactions.slice(0, 2)]);


        toast.success(`Đã tạo đơn hàng ${orderCode} và thanh toán thành công!`);


        if (appliedVoucher) {
          incrementVoucherUsageMutation(
            appliedVoucher.id,
            {
              onSuccess: () => {
                toast.info(`Đã cập nhật lượt sử dụng cho mã giảm giá "${appliedVoucher.code}".`);
              },
              onError: (error: Error) => {
                toast.error(`Lỗi khi cập nhật mã giảm giá: ${error.message}`);
              },
            }
          );
        }


        const currentChangeDue = paymentMethod === 'cash' && !isNaN(cashReceivedNum) && cashReceivedNum >= totalAmount ? cashReceivedNum - totalAmount : 0;


        const invoiceData: InvoiceData = {
          shopInfo: {
            name: 'TechZone',
            address: 'Địa chỉ shop: 20 Hồ Tùng Mậu, Cầu Giấy, Hà Nội',
            phone: '0123 456 789',
            email: 'info@TechZone.com'
          },
          customerInfo: {
            name: customerName || 'Khách vãng lai',
            phone: customerPhone || 'N/A',
          },
          orderId: orderCode,
          employee: 'Nhân viên Bán Hàng',
          createdAt: new Date().toISOString(),
          items: cartItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
            color: item.colorName,
            size: item.sizeName,
          })),
          subTotal: calculateCartSubtotal(),
          discount: appliedDiscount,
          voucherCode: appliedVoucher?.code,
          total: totalAmount,
          cashReceived: paymentMethod === 'cash' ? cashReceivedNum : totalAmount,
          changeGiven: currentChangeDue,
          paymentMethod: paymentMethod === 'cash' ? 'Tiền mặt' : 'Chuyển khoản',
        };


        setCurrentInvoiceData(invoiceData);
        setShowInvoiceDialog(true);


        clearCartStore();
        if (activeCartId) {
          clearPendingCartItems(activeCartId);
        }
        setCustomerName('');
        setCustomerPhone('');
        setSelectedUserId('guest');
        setPaymentMethod('cash');
        setCashReceived('');
        setTransferPaymentCompleted(false);
        setShowCheckoutDialog(false);

      } else {

        toast.error((orderResponse as any).message || 'Không thể tạo đơn hàng. Vui lòng thử lại.');
      }
    } catch (error: any) {

      toast.error(error.response?.data?.message || error.message || 'Có lỗi xảy ra trong quá trình thanh toán.');
    } finally {

      setCheckoutIsLoading(false);
    }
  };

  const handleProceedToCheckout = () => {
    const itemsToCheck = activeCart?.items || mainCartItems;
    if (itemsToCheck.length === 0) {
      toast.error('Giỏ hàng đang trống');
      return;
    }
    syncActiveCartToMainCart();
    setCashReceived('');
    setSelectedUserId('guest');
    setCustomerName('');
    setCustomerPhone('');
    setTransferPaymentCompleted(false);
    setShowCheckoutDialog(true);
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    if (userId && userId !== 'guest' && userId !== 'loading' && userId !== 'no-customers' && usersData?.data?.accounts) {
      const selectedUser = usersData.data.accounts.find((user: IAccount) => user.id === userId);
      if (selectedUser) {
        setCustomerName(selectedUser.fullName);
        setCustomerPhone(selectedUser.phoneNumber || '');
      }
    } else {
      setCustomerName('');
      setCustomerPhone('');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'p') {
        handleProceedToCheckout();
      }

      if (e.altKey && e.key === 'c') {
        if (cartItems.length > 0 || appliedVoucher) {
          clearCartStore();
          if (activeCartId) {
            clearPendingCartItems(activeCartId);
          }
          setSelectedProduct(null);
          setSelectedApiVariant(null);
          toast.success('Đã xóa giỏ hàng và mã giảm giá.');
        }
      }

      if (e.altKey && e.key === 's') {
        const searchInput = document.getElementById('product-search');
        if (searchInput) {
          e.preventDefault();
          searchInput.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cartItems, appliedVoucher, handleProceedToCheckout]);


  const uniqueColorsForSelectedProduct = useMemo(() => {
    if (!selectedProduct?.variants?.length) return [];
    const colorMap = new Map<string, ApiVariant['colorId']>();

    for (const variant of selectedProduct.variants) {
      if (variant.colorId?.id && !colorMap.has(variant.colorId.id)) {
        colorMap.set(variant.colorId.id, variant.colorId);
      }
    }

    return Array.from(colorMap.values()).filter(Boolean) as NonNullable<ApiVariant['colorId']>[];
  }, [selectedProduct?.id, selectedProduct?.variants?.length]);

  const availableSizesForSelectedColor = useMemo(() => {
    if (!selectedProduct?.variants?.length || !selectedApiVariant?.colorId?.id) return [];
    const sizeMap = new Map<string, ApiVariant['sizeId']>();

    for (const variant of selectedProduct.variants) {
      if (variant.colorId?.id === selectedApiVariant.colorId.id &&
        variant.sizeId?.id &&
        !sizeMap.has(variant.sizeId.id)) {
        sizeMap.set(variant.sizeId.id, variant.sizeId);
      }
    }

    return Array.from(sizeMap.values()).filter(Boolean) as NonNullable<ApiVariant['sizeId']>[];
  }, [selectedProduct?.id, selectedApiVariant?.colorId?.id]);


  const cartCalculations = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = Math.max(0, subtotal - appliedDiscount);
    return { subtotal, total };
  }, [cartItems, appliedDiscount]);


  const calculateCartSubtotal = () => cartCalculations.subtotal;
  const calculateCartTotal = () => cartCalculations.total;

  const totalAmount = cartCalculations.total;
  const cashReceivedNum = parseFloat(cashReceived.toString());


  const changeDue = useMemo(() => {
    if (paymentMethod !== 'cash' || !cashReceived) return 0;
    const cashReceivedNum = parseFloat(cashReceived.toString());
    return !isNaN(cashReceivedNum) && cashReceivedNum >= totalAmount ? cashReceivedNum - totalAmount : 0;
  }, [paymentMethod, cashReceived, totalAmount]);


  const getBrandName = useCallback((brand: ApiProduct['brand']) =>
    typeof brand === 'object' ? brand.name : brand, []
  );


  const getColorInfo = useCallback((colorId: any) => {
    if (!colorId) return null;
    if (typeof colorId === 'object' && colorId.id) {
      return colorId;
    }
    return null;
  }, []);


  const getUniqueColors = useCallback((variants: any[]) => {
    if (!variants?.length) return [];
    const colorMap = new Map();

    variants.forEach((v, index) => {
      const colorInfo = getColorInfo(v.colorId);
      if (colorInfo) {
        colorMap.set(colorInfo.id, colorInfo);
      }
    });

    return Array.from(colorMap.values());
  }, [getColorInfo]);


  const handleCreateNewCart = () => {
    const newCartId = createNewCart();
    if (!newCartId) {
      toast.warn('Không thể tạo thêm giỏ hàng. Tối đa 5 Hoá đơn chờ!');
      return;
    }
    toast.success(`Đã tạo giỏ hàng mới: Giỏ hàng ${pendingCarts.length + 1}`);
  };


  const handleDeleteCart = (cartId: string) => {
    setCartToDelete(cartId);
    setShowDeleteCartDialog(true);
  };


  const confirmDeleteCart = () => {
    if (cartToDelete) {
      const cartToDeleteData = pendingCarts.find(cart => cart.id === cartToDelete);
      if (cartToDeleteData) {
        deleteCart(cartToDelete);
        toast.success(`Đã xóa ${cartToDeleteData.name}`);
      }
      setCartToDelete(null);
      setShowDeleteCartDialog(false);
    }
  };


  const cancelDeleteCart = () => {
    setCartToDelete(null);
    setShowDeleteCartDialog(false);
  };


  const handleSwitchCart = (cartId: string) => {
    setActiveCart(cartId);
    const cart = pendingCarts.find(c => c.id === cartId);
    if (cart) {
      toast.info(`Đã chuyển sang ${cart.name}`);
    }
  };


  const syncActiveCartToMainCart = () => {
    if (activeCart) {

      clearCartStore();


      activeCart.items.forEach(item => {
        addToCartStore(item);
      });


      setDiscount(activeCart.appliedDiscount);
      setVoucher(activeCart.appliedVoucher);
      setCouponCode(activeCart.couponCode);
    }
  };


  const handleViewCartItems = (cartId: string) => {
    setSelectedCartForView(cartId);
    setShowCartItemsDialog(true);
  };


  const closeCartItemsDialog = () => {
    setShowCartItemsDialog(false);
    setSelectedCartForView(null);
  };


  return (
    <div className="h-full">

      <div className="mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/statistics">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Bán hàng tại quầy</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>


      <div className='bg-white rounded-md p-4 mb-4 shadow-sm border border-border'>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-maintext flex items-center gap-2">
            <Icon path={mdiCart} size={1} className="text-primary" />
            Hoá đơn chờ ({pendingCarts.length}/5)
          </h3>
          <Button
            onClick={handleCreateNewCart}
            disabled={pendingCarts.length >= 5}
          >
            <Icon path={mdiInvoicePlus} size={0.7} />
            Thêm mới
          </Button>
        </div>


        {pendingCarts.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {pendingCarts.slice(0, 5).map((cart, index) => (
              <motion.button
                key={cart.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn(
                  'relative flex items-center gap-2 p-2 rounded-sm border-2 transition-all duration-200 min-w-[140px] group',
                  activeCartId === cart.id
                    ? 'border-primary bg-primary/5 text-primary shadow-md'
                    : 'border-border bg-white text-maintext hover:border-primary/50 hover:bg-primary/5'
                )}
                onClick={() => handleSwitchCart(cart.id)}
              >

                <div className="flex items-center gap-1 flex-1">
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    cart.items.length > 0 ? 'bg-green-500' : 'bg-gray-300'
                  )} />
                  <span className="text-sm font-medium truncate">
                    {cart.name} <span className="text-sm text-maintext/70 font-semibold">
                      ({cart.items.reduce((sum, item) => sum + item.quantity, 0)})
                    </span>
                  </span>
                </div>

                <button
                  className="opacity-0 group-hover:opacity-100 transition-opacity border border-red-500/70 p-1 hover:bg-red-400 bg-red-400 rounded-full hover:!text-white text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCart(cart.id);
                  }}
                >
                  <Icon path={mdiClose} size={0.7} className="hover:!text-white" />
                </button>
              </motion.button>
            ))}


            {pendingCarts.length > 5 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="min-w-[100px] h-[46px] border-2 border-primary/50 flex items-center justify-center text-sm">
                    +{pendingCarts.length - 4} khác
                    <Icon path={mdiChevronDown} size={0.7} className="ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {pendingCarts.slice(4).map((cart) => (
                    <DropdownMenuItem
                      key={cart.id}
                      className="flex items-center justify-between"
                      onClick={() => handleSwitchCart(cart.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          'w-2 h-2 rounded-full',
                          cart.items.length > 0 ? 'bg-green-500' : 'bg-gray-300'
                        )} />
                        <span>{cart.name}</span>
                        {cart.items.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                          </Badge>
                        )}
                      </div>
                      <button
                        className="p-1 hover:bg-red-100 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCart(cart.id);
                        }}
                      >
                        <Icon path={mdiClose} size={0.4} className="text-red-500" />
                      </button>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <div className="lg:col-span-2 overflow-hidden flex flex-col">

          <div className="bg-white rounded-md p-4 mb-4 shadow-sm border border-border hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Icon path={mdiMagnify} size={1} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-maintext" />
                <Input
                  id="product-search"
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>


            <div className="flex overflow-x-auto pb-2 scrollbar-thin gap-2">
              {dynamicCategories.map((category) => (
                <button
                  key={category.id}
                  className={cn(
                    'whitespace-nowrap px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                    activeCategoryName === category.name
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-gray-50 text-maintext hover:bg-gray-100 hover:text-primary'
                  )}
                  onClick={() => {
                    setActiveCategoryName(category.name);
                    setSelectedProduct(null);
                    setSelectedApiVariant(null);
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>


          <div className="bg-white rounded-xl p-4 flex-1 shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300 min-h-[400px]">

            {selectedProduct && <div className='w-full flex items-center justify-between mb-4'>
              <motion.button
                className="text-sm text-primary font-medium flex items-center gap-2 hover:text-primary/80 transition-colors bg-primary/5 px-4 py-2 rounded-full border border-primary/50"
                onClick={() => {
                  setSelectedProduct(null);
                  setSelectedApiVariant(null);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon path={mdiChevronLeft} size={0.7} />
                Quay lại danh sách sản phẩm
              </motion.button>
            </div>}


            {selectedProduct && selectedApiVariant ? (

              <div className="mb-4">
                <div className="flex flex-col lg:flex-row gap-8">
                  <motion.div
                    className="lg:w-1/2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white border group">
                      <img
                        src={checkImageUrl(getVariantImageUrl(selectedApiVariant) || getVariantImageUrl(selectedProduct.variants[0]))}
                        alt={selectedProduct.name}
                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                    </div>
                    {selectedApiVariant && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          className='w-full mt-4'
                          onClick={addToCart}
                          disabled={selectedApiVariant.stock === 0}
                        >
                          <Icon path={mdiCartPlus} size={0.7} />
                          Thêm vào giỏ hàng POS
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>


                  <motion.div
                    className="lg:w-1/2 space-y-8"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >

                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                          {getBrandName(selectedProduct.brand)}
                        </Badge>
                        <Badge variant="outline" className="text-maintext">
                          Admin POS
                        </Badge>
                        {(selectedProduct as any).hasDiscount && (
                          <Badge variant="destructive" className="bg-green-500">
                            -{(selectedProduct as any).discountPercent}% OFF
                          </Badge>
                        )}
                      </div>

                      <h2 className="text-2xl font-bold text-maintext leading-tight">
                        {selectedProduct.name}
                      </h2>

                      {(selectedProduct as any).hasDiscount && (selectedProduct as any).appliedPromotion && (
                        <div className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                          🎉 Đang áp dụng khuyến mãi: <span className="font-semibold">{(selectedProduct as any).appliedPromotion.name}</span>
                        </div>
                      )}

                      <motion.div
                        className="space-y-2"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="text-4xl font-bold text-primary">
                          {formatCurrency((selectedProduct as any).hasDiscount ? (selectedProduct as any).discountedPrice : selectedApiVariant.price)}
                        </div>
                        {(selectedProduct as any).hasDiscount && (
                          <div className="flex items-center gap-2">
                            <span className="text-xl text-maintext line-through">
                              {formatCurrency((selectedProduct as any).originalPrice)}
                            </span>
                            <Badge variant="destructive" className="bg-green-500">
                              -{(selectedProduct as any).discountPercent}% OFF
                            </Badge>
                          </div>
                        )}
                      </motion.div>
                    </div>

                    {uniqueColorsForSelectedProduct.length > 0 && (
                      <motion.div
                        className="mt-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <Icon path={mdiPalette} size={1} className="text-primary" />
                          <h3 className="text-base font-semibold text-maintext">Màu sắc</h3>
                          {selectedApiVariant?.colorId && (
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                              {selectedApiVariant.colorId.name}
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-4 flex-wrap">
                          {uniqueColorsForSelectedProduct.map((color) => (
                            <motion.button
                              key={color.id}
                              className={cn(
                                'relative group flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 border-2',
                                selectedApiVariant?.colorId?.id === color.id
                                  ? 'border-primary ring-4 ring-primary/20 scale-110'
                                  : 'border-gray-200 hover:border-gray-300 hover:scale-105'
                              )}
                              style={{ backgroundColor: color.code }}
                              onClick={() => handleColorSelectFromDetail(color.id)}
                              title={color.name}
                              whileHover={{ scale: selectedApiVariant?.colorId?.id === color.id ? 1.1 : 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {selectedApiVariant?.colorId?.id === color.id && (
                                <Icon
                                  path={mdiCheck}
                                  size={1}
                                  className="text-white drop-shadow-lg"
                                />
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {availableSizesForSelectedColor.length > 0 && selectedApiVariant?.colorId && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Icon path={mdiRuler} size={1} className="text-primary" />
                          <h3 className="text-base font-semibold text-maintext">Kích thước</h3>
                          {selectedApiVariant?.sizeId && (
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                              {selectedApiVariant.sizeId.name || (selectedApiVariant.sizeId.value ? getSizeLabel(Number(selectedApiVariant.sizeId.value)) : 'N/A')}
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-4">
                          {availableSizesForSelectedColor.map((size) => {
                            const variantForThisSize = selectedProduct.variants.find(v => v.colorId?.id === selectedApiVariant.colorId?.id && v.sizeId?.id === size.id);
                            const stockForThisSize = variantForThisSize?.stock || 0;
                            const isSelected = selectedApiVariant?.sizeId?.id === size.id;
                            return (
                              <Button
                                key={size.id}
                                variant={isSelected ? "outline" : "ghost"}
                                className={cn(
                                  'transition-all duration-300 min-w-[60px] h-auto py-2 px-4 flex flex-col items-center border-2',
                                  stockForThisSize === 0 && 'opacity-50 cursor-not-allowed'
                                )}
                                onClick={() => handleSizeSelectFromDetail(size.id)}
                                disabled={stockForThisSize === 0}
                              >
                                <span className="font-medium">
                                  {size.name || (size.value ? getSizeLabel(Number(size.value)) : 'N/A')}
                                </span>
                                <span className={cn(
                                  'text-xs mt-1',
                                  stockForThisSize === 0 ? 'text-red-500' : 'text-gray-500'
                                )}>
                                  {stockForThisSize === 0 ? 'Hết hàng' : `Kho: ${stockForThisSize}`}
                                </span>
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Icon path={mdiPackageVariant} size={1} className="text-primary" />
                      <h3 className="text-base font-semibold text-maintext">Tồn kho</h3>
                      <Badge
                        variant={selectedApiVariant.stock > 10 ? "secondary" : selectedApiVariant.stock > 0 ? "outline" : "destructive"}
                        className={cn(
                          selectedApiVariant.stock > 10 ? "bg-green-100 text-green-700 border-green-200" :
                            selectedApiVariant.stock > 0 ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
                              "bg-red-100 text-red-700 border-red-200"
                        )}
                      >
                        {selectedApiVariant.stock > 0 ? `${selectedApiVariant.stock} sản phẩm` : 'Hết hàng'}
                      </Badge>
                    </div>
                  </motion.div>
                </div>
              </div>
            ) : (

              <Tabs defaultValue="grid" className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="grid" className="flex items-center gap-1 text-maintext/70">
                      <Icon path={mdiViewGridOutline} size={0.8} />
                      Lưới
                    </TabsTrigger>
                    <TabsTrigger value="table" className="flex items-center gap-1 text-maintext/70">
                      <Icon path={mdiTableLarge} size={0.8} />
                      Bảng
                    </TabsTrigger>
                  </TabsList>

                  <div className="text-sm text-maintext">
                    Hiển thị {apiIsLoading ? <Skeleton className="h-4 w-5 inline-block" /> : processedProducts.length} / {rawData?.data?.pagination?.totalItems || 0} sản phẩm
                  </div>
                </div>

                {apiIsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[...Array(pagination.limit)].map((_, index) => (
                      <CardSkeleton key={index} />
                    ))}
                  </div>
                ) : apiIsError ? (
                  <div className="text-center py-10 text-red-500">Lỗi khi tải sản phẩm. Vui lòng thử lại.</div>
                ) : processedProducts.length === 0 ? (
                  <div className="text-center py-10 text-maintext">Không tìm thấy sản phẩm nào.</div>
                ) : (
                  <>
                    <TabsContent value="grid" className="mt-0">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {processedProducts.map((product) => {
                          const firstVariant = product.variants?.[0];
                          const uniqueColors = getUniqueColors(product.variants);
                          return (
                            <motion.div
                              key={product.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className="bg-white rounded-md border border-border shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group"
                            >
                              <div
                                className="relative h-48 w-full bg-gray-50 overflow-hidden cursor-pointer"
                                onClick={() => handleProductSelect(product)}
                              >
                                <img
                                  src={checkImageUrl(getVariantImageUrl(firstVariant))}
                                  alt={product.name}
                                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute top-2 right-2 flex flex-col gap-1">
                                  {(product as any).hasDiscount && (
                                    <Badge variant="destructive" className="bg-green-500 text-white">
                                      -{(product as any).discountPercent}% OFF
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="p-4">
                                <h3
                                  className="font-medium text-maintext group-hover:text-primary transition-colors truncate cursor-pointer"
                                  onClick={() => handleProductSelect(product)}
                                >
                                  {product.name}
                                </h3>
                                <p className="text-maintext text-sm mb-2 truncate">{getBrandName(product.brand)}</p>
                                <div className="flex justify-between items-center">
                                  <div className="flex flex-col">
                                    <p className={`font-medium ${(product as any).hasDiscount ? 'text-primary' : 'text-primary'}`}>
                                      {firstVariant ? formatCurrency((product as any).hasDiscount ? (product as any).discountedPrice : firstVariant.price) : 'N/A'}
                                    </p>
                                    {(product as any).hasDiscount && (
                                      <p className="text-xs text-maintext line-through">
                                        {formatCurrency((product as any).originalPrice)}
                                      </p>
                                    )}
                                  </div>
                                  {uniqueColors.length > 0 && (
                                    <div className="flex -space-x-1">
                                      {uniqueColors.slice(0, 3).map((color, idx) => (
                                        <div
                                          key={color.id || `color-${idx}`}
                                          className="h-5 w-5 rounded-full border border-white"
                                          style={{ backgroundColor: color.code }}
                                          title={color.name}
                                        />
                                      ))}
                                      {uniqueColors.length > 3 && (
                                        <div className="h-5 w-5 rounded-full bg-gray-100 border border-white flex items-center justify-center text-xs text-maintext">
                                          +{uniqueColors.length - 3}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <Button
                                  variant="outline"
                                  className="w-full mt-3 flex items-center justify-center gap-2"
                                  onClick={() => handleProductSelect(product)}
                                  disabled={product.variants.every(v => v.stock === 0)}
                                >
                                  <Icon path={mdiEye} size={0.7} />
                                  Xem chi tiết
                                </Button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </TabsContent>

                    <TabsContent value="table" className="mt-0">
                      <div className="border border-border rounded-md overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-muted/50">
                              <th className="text-left py-3 px-4 font-medium text-maintext">Sản phẩm</th>
                              <th className="text-left py-3 px-4 font-medium text-maintext">Thương hiệu</th>
                              <th className="text-left py-3 px-4 font-medium text-maintext">Giá</th>
                              <th className="text-left py-3 px-4 font-medium text-maintext">Màu sắc</th>
                              <th className="text-left py-3 px-4 font-medium text-maintext">Kho</th>
                              <th className="text-center py-3 px-4 font-medium text-maintext">Thao tác</th>
                            </tr>
                          </thead>
                          <tbody>
                            {processedProducts.map((product) => {
                              const firstVariant = product.variants?.[0];
                              const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
                              const uniqueColorsCount = new Set(product.variants.map(v => (v.colorId as any)?.id)).size;
                              const firstAvailableVariant = product.variants.find(v => v.stock > 0) || product.variants[0];
                              return (
                                <tr
                                  key={product.id}
                                  className="border-t border-border hover:bg-muted/20 transition-colors cursor-pointer"
                                >
                                  <td className="py-3 px-4" onClick={() => handleProductSelect(product)}>
                                    <div className="flex items-center gap-2">
                                      <div className="relative h-10 w-10 rounded-md overflow-hidden bg-gray-50">
                                        <img
                                          src={checkImageUrl(getVariantImageUrl(firstVariant))}
                                          alt={product.name}
                                          className="object-contain"
                                        />
                                      </div>
                                      <span className="font-medium text-maintext truncate max-w-[150px]">{product.name}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-maintext truncate max-w-[100px]" onClick={() => handleProductSelect(product)}>{getBrandName(product.brand)}</td>
                                  <td className="py-3 px-4" onClick={() => handleProductSelect(product)}>
                                    <div className="flex flex-col">
                                      <span className={`font-medium ${(product as any).hasDiscount ? 'text-primary' : 'text-primary'}`}>
                                        {firstVariant ? formatCurrency((product as any).hasDiscount ? (product as any).discountedPrice : firstVariant.price) : 'N/A'}
                                      </span>
                                      {(product as any).hasDiscount && (
                                        <span className="text-xs text-maintext line-through">
                                          {formatCurrency((product as any).originalPrice)}
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-3 px-4" onClick={() => handleProductSelect(product)}>
                                    {product.variants.length > 0 && (
                                      <div className="flex -space-x-1">
                                        {Array.from(new Map(product.variants.map(v => [(v.colorId as any)?.id, v.colorId])).values()).slice(0, 3).map((color, idx) => color && (
                                          <div
                                            key={(color as any).id || `table-color-${idx}`}
                                            className="h-5 w-5 rounded-full border"
                                            style={{ backgroundColor: (color as any).code }}
                                            title={(color as any).name}
                                          />
                                        ))}
                                        {uniqueColorsCount > 3 && (
                                          <div className="h-5 w-5 rounded-full bg-gray-100 border border-white flex items-center justify-center text-xs text-maintext">
                                            +{uniqueColorsCount - 3}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </td>
                                  <td className="py-3 px-4" onClick={() => handleProductSelect(product)}>
                                    <Badge variant={totalStock > 10 ? "secondary" : totalStock > 0 ? "outline" : "destructive"} className="text-xs !flex-shrink-0">
                                      <span className="flex-shrink-0">{totalStock > 10 ? "Còn hàng" : totalStock > 0 ? "Sắp hết" : "Hết hàng"}</span>
                                    </Badge>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-8 w-8 p-0"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleProductSelect(product);
                                              }}
                                            >
                                              <Icon path={mdiInformationOutline} size={0.7} className="text-maintext" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Chi tiết</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>

                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-8 w-8 p-0"
                                              disabled={product.variants.every(v => v.stock === 0)}
                                              onClick={(e) => {
                                                e.stopPropagation();

                                                const firstAvailableVariant = product.variants.find((v: any) => v.stock > 0);
                                                if (firstAvailableVariant) {
                                                  addItemToCorrectCart(product, firstAvailableVariant, false);
                                                } else {
                                                  toast.warn('Sản phẩm này đã hết hàng.');
                                                }
                                              }}
                                            >
                                              <Icon path={mdiPlus} size={0.7} className="text-maintext" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Thêm vào giỏ</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </TabsContent>

                    {dataWithPromotions?.data?.pagination && dataWithPromotions.data.pagination.totalPages > 1 && (
                      <div className="flex justify-center mt-6">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (pagination.page > 1) {
                                    setPagination(p => ({ ...p, page: p.page - 1 }));
                                  }
                                }}
                                disabled={pagination.page <= 1}
                              />
                            </PaginationItem>
                            {(() => {
                              const pages = [];
                              const totalPages = dataWithPromotions.data.pagination.totalPages;
                              const currentPage = pagination.page;
                              const pageLimit = 5;

                              if (totalPages <= pageLimit) {
                                for (let i = 1; i <= totalPages; i++) {
                                  pages.push(
                                    <PaginationItem key={i}>
                                      <PaginationLink
                                        href="#"
                                        isActive={currentPage === i}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setPagination(p => ({ ...p, page: i }));
                                        }}
                                      >
                                        {i}
                                      </PaginationLink>
                                    </PaginationItem>
                                  );
                                }
                              } else {
                                pages.push(
                                  <PaginationItem key={1}>
                                    <PaginationLink
                                      href="#"
                                      isActive={currentPage === 1}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setPagination(p => ({ ...p, page: 1 }));
                                      }}
                                    >
                                      1
                                    </PaginationLink>
                                  </PaginationItem>
                                );

                                if (currentPage > 3) {
                                  pages.push(<PaginationItem key="start-ellipsis"><PaginationEllipsis /></PaginationItem>);
                                }

                                let startPage = Math.max(2, currentPage - 1);
                                let endPage = Math.min(totalPages - 1, currentPage + 1);

                                if (currentPage <= 2) {
                                  endPage = Math.min(totalPages - 1, 3);
                                }
                                if (currentPage >= totalPages - 1) {
                                  startPage = Math.max(2, totalPages - 2);
                                }

                                for (let i = startPage; i <= endPage; i++) {
                                  pages.push(
                                    <PaginationItem key={i}>
                                      <PaginationLink
                                        href="#"
                                        isActive={currentPage === i}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setPagination(p => ({ ...p, page: i }));
                                        }}
                                      >
                                        {i}
                                      </PaginationLink>
                                    </PaginationItem>
                                  );
                                }

                                if (currentPage < totalPages - 2) {
                                  pages.push(<PaginationItem key="end-ellipsis"><PaginationEllipsis /></PaginationItem>);
                                }

                                pages.push(
                                  <PaginationItem key={totalPages}>
                                    <PaginationLink
                                      href="#"
                                      isActive={currentPage === totalPages}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setPagination(p => ({ ...p, page: totalPages }));
                                      }}
                                    >
                                      {totalPages}
                                    </PaginationLink>
                                  </PaginationItem>
                                );
                              }
                              return pages;
                            })()}
                            <PaginationItem>
                              <PaginationNext
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (pagination.page < (dataWithPromotions?.data?.pagination?.totalPages || 1)) {
                                    setPagination(p => ({ ...p, page: p.page + 1 }));
                                  }
                                }}
                                disabled={pagination.page >= (dataWithPromotions?.data?.pagination?.totalPages || 1)}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </>
                )}
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}