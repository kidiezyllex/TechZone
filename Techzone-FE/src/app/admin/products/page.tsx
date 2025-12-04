'use client';

import { useState, useEffect, useMemo } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Icon } from '@mdi/react';
import { mdiMagnify, mdiPlus, mdiPencilOutline, mdiTrashCanOutline, mdiFilterOutline, mdiLoading, mdiEmailFast, mdiPencilCircle, mdiDeleteCircle } from '@mdi/js';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useProducts, useDeleteProduct } from '@/hooks/product';
import { useBrands, useCategories } from '@/hooks/attributes';
import { usePromotions } from '@/hooks/promotion';
import { applyPromotionsToProducts, calculateProductDiscount } from '@/lib/promotions';
import { IProductFilter } from '@/interface/request/product';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { checkImageUrl } from '@/lib/utils';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Download from 'yet-another-react-lightbox/plugins/download';
import 'yet-another-react-lightbox/styles.css';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<IProductFilter>({
    page: 1,
    limit: 10
  });
  const { data: promotionsData } = usePromotions();
  const [showFilters, setShowFilters] = useState(false);
  const { data: rawData, isLoading, isError } = useProducts(filters);
  const deleteProduct = useDeleteProduct();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSlides, setLightboxSlides] = useState<any[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { data: brandsData } = useBrands();
  const { data: categoriesData } = useCategories();

  const data = useMemo(() => {
    if (!rawData || !rawData.data) return rawData;

    // Handle both structures: data as array directly or data.products
    const productsArray = Array.isArray(rawData.data)
      ? rawData.data
      : (rawData.data?.products || []);

    if (!Array.isArray(productsArray)) return rawData;

    let products = [...productsArray];

    if (promotionsData?.data?.promotions) {
      products = applyPromotionsToProducts(products, promotionsData.data.promotions);
    }

    // Preserve structure - if data is array, return array; otherwise return nested structure
    if (Array.isArray(rawData.data)) {
      return {
        ...rawData,
        data: products,
        pagination: (rawData as any).pagination || rawData.data?.pagination,
      } as any;
    } else {
      return {
        ...rawData,
        data: {
          ...rawData.data,
          products,
        },
      };
    }
  }, [rawData, promotionsData]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchQuery.trim()) {
        setFilters((prev) => ({ ...prev, name: searchQuery, page: 1 }));
      } else {
        const { name, ...rest } = filters;
        setFilters({ ...rest, page: 1 });
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleFilterChange = (key: keyof IProductFilter, value: string | number | undefined) => {
    if (value === '') {
      const newFilters = { ...filters };
      delete newFilters[key];
      setFilters({ ...newFilters, page: 1 });
    } else {
      setFilters({ ...filters, [key]: value, page: 1 });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id, {
        onSuccess: () => {
          toast.success('Đã xóa sản phẩm thành công');
          queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (error: any) => {
          toast.error(`Xóa sản phẩm thất bại: ${error?.response?.data?.message || error.message || 'Đã có lỗi xảy ra'}`);
        }
      });
    } catch (error: any) {
      toast.error(`Xóa sản phẩm thất bại: ${error?.response?.data?.message || error.message || 'Đã có lỗi xảy ra'}`);
    }
  };

  const handleChangePage = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  const handleOpenLightbox = (
    product: any,
    variantIndex: number = 0,
    imageIndex: number = 0
  ) => {
    // Handle new structure: images directly on product
    let slides: any[] = [];

    if (product.images && Array.isArray(product.images)) {
      // New structure: images array directly on product
      slides = product.images.map((img: any) => ({
        src: checkImageUrl(img.image_url || img.imageUrl || ''),
        alt: product.name,
        download: checkImageUrl(img.image_url || img.imageUrl || ''),
      }));
    } else if (product.variants && Array.isArray(product.variants)) {
      // Old structure: images in variants
      slides = (product.variants as any[]).flatMap((variant: any) =>
        (variant.images || []).map((img: any) => ({
          src: checkImageUrl(img.imageUrl),
          alt: product.name,
          download: checkImageUrl(img.imageUrl),
        }))
      );
    }

    setLightboxSlides(slides);
    setLightboxIndex(imageIndex);
    setLightboxOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className='flex justify-between items-start'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/products">Quản lý sản phẩm</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Sản phẩm</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <a href="/admin/products/create">
          <Button>
            <Icon path={mdiPlus} size={0.7} />
            Thêm sản phẩm mới
          </Button>

        </a>
      </div>

      <Card className="mb-4">
        <CardContent className="py-4">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center gap-2">
            <div className="relative flex-1">
              <Icon
                path={mdiMagnify}
                size={0.7}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-maintext"
              />
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên sản phẩm..."
                className="pl-10 py-2 w-full border rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Icon path={mdiFilterOutline} size={0.7} className="mr-2" />
              {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
            </Button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-maintext mb-2 font-semibold">
                      Thương hiệu
                    </label>
                    <Select value={filters.brand || 'all'} onValueChange={(value) => handleFilterChange('brand', value === 'all' ? undefined : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tất cả thương hiệu">
                          {filters.brand
                            ? (brandsData?.data || []).find(brand => brand.id.toString() === filters.brand?.toString())?.name || 'Tất cả thương hiệu'
                            : 'Tất cả thương hiệu'
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả thương hiệu</SelectItem>
                        {(brandsData?.data || []).map((brand) => (
                          <SelectItem key={brand.id} value={brand.id.toString()}>{brand.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm text-maintext mb-2 font-semibold">
                      Danh mục
                    </label>
                    <Select value={filters.category || 'all'} onValueChange={(value) => handleFilterChange('category', value === 'all' ? undefined : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tất cả danh mục">
                          {filters.category
                            ? (categoriesData?.data || []).find(category => category.id.toString() === filters.category?.toString())?.name || 'Tất cả danh mục'
                            : 'Tất cả danh mục'
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả danh mục</SelectItem>
                        {(categoriesData?.data || []).map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm text-maintext mb-2 font-semibold">
                      Trạng thái
                    </label>
                    <Select value={filters.status || 'all'} onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tất cả trạng thái">
                          {filters.status === 'ACTIVE'
                            ? 'Hoạt động'
                            : filters.status === 'INACTIVE'
                              ? 'Không hoạt động'
                              : 'Tất cả trạng thái'
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                        <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                        <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="bg-white rounded-md shadow-sm p-4 space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-white rounded-md shadow-sm p-4 text-center">
          <p className="text-red-500">Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['products'] })}
          >
            Thử lại
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-md shadow-sm overflow-visible">
          <div className="overflow-x-auto" style={{
            width: '100%',
            display: 'block',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            scrollbarWidth: 'thin',
            scrollbarColor: '#94a3b8 #e2e8f0',
            WebkitOverflowScrolling: 'touch'
          }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Hình ảnh</TableHead>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Sản phẩm</TableHead>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Thương hiệu</TableHead>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Danh mục</TableHead>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Giá</TableHead>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Trạng thái</TableHead>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Ngày cập nhật</TableHead>
                  <TableHead className="px-4 py-4 text-right text-sm font-medium text-maintext">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(() => {
                  // Handle both structures: data as array or data.products
                  const productsList = Array.isArray(data?.data)
                    ? data.data
                    : (data?.data?.products || []);
                  return productsList.length > 0;
                })() ? (
                  (() => {
                    const productsList = Array.isArray(data?.data)
                      ? data.data
                      : (data?.data?.products || []);
                    return productsList;
                  })().map((product: any) => (
                    <TableRow key={product.id} className="hover:bg-gray-50">
                      <TableCell className="p-2 px-4 whitespace-nowrap">
                        <div
                          className="relative h-14 w-14 rounded-md overflow-hidden bg-gray-100 cursor-pointer group"
                          onClick={() => handleOpenLightbox(product, 0, 0)}
                          title="Xem ảnh lớn"
                        >
                          <img
                            src={checkImageUrl(
                              product.images?.[0]?.image_url || product.images?.[0]?.imageUrl ||
                              product.variants?.[0]?.images?.[0]?.imageUrl ||
                              ''
                            )}
                            alt={product.name}
                            className="object-contain group-hover:scale-105 transition-transform duration-200 w-full h-full"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-maintext">{product.name}</div>
                        <div className="text-xs text-maintext">
                          SKU: {product.sku || product.code || 'N/A'}
                        </div>
                        {(product.total_stock !== undefined || product.totalStock !== undefined) && (
                          <div className="text-xs text-maintext">
                            Tồn kho: {product.total_stock || product.totalStock}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-maintext">
                        {product.brand_name || (typeof product.brand === 'string' ? product.brand : product.brand?.name || 'N/A')}
                      </TableCell>
                      <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-maintext">
                        {product.category_name || (typeof product.category === 'string' ? product.category : product.category?.name || 'N/A')}
                      </TableCell>
                      <TableCell className="px-4 py-4 whitespace-nowrap text-sm">
                        {(() => {
                          // Handle both snake_case and camelCase properties
                          const discountPrice = product.discount_price || product.discountPrice;
                          const sellingPrice = product.selling_price || product.sellingPrice;
                          const basePrice = product.base_price || product.basePrice;
                          const price = product.price || 0;

                          // Use discount_price if available, otherwise selling_price, fallback to basePrice
                          const displayPrice = discountPrice || sellingPrice || basePrice || price || 0;
                          const originalPrice = sellingPrice || basePrice || price || 0;
                          const hasDiscount = discountPrice && discountPrice < originalPrice;
                          const discountPercent = hasDiscount
                            ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
                            : 0;

                          return (
                            <div className="space-y-1">
                              <div className={`font-medium ${hasDiscount ? 'text-primary' : 'text-maintext'}`}>
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(displayPrice)}
                              </div>
                              {hasDiscount && (
                                <div className="text-xs text-maintext line-through">
                                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(originalPrice)}
                                </div>
                              )}
                              {hasDiscount && (
                                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  -{discountPercent}%
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </TableCell>
                      <TableCell className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${product.status === 'ACTIVE' || product.is_active === 1
                          ? 'bg-green-100 text-green-800 border border-green-500'
                          : 'bg-red-100 text-red-800 border border-red-500'
                          }`}>
                          {product.status === 'ACTIVE' || product.is_active === 1 ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-maintext">
                        {formatDate(product.updated_at || product.updatedAt || '')}
                      </TableCell>
                      <TableCell className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <a href={`/admin/products/edit/${product.id}`}>
                            <Button
                              variant="outline"
                              size="icon"
                              title="Sửa"
                            >
                              <Icon path={mdiPencilCircle} size={0.7} />
                            </Button>
                          </a>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  setProductToDelete(product.id);
                                  setIsDeleteDialogOpen(true);
                                }}
                                title="Xóa"
                              >
                                <Icon path={mdiDeleteCircle} size={0.7} />
                              </Button>
                            </DialogTrigger>
                            {isDeleteDialogOpen && productToDelete === product.id && (
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
                                </DialogHeader>
                                <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => {
                                    setIsDeleteDialogOpen(false);
                                    setProductToDelete(null);
                                  }}>Hủy</Button>
                                  <Button variant="destructive" onClick={() => {
                                    if (productToDelete) {
                                      handleDeleteProduct(productToDelete);
                                      setIsDeleteDialogOpen(false);
                                      setProductToDelete(null);
                                    }
                                  }}>Xóa</Button>
                                </DialogFooter>
                              </DialogContent>
                            )}
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="px-4 py-8 text-center text-maintext">
                      Không tìm thấy sản phẩm nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {(() => {
            const paginationData = (data as any)?.pagination || (data as any)?.data?.pagination;
            if (!paginationData || paginationData.totalPages <= 1) return null;

            const currentPage = paginationData.page || paginationData.currentPage || 1;
            const totalPages = paginationData.totalPages || 1;
            const totalItems = paginationData.total || paginationData.totalItems;

            return (
              <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="hidden sm:block">
                  <p className="text-sm text-maintext">
                    Trang <span className="font-medium">{currentPage}</span> / <span className="font-medium">{totalPages}</span>
                    {totalItems && (
                      <> - Tổng <span className="font-medium">{totalItems}</span> sản phẩm</>
                    )}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleChangePage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Trước
                  </Button>
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleChangePage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  )).slice(
                    Math.max(0, currentPage - 3),
                    Math.min(totalPages, currentPage + 2)
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleChangePage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={lightboxSlides}
          index={lightboxIndex}
          on={{ view: ({ index }) => setLightboxIndex(index) }}
          plugins={[Zoom, Download]}
          zoom={{
            maxZoomPixelRatio: 3,
            zoomInMultiplier: 2,
          }}
        />
      )}
    </div>
  );
} 