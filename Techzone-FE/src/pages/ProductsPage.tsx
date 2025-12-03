"use client"

import { useState, useEffect, useMemo } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { useProducts, useSearchProducts } from "@/hooks/product"
import type { IProductFilter } from "@/interface/request/product"
import { useBrands, useCategories } from "@/hooks/attributes"
import { ProductCard } from "@/components/HomePage/ProductCard"
import type { Product } from "@/components/HomePage/ProductCard"
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
import { useCartStore } from "@/stores/useCartStore"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { motion, AnimatePresence } from "framer-motion"
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
import Icon from "@mdi/react"
import { mdiFilterOutline, mdiMagnify } from "@mdi/js"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mdiClose } from "@mdi/js"

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
  const data = useMemo(() => {
    if (!rawData || !rawData.data) return rawData
    const productsArray = Array.isArray(rawData.data)
      ? rawData.data
      : (rawData.data?.products || [])
    if (!Array.isArray(productsArray)) return rawData
    let filteredProducts = [...productsArray]

    if (filters.brands && filters.brands.length > 0) {
      const brandsArray = Array.isArray(filters.brands) ? filters.brands : [filters.brands]
      filteredProducts = filteredProducts.filter((product) => {
        const brandId = product.brand_id || product.brand?.id
        return brandsArray.some(filterBrand => String(filterBrand) === String(brandId))
      })
    }

    if (filters.categories && filters.categories.length > 0) {
      const categoriesArray = Array.isArray(filters.categories) ? filters.categories : [filters.categories]
      filteredProducts = filteredProducts.filter((product) => {
        const categoryId = product.category_id || product.category?.id
        // Convert to string for comparison to handle both number and string IDs
        return categoriesArray.some(filterCategory => String(filterCategory) === String(categoryId))
      })
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      const minPrice = filters.minPrice !== undefined ? filters.minPrice : 0
      const maxPrice = filters.maxPrice !== undefined ? filters.maxPrice : Number.POSITIVE_INFINITY

      filteredProducts = filteredProducts.filter((product: any) => {
        let price = parseFloat(product.discount_price || product.selling_price || product.base_price || 0);
        return price >= minPrice && price <= maxPrice
      })
    }


    if (sortOption !== "default") {
      filteredProducts.sort((a: any, b: any) => {
        let priceA = parseFloat(a.discount_price || a.selling_price || a.base_price || 0);
        let priceB = parseFloat(b.discount_price || b.selling_price || b.base_price || 0);
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
  }, [rawData, filters, sortOption, pagination])

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
      stock: totalStock,
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
    if (Array.isArray(data.data)) {
      return data.data
    }
    if (data.data?.products && Array.isArray(data.data.products)) {
      return data.data.products
    }
    return []
  }, [data])

  return (
    <div className="w-full mx-auto p-8 relative bg-slate-100">
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
                  <h2 className="font-semibold">Bộ lọc sản phẩm</h2>
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
            <h2 className="font-medium mb-4 text-base uppercase">Bộ lọc sản phẩm</h2>
            <ProductFilters filters={filters} onChange={handleFilterChange} />
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
                {filteredProducts.map((product, index) => {
                  // Transform product data to match ProductCard interface
                  const sellingPrice = parseFloat(product.selling_price || product.base_price || 0);
                  const discountPrice = product.discount_price ? parseFloat(product.discount_price) : null;
                  const basePrice = discountPrice || sellingPrice;

                  // Calculate discount percentage
                  let discountPercent = 0;
                  if (discountPrice && sellingPrice > discountPrice) {
                    discountPercent = Math.round(((sellingPrice - discountPrice) / sellingPrice) * 100);
                  }

                  let finalPrice = basePrice;
                  let finalDiscountPercent = discountPercent;
                  let originalPrice = sellingPrice;
                  const primaryImage = product.images?.find((img: any) => img.is_primary === 1) || product.images?.[0];
                  const imageUrl = primaryImage?.image_url || primaryImage?.imageUrl || '/images/white-image.png';

                  // Build slug
                  const slug = product.slug || product.name.toLowerCase().replace(/\s+/g, "-");
                  const productSlug = slug.includes('-') && slug.split('-').pop() === String(product.id)
                    ? slug
                    : `${slug}-${product.id}`;

                  // Get brand name
                  const brandName = product.brand_name || (typeof product.brand === 'string' ? product.brand : product.brand?.name || '');

                  // Transform to ProductCard format
                  const productCardData: Product = {
                    id: product.id,
                    name: product.name,
                    price: finalPrice,
                    originalPrice: finalDiscountPercent > 0 ? originalPrice : undefined,
                    discount: finalDiscountPercent,
                    image: imageUrl,
                    slug: productSlug,
                    brand: brandName,
                    isBestSeller: product.is_best_seller === 1 || product.isBestSeller === true,
                    isFeatured: product.is_featured === 1 || product.isFeatured === true,
                    isNew: product.is_new === 1 || product.isNew === true,
                    stock: parseInt(product.total_stock || 0),
                  };

                  return (
                    <ProductCard
                      key={product.id}
                      product={productCardData}
                      index={index}
                      onAddToCart={() => handleAddToCart(product)}
                      onQuickView={() => handleQuickView(product)}
                      onAddToWishlist={() => handleAddToWishlist(product)}
                    />
                  );
                })}
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

const ProductFilters = ({ filters, onChange }: ProductFiltersProps) => {
  const productsQuery = useProducts({ limit: 8, status: "ACTIVE" })
  const products = Array.isArray(productsQuery.data?.data) ? productsQuery.data.data : (productsQuery.data?.data?.products || [])

  const brandsQuery = useBrands({ status: "ACTIVE" })
  const categoriesQuery = useCategories({ status: "ACTIVE" })

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

  // Get brands from API
  const brands = useMemo(() => {
    if (!brandsQuery.data?.data || !Array.isArray(brandsQuery.data.data)) return []
    return brandsQuery.data.data.filter(brand => brand.status === 'ACTIVE')
  }, [brandsQuery.data])

  // Get categories from API
  const categories = useMemo(() => {
    if (!categoriesQuery.data?.data || !Array.isArray(categoriesQuery.data.data)) return []
    return categoriesQuery.data.data.filter(category => category.status === 'ACTIVE')
  }, [categoriesQuery.data])

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
    })
    toast.info("Đã đặt lại bộ lọc")
  }

  if (productsQuery.isLoading || brandsQuery.isLoading || categoriesQuery.isLoading) {
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
        <h3 className="text-sm font-semibold mb-3">Giá</h3>
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
        <h3 className="text-sm font-semibold font-medium mb-3">Thương hiệu</h3>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2">
          {brands.length > 0 ? (
            brands.map((brand) => (
              <div key={brand.id} className="flex items-center gap-2">
                <Checkbox
                  id={`brand-${brand.id}`}
                  checked={selectedBrand === String(brand.id)}
                  onCheckedChange={() => handleBrandChange(String(brand.id))}
                  className="h-5 w-5"
                />
                <label htmlFor={`brand-${brand.id}`} className="text-sm cursor-pointer font-medium">
                  {brand.name}
                </label>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 col-span-2">Không có thương hiệu nào</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Danh mục</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.id} className="flex items-center gap-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategory === String(category.id)}
                  onCheckedChange={() => handleCategoryChange(String(category.id))}
                  className="h-5 w-5"
                />
                <label htmlFor={`category-${category.id}`} className="text-sm font-medium">
                  {category.name}
                </label>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">Không có danh mục nào</p>
          )}
        </div>
      </div>
      <Button variant="outline" className="w-full" onClick={handleResetFilters}>
        Đặt lại
      </Button>
    </div>
  )
}
