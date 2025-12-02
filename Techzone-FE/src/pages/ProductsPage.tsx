"use client"

import { useState, useEffect, useMemo } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icon } from "@mdi/react"
import { mdiCartOutline, mdiHeartOutline, mdiEye, mdiFilterOutline, mdiClose, mdiMagnify, mdiPercent } from "@mdi/js"
import { useProducts, useSearchProducts } from "@/hooks/product"
import { usePromotions } from "@/hooks/promotion"
import { applyPromotionsToProducts, calculateProductDiscount } from "@/lib/promotions"
import { getSizeLabel } from "@/utils/sizeMapping"
import type { IProductFilter } from "@/interface/request/product"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { checkImageUrl } from "@/lib/utils"
import { useCartStore } from "@/stores/useCartStore"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { motion, AnimatePresence } from "framer-motion"
import QrCodeScanner from "@/components/ProductPage/QrCodeScanner"
import VoucherForm from "@/components/ProductPage/VoucherForm"
import CartIcon from "@/components/ui/CartIcon"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"

interface ProductCardProps {
  product: any
  onAddToCart: () => void
  onQuickView: () => void
  onAddToWishlist: () => void
}

interface ProductFiltersProps {
  filters: IProductFilter
  onChange: (filters: Partial<IProductFilter>) => void
}
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
}

export default function ProductsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
  })
  const [filters, setFilters] = useState<IProductFilter>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState("default")
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number; voucherId: string } | null>(
    null,
  )
  const [isSearching, setIsSearching] = useState(false)
  const { addToCart } = useCartStore()

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (searchQuery) {
        setIsSearching(true)
      } else {
        setIsSearching(false)
      }
    }, 500)

    return () => clearTimeout(timerId)
  }, [searchQuery])

  const paginationParams: IProductFilter = {
    page: pagination.page,
    limit: pagination.limit,
    status: "ACTIVE",
  }

  const productsQuery = useProducts(paginationParams)
  const searchQuery2 = useSearchProducts(isSearching ? { keyword: searchQuery, status: "ACTIVE" } : { keyword: "" })
  const { data: rawData, isLoading, isError } = isSearching ? searchQuery2 : productsQuery
  const { data: promotionsData } = usePromotions({ status: "ACTIVE" });
  console.log(promotionsData)
  const data = useMemo(() => {
    if (!rawData || !rawData.data) return rawData
    const productsArray = Array.isArray(rawData.data)
      ? rawData.data
      : (rawData.data?.products || [])
    if (!Array.isArray(productsArray)) return rawData
    let filteredProducts = [...productsArray]
    if (promotionsData?.data?.promotions) {
      filteredProducts = applyPromotionsToProducts(filteredProducts, promotionsData.data.promotions)
    }


    if (filters.brands && filters.brands.length > 0) {
      const brandsArray = Array.isArray(filters.brands) ? filters.brands : [filters.brands]
      filteredProducts = filteredProducts.filter((product) => {
        const brandId = product.brand_id || product.brand?.id
        return brandsArray.includes(brandId)
      })
    }

    if (filters.categories && filters.categories.length > 0) {
      const categoriesArray = Array.isArray(filters.categories) ? filters.categories : [filters.categories]
      filteredProducts = filteredProducts.filter((product) => {
        const categoryId = product.category_id || product.category?.id
        return categoriesArray.includes(categoryId)
      })
    }

    if (filters.color) {
      // Note: Color filtering may not be available in new structure
      // Keeping for backward compatibility
      filteredProducts = filteredProducts.filter((product) => {
        // If product has variants, check them
        if (product.variants && Array.isArray(product.variants)) {
          return product.variants.some((variant: any) => {
            const colorId = variant.color?.id || variant.colorId
            return colorId === filters.color
          })
        }
        return false
      })
    }

    if (filters.size) {
      // Note: Size filtering may not be available in new structure
      // Keeping for backward compatibility
      filteredProducts = filteredProducts.filter((product) => {
        // If product has variants, check them
        if (product.variants && Array.isArray(product.variants)) {
          return product.variants.some((variant: any) => {
            const sizeId = variant.size?.id || variant.sizeId
            return sizeId === filters.size
          })
        }
        return false
      })
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      const minPrice = filters.minPrice !== undefined ? filters.minPrice : 0
      const maxPrice = filters.maxPrice !== undefined ? filters.maxPrice : Number.POSITIVE_INFINITY

      filteredProducts = filteredProducts.filter((product: any) => {
        // Use discount_price if available, otherwise selling_price
        let price = parseFloat(product.discount_price || product.selling_price || product.base_price || 0);

        if (promotionsData?.data?.promotions) {
          const discount = calculateProductDiscount(
            product.id,
            price,
            promotionsData.data.promotions
          );

          if (discount.discountPercent > 0) {
            price = discount.discountedPrice;
          }
        }

        return price >= minPrice && price <= maxPrice
      })
    }


    if (sortOption !== "default") {
      filteredProducts.sort((a: any, b: any) => {
        let priceA = parseFloat(a.discount_price || a.selling_price || a.base_price || 0);
        let priceB = parseFloat(b.discount_price || b.selling_price || b.base_price || 0);

        if (promotionsData?.data?.promotions) {
          const discountA = calculateProductDiscount(a.id, priceA, promotionsData.data.promotions);
          const discountB = calculateProductDiscount(b.id, priceB, promotionsData.data.promotions);

          if (discountA.discountPercent > 0) {
            priceA = discountA.discountedPrice;
          }
          if (discountB.discountPercent > 0) {
            priceB = discountB.discountedPrice;
          }
        }

        const dateA = new Date(a.created_at || a.createdAt).getTime()
        const dateB = new Date(b.created_at || b.createdAt).getTime()

        switch (sortOption) {
          case "price-asc":
            return priceA - priceB
          case "price-desc":
            return priceB - priceA
          case "newest":
            return dateB - dateA
          case "popularity":
            // Use sold_count or view_count for popularity
            const popularityA = parseInt(a.sold_count || a.view_count || 0)
            const popularityB = parseInt(b.sold_count || b.view_count || 0)
            return popularityB - popularityA
          default:
            return 0
        }
      })
    }


    // Preserve the original structure
    if (Array.isArray(rawData.data)) {
      return {
        ...rawData,
        data: filteredProducts,
      }
    } else {
      return {
        ...rawData,
        data: {
          ...rawData.data,
          products: filteredProducts,
        },
      }
    }
  }, [rawData, filters, sortOption, pagination, promotionsData])

  const handleFilterChange = (updatedFilters: Partial<IProductFilter>) => {
    setFilters((prev) => ({
      ...prev,
      ...updatedFilters,
    }))
    setPagination((prev) => ({
      ...prev,
      page: 1,
    }))
  }

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }))
  }

  const handleAddToCart = (product: any) => {
    const totalStock = parseInt(product.total_stock || 0);

    if (totalStock === 0) {
      toast.error('Sản phẩm đã hết hàng');
      return;
    }

    // Use discount_price if available, otherwise selling_price
    let basePrice = parseFloat(product.discount_price || product.selling_price || product.base_price || 0);
    let finalPrice = basePrice;
    let originalPrice = product.selling_price ? parseFloat(product.selling_price) : undefined;
    let discountPercent = 0;
    let hasDiscount = false;

    // Calculate discount percentage if discount_price exists
    if (product.discount_price && product.selling_price) {
      const sellingPrice = parseFloat(product.selling_price);
      const discountPrice = parseFloat(product.discount_price);
      if (sellingPrice > discountPrice) {
        discountPercent = Math.round(((sellingPrice - discountPrice) / sellingPrice) * 100);
        hasDiscount = true;
        finalPrice = discountPrice;
        originalPrice = sellingPrice;
      }
    }

    // Apply promotions if available
    if (promotionsData?.data?.promotions) {
      const discount = calculateProductDiscount(
        product.id,
        basePrice,
        promotionsData.data.promotions
      );

      if (discount.discountPercent > 0) {
        finalPrice = discount.discountedPrice;
        originalPrice = discount.originalPrice;
        discountPercent = discount.discountPercent;
        hasDiscount = true;
      }
    }

    // Get primary image
    const primaryImage = product.images?.find((img: any) => img.is_primary === 1) || product.images?.[0];
    const imageUrl = primaryImage?.image_url || primaryImage?.imageUrl || '';

    const cartItem = {
      id: product.id,
      productId: product.id,
      name: product.name,
      price: finalPrice,
      originalPrice: originalPrice,
      discountPercent: discountPercent,
      hasDiscount: hasDiscount,
      image: imageUrl,
      quantity: 1,
      slug: product.slug || product.code,
      brand: product.brand_name || (typeof product.brand === 'string' ? product.brand : product.brand?.name),
      size: undefined, // Not available in new structure
      colors: [], // Not available in new structure
      stock: totalStock,
      colorId: '',
      sizeId: '',
      colorName: '',
      sizeName: ''
    };

    addToCart(cartItem, 1);
    toast.success('Đã thêm sản phẩm vào giỏ hàng');
  };

  const handleQuickView = (product: any) => {
    const slug = product.slug || product.name.toLowerCase().replace(/\s+/g, "-")
    window.location.href = `/products/${slug}-${product.id}`
  }

  const handleAddToWishlist = (product: any) => {
    toast.success("Đã thêm sản phẩm vào danh sách yêu thích")
  }

  const handleApplyVoucher = (voucherData: { code: string; discount: number; voucherId: string }) => {
    setAppliedVoucher(voucherData)
    toast.success(`Đã áp dụng mã giảm giá: ${voucherData.code}`)
  }

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null)
    toast.info("Đã xóa mã giảm giá")
  }

  const filteredProducts = useMemo(() => {
    if (!data || !data.data) return []
    // Handle both structures: array directly or nested in products property
    if (Array.isArray(data.data)) {
      return data.data
    }
    if (data.data?.products && Array.isArray(data.data.products)) {
      return data.data.products
    }
    return []
  }, [data])

  return (
    <div className="container mx-auto py-8 relative">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="!text-maintext hover:!text-maintext">
              Trang chủ
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="!text-maintext hover:!text-maintext" />
          <BreadcrumbItem>
            <BreadcrumbPage className="!text-maintext hover:!text-maintext">Tất cả sản phẩm</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col lg:flex-row gap-4 items-start">

        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden w-full"
            >
              <div className="bg-white rounded-md shadow-sm border p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-medium">Bộ lọc sản phẩm</h2>
                  <Button variant="ghost" size="sm" onClick={toggleFilter}>
                    <Icon path={mdiClose} size={0.7} />
                  </Button>
                </div>
                <ProductFilters filters={filters} onChange={handleFilterChange} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="hidden lg:block w-full lg:w-1/4 xl:w-1/5 ">
          <div className="bg-white rounded-md shadow-sm border p-4 sticky top-20">
            <h2 className="font-medium mb-4">Bộ lọc sản phẩm</h2>
            <ProductFilters filters={filters} onChange={handleFilterChange} />

            {filteredProducts.length > 0 && (
              <VoucherForm
                orderValue={filteredProducts.reduce((sum, product) => {
                  const price = parseFloat(product.discount_price || product.selling_price || product.base_price || 0)
                  return sum + price
                }, 0)}
                onApplyVoucher={handleApplyVoucher}
                onRemoveVoucher={handleRemoveVoucher}
                appliedVoucher={appliedVoucher}
              />
            )}
          </div>
        </div>


        <div className="w-full lg:w-3/4 xl:w-4/5">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <div className="flex gap-2 flex-1">
              <Button
                variant="outline"
                onClick={toggleFilter}
                className="lg:hidden flex items-center gap-2"
              >
                <Icon path={mdiFilterOutline} size={0.7} />
                Bộ lọc
              </Button>
              <div className="relative flex-1">
                <Icon
                  path={mdiMagnify}
                  size={0.7}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-maintext"
                />
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Select defaultValue="default" value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Mặc định</SelectItem>
                <SelectItem value="price-asc">Giá: Thấp đến cao</SelectItem>
                <SelectItem value="price-desc">Giá: Cao đến thấp</SelectItem>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="popularity">Phổ biến nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(9)].map((_, index) => (
                <Card key={index} className="overflow-hidden h-full">
                  <div className="aspect-square w-full">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">Đã xảy ra lỗi khi tải dữ liệu</p>
              <Button onClick={() => setPagination({ ...pagination })}>Thử lại</Button>
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-maintext font-semibold">Tìm thấy <span className="text-primary text-lg">{filteredProducts.length}</span> sản phẩm</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    promotionsData={promotionsData}
                    onAddToCart={() => handleAddToCart(product)}
                    onQuickView={() => handleQuickView(product)}
                    onAddToWishlist={() => handleAddToWishlist(product)}
                  />
                ))}
              </div>


              <div className="flex justify-center mt-8">
                <Pagination>
                  <PaginationContent>
                    {(() => {
                      const paginationData = (rawData as any)?.pagination || (rawData as any)?.data?.pagination || {}
                      const currentPage = paginationData.page || paginationData.currentPage || 1
                      const totalPages = paginationData.totalPages || 1
                      return (
                        <>
                          {currentPage > 1 ? (
                            <PaginationPrevious
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                handlePageChange(currentPage - 1)
                              }}
                            />
                          ) : (
                            <PaginationPrevious href="#" className="pointer-events-none opacity-50" />
                          )}
                          {(() => {
                            const pages = []


                            if (totalPages > 0) {
                              pages.push(
                                <PaginationItem key={1}>
                                  <PaginationLink
                                    href="#"
                                    isActive={currentPage === 1}
                                    onClick={(e) => {
                                      e.preventDefault()
                                      handlePageChange(1)
                                    }}
                                  >
                                    1
                                  </PaginationLink>
                                </PaginationItem>,
                              )
                            }


                            if (currentPage > 3) {
                              pages.push(
                                <PaginationItem key="start-ellipsis">
                                  <PaginationEllipsis />
                                </PaginationItem>,
                              )
                            }


                            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                              if (i !== 1 && i !== totalPages) {
                                pages.push(
                                  <PaginationItem key={i}>
                                    <PaginationLink
                                      href="#"
                                      isActive={currentPage === i}
                                      onClick={(e) => {
                                        e.preventDefault()
                                        handlePageChange(i)
                                      }}
                                    >
                                      {i}
                                    </PaginationLink>
                                  </PaginationItem>,
                                )
                              }
                            }

                            if (currentPage < totalPages - 2) {
                              pages.push(
                                <PaginationItem key="end-ellipsis">
                                  <PaginationEllipsis />
                                </PaginationItem>,
                              )
                            }

                            if (totalPages > 1) {
                              pages.push(
                                <PaginationItem key={totalPages}>
                                  <PaginationLink
                                    href="#"
                                    isActive={currentPage === totalPages}
                                    onClick={(e) => {
                                      e.preventDefault()
                                      handlePageChange(totalPages)
                                    }}
                                  >
                                    {totalPages}
                                  </PaginationLink>
                                </PaginationItem>,
                              )
                            }

                            return pages
                          })()}
                          {currentPage < totalPages ? (
                            <PaginationNext
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                if (currentPage < totalPages) handlePageChange(currentPage + 1)
                              }}
                            />
                          ) : (
                            <PaginationNext href="#" className="pointer-events-none opacity-50" />
                          )}
                        </>
                      )
                    })()}
                  </PaginationContent>
                </Pagination>
              </div>

              <div className="lg:hidden mt-8 bg-white rounded-md shadow-sm border p-4">
                <VoucherForm
                  orderValue={filteredProducts.reduce((sum, product) => {
                    const price = parseFloat(product.discount_price || product.selling_price || product.base_price || 0)
                    return sum + price
                  }, 0)}
                  onApplyVoucher={handleApplyVoucher}
                  onRemoveVoucher={handleRemoveVoucher}
                  appliedVoucher={appliedVoucher}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-maintext mb-4">Không tìm thấy sản phẩm nào</p>
              {(searchQuery || Object.keys(filters).length > 0) && (
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setFilters({})
                  }}
                >
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50 shadow-lg rounded-full bg-primary p-2 hover:bg-primary/80 transition-all duration-300">
        <CartIcon className="text-white" />
      </div>
    </div>
  )
}

const ProductCard = ({ product, promotionsData, onAddToCart, onQuickView, onAddToWishlist }: ProductCardProps & { promotionsData?: any }) => {
  const [isHovered, setIsHovered] = useState(false)

  // Get primary image or first image
  const primaryImage = product.images?.find((img: any) => img.is_primary === 1) || product.images?.[0];
  const imageUrl = primaryImage?.image_url || primaryImage?.imageUrl || "/placeholder.svg";

  // Calculate price and discount
  const sellingPrice = parseFloat(product.selling_price || product.base_price || 0);
  const discountPrice = product.discount_price ? parseFloat(product.discount_price) : null;
  const basePrice = discountPrice || sellingPrice;

  // Calculate discount percentage
  let discountPercent = 0;
  if (discountPrice && sellingPrice > discountPrice) {
    discountPercent = Math.round(((sellingPrice - discountPrice) / sellingPrice) * 100);
  }

  // Apply promotions
  let finalPrice = basePrice;
  let finalDiscountPercent = discountPercent;
  if (promotionsData?.data?.promotions) {
    const discount = calculateProductDiscount(
      product.id,
      basePrice,
      promotionsData.data.promotions
    );
    if (discount.discountPercent > 0) {
      finalPrice = discount.discountedPrice;
      finalDiscountPercent = discount.discountPercent;
    }
  }

  const totalStock = parseInt(product.total_stock || 0);
  const slug = product.slug || product.name.toLowerCase().replace(/\s+/g, "-");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="group overflow-visible border rounded-lg hover:shadow-2xl shadow-lg transition-all duration-500 h-full flex flex-col transform bg-white relative backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg z-10 pointer-events-none" />

        <div className="relative overflow-visible bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-t-2xl">
          <a href={`/products/${slug}-${product.id}`} className="block">
            <div className="aspect-square overflow-visible relative flex items-center justify-center">
              <motion.div
                className="w-full h-full relative z-20"
              >
                <img
                  src={checkImageUrl(imageUrl)}
                  alt={product.name}
                  className="object-contain px-2 w-full h-full filter group-hover:brightness-110 transition-all duration-500"
                />
              </motion.div>
            </div>
          </a>

          <div className="absolute top-2 left-2 flex flex-row flex-wrap gap-1 z-20 max-w-[calc(100%-4rem)]">
            {finalDiscountPercent > 0 && (
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg border border-white/50 backdrop-blur-sm animate-pulse flex-shrink-0 flex items-center justify-center gap-0.5"
              >
                <span className="text-[10px]">💥</span>
                <span className="text-[10px]">-{finalDiscountPercent}%</span>
              </motion.div>
            )}

            {/* Featured badge */}
            {product.is_featured === 1 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-purple-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg border border-white/50 backdrop-blur-sm"
              >
                Nổi bật
              </motion.div>
            )}

            {/* New badge */}
            {product.is_new === 1 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg border border-white/50 backdrop-blur-sm"
              >
                Mới
              </motion.div>
            )}

            {/* Stock status */}
            {totalStock === 0 ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg border border-white/50 backdrop-blur-sm"
              >
                Hết hàng
              </motion.div>
            ) : totalStock <= 5 ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg border border-white/50 backdrop-blur-sm"
              >
                Sắp hết
              </motion.div>
            ) : null}
          </div>


          <motion.div
            className="absolute right-2 top-2 transform -translate-y-1/2 flex flex-col gap-4 z-50"
            initial={{ x: 60, opacity: 0 }}
            animate={{
              x: isHovered ? 0 : 60,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 bg-white/90 backdrop-blur-md hover:!bg-primary hover:text-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300 group/btn"
                onClick={(e) => {
                  e.preventDefault()
                  onAddToCart()
                }}
                aria-label="Thêm vào giỏ hàng"
              >
                <Icon path={mdiCartOutline} size={0.7} className="group-hover/btn:animate-bounce group-hover:text-white" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 bg-white/90 backdrop-blur-md hover:!bg-pink-500 hover:text-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300 group/btn"
                onClick={(e) => {
                  e.preventDefault()
                  onAddToWishlist()
                }}
                aria-label="Yêu thích"
              >
                <Icon path={mdiHeartOutline} size={0.7} className="group-hover/btn:animate-bounce group-hover:text-white" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 bg-white/90 backdrop-blur-md hover:!bg-blue-500 hover:text-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300 group/btn"
                onClick={(e) => {
                  e.preventDefault()
                  onQuickView()
                }}
                aria-label="Xem nhanh"
              >
                <Icon path={mdiEye} size={0.7} className="group-hover/btn:animate-bounce group-hover:text-white" />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <div className="p-4 flex flex-col flex-grow bg-gradient-to-b from-white via-gray-50/30 to-white border-t border-gray-100/50 rounded-b-2xl relative">
          <div className="text-xs text-primary/80 mb-2 uppercase tracking-wider font-bold flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-pink-400 animate-pulse"></div>
            <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
              {product.brand_name || (typeof product.brand === "string" ? product.brand : product.brand?.name || "")}
            </span>
          </div>

          <a
            href={`/products/${slug}-${product.id}`}
            className="hover:text-primary transition-colors group/link"
          >
            <h3 className="font-bold text-base mb-2 line-clamp-2 leading-tight group-hover:text-primary/90 transition-colors duration-300 text-maintext group-hover/link:underline decoration-primary/50 underline-offset-2">
              {product.name}
            </h3>
          </a>

          {/* Product info row */}
          <div className="flex items-center justify-between mb-2">
            {/* View count */}
            {product.view_count > 0 && (
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Icon path={mdiEye} size={0.6} />
                <span>{product.view_count}</span>
              </div>
            )}

            {/* Sold count */}
            {product.sold_count > 0 && (
              <div className="text-xs text-gray-500">
                Đã bán: {product.sold_count}
              </div>
            )}
          </div>

          {/* Price section */}
          <div>
            <div className="flex items-center justify-between">
              <motion.div
                className="font-extrabold text-lg text-active"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {formatPrice(finalPrice)}
              </motion.div>
              {sellingPrice > finalPrice && (
                <div className="text-xs text-maintext line-through font-medium bg-gray-100 px-2 py-1 rounded-sm italic">
                  {formatPrice(sellingPrice)}
                </div>
              )}
            </div>
          </div>

          {/* SKU */}
          {product.sku && (
            <div className="text-xs text-gray-400 mt-2">
              SKU: {product.sku}
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </Card>
    </motion.div>
  )
}
const ProductFilters = ({ filters, onChange }: ProductFiltersProps) => {
  const productsQuery = useProducts({ limit: 8, status: "ACTIVE" })
  // Handle new API structure: data is an array directly
  const products = Array.isArray(productsQuery.data?.data) ? productsQuery.data.data : (productsQuery.data?.data?.products || [])
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>(
    filters.brands ? (Array.isArray(filters.brands) ? filters.brands[0] : filters.brands) : undefined,
  )

  useEffect(() => {
    if (filters.brands) {
      setSelectedBrand(Array.isArray(filters.brands) ? filters.brands[0] : filters.brands)
    } else {
      setSelectedBrand(undefined)
    }
  }, [filters.brands])

  const handleBrandChange = (brandId: string) => {
    if (selectedBrand === brandId) {
      setSelectedBrand(undefined)
      onChange({ brands: undefined })
    } else {
      setSelectedBrand(brandId)
      onChange({ brands: brandId })
    }
  }

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    filters.categories ? (Array.isArray(filters.categories) ? filters.categories[0] : filters.categories) : undefined,
  )

  useEffect(() => {
    if (filters.categories) {
      setSelectedCategory(Array.isArray(filters.categories) ? filters.categories[0] : filters.categories)
    } else {
      setSelectedCategory(undefined)
    }
  }, [filters.categories])

  const handleCategoryChange = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(undefined)
      onChange({ categories: undefined })
    } else {
      setSelectedCategory(categoryId)
      onChange({ categories: categoryId })
    }
  }

  const handleColorChange = (colorId: string) => {
    onChange({
      color: filters.color === colorId ? undefined : colorId,
    })
  }
  const handleSizeChange = (sizeId: string) => {
    onChange({
      size: filters.size === sizeId ? undefined : sizeId,
    })
  }
  const brands = useMemo(() => {
    if (!products || products.length === 0) return []

    const uniqueBrands = Array.from(
      new Set(
        products.map((product) => {
          const brandId = product.brand_id || (typeof product.brand === "object" ? product.brand?.id : product.brand)
          const brandName = product.brand_name || (typeof product.brand === "object" ? product.brand?.name : product.brand)
          return JSON.stringify({ id: brandId, name: brandName })
        }),
      ),
    ).map((brandStr) => JSON.parse(brandStr))

    return uniqueBrands
  }, [products])

  const categories = useMemo(() => {
    if (!products || products.length === 0) return []

    const uniqueCategories = Array.from(
      new Set(
        products.map((product) => {
          const categoryId = product.category_id || (typeof product.category === "object" ? product.category?.id : product.category)
          const categoryName = product.category_name || (typeof product.category === "object" ? product.category?.name : product.category)
          return JSON.stringify({ id: categoryId, name: categoryName })
        }),
      ),
    ).map((categoryStr) => JSON.parse(categoryStr))

    return uniqueCategories
  }, [products])

  const colors = useMemo(() => {
    if (!products || products.length === 0) return []

    // If products have variants, extract colors from them
    const allColors = products.flatMap((product) => {
      if (product.variants && Array.isArray(product.variants)) {
        return product.variants.map((variant) =>
          variant.color || { id: variant.colorId, name: variant.colorId, code: "#000000" },
        )
      }
      return []
    })

    const uniqueColors = Array.from(new Set(allColors.map((color) => JSON.stringify(color)))).map((colorStr) =>
      JSON.parse(colorStr),
    )

    return uniqueColors
  }, [products])

  const sizes = useMemo(() => {
    if (!products || products.length === 0) return []

    // If products have variants, extract sizes from them
    const allSizes = products.flatMap((product) => {
      if (product.variants && Array.isArray(product.variants)) {
        return product.variants.map((variant) =>
          variant.size || { id: variant.sizeId, value: variant.sizeId },
        )
      }
      return []
    })

    const uniqueSizes = Array.from(new Set(allSizes.map((size) => JSON.stringify(size))))
      .map((sizeStr) => JSON.parse(sizeStr))
      .sort((a, b) => (a.value || 0) - (b.value || 0))

    return uniqueSizes
  }, [products])

  const priceRange = useMemo(() => {
    if (!products || products.length === 0) {
      return { min: 0, max: 5000000 }
    }

    const prices = products.map((product) => {
      const price = parseFloat(product.discount_price || product.selling_price || product.base_price || 0)
      return price
    })

    return {
      min: Math.min(...prices, 0),
      max: Math.max(...prices, 5000000),
    }
  }, [products])

  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number]>([
    filters.minPrice || priceRange.min,
    filters.maxPrice || priceRange.max,
  ])

  const handlePriceChange = (values: number[]) => {
    setSelectedPriceRange(values as [number, number])


    const timerId = setTimeout(() => {
      onChange({
        minPrice: values[0],
        maxPrice: values[1],
      })
    }, 300)

    return () => clearTimeout(timerId)
  }

  const handleResetFilters = () => {
    setSelectedPriceRange([priceRange.min, priceRange.max])
    setSelectedCategory(undefined)
    onChange({
      categories: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      color: undefined,
      size: undefined,
    })
    toast.info("Đã đặt lại bộ lọc")
  }

  if (productsQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-3">Giá</h3>
        <div className="px-2">
          <Slider
            defaultValue={[priceRange.min, priceRange.max]}
            min={priceRange.min}
            max={priceRange.max}
            step={100000}
            value={selectedPriceRange}
            onValueChange={(value) => handlePriceChange(value as [number, number])}
          />
          <div className="flex justify-between mt-2 text-sm text-maintext">
            <span>{formatPrice(selectedPriceRange[0])}</span>
            <span>{formatPrice(selectedPriceRange[1])}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Thương hiệu</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {brands.map((brand) => (
            <div key={(brand as any)?.id} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${(brand as any)?.id}`}
                checked={selectedBrand === (brand as any)?.id}
                onCheckedChange={() => handleBrandChange((brand as any)?.id)}
              />
              <label htmlFor={`brand-${(brand as any)?.id}`} className="text-sm">
                {brand.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Danh mục</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {categories.map((category) => (
            <div key={(category as any)?.id} className="flex items-center gap-2">
              <Checkbox
                id={`category-${(category as any)?.id}`}
                checked={selectedCategory === (category as any)?.id}
                onCheckedChange={() => handleCategoryChange((category as any)?.id)}
              />
              <label htmlFor={`category-${(category as any)?.id}`} className="text-sm">
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Màu sắc</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color.id}
              className={`w-8 h-8 rounded-full border overflow-hidden relative transition-all duration-300 ${filters.color === color.id ? "ring-2 ring-primary ring-offset-2" : "border-gray-300"}`}
              style={{ backgroundColor: color.code }}
              title={color.name}
              onClick={() => handleColorChange(color.id)}
            />
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-3">Kích cỡ</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size.id}
              className={`px-2 py-1 border rounded text-sm transition-all duration-300 ${filters.size === size.id ? "bg-primary text-white border-primary" : "border-gray-300 hover:border-primary"}`}
              onClick={() => handleSizeChange(size.id)}
            >
              {size.value ? getSizeLabel(size.value) : size.name || size.id}
            </button>
          ))}
        </div>
      </div>
      <Button variant="outline" className="w-full" onClick={handleResetFilters}>
        Đặt lại
      </Button>
    </div>
  )
}
