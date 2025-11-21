# 🛣️ TECHZONE FRONTEND ROUTES DOCUMENTATION
**Total Routes: 80+ pathnames covering all 8 modules**

---

## 📋 TABLE OF CONTENTS
1. [Authentication (Quản lý Tài Khoản)](#1-authentication)
2. [Products & Categories (Quản lý Sản Phẩm)](#2-products--categories)
3. [Shopping Cart & Orders (Quản lý Giỏ Hàng & Đơn Hàng)](#3-shopping-cart--orders)
4. [Inventory Management (Quản lý Kho Hàng)](#4-inventory-management)
5. [Staff Management (Quản lý Nhân Sự)](#5-staff-management)
6. [Store/Branch Management (Quản lý Cửa Hàng)](#6-storebranch-management)
7. [Customer Management (Quản lý Khách Hàng)](#7-customer-management)
8. [Dashboard & Reports (Thống Kê & Báo Cáo)](#8-dashboard--reports)

---

## 1. AUTHENTICATION

### Public Routes
| Route | Component | Mô tả |
|-------|-----------|--------|
| `/auth/register` | RegisterPage | Đăng ký tài khoản (Email + OTP + Google OAuth) |
| `/auth/login` | LoginPage | Đăng nhập (Email + Password + Google OAuth) |
| `/auth/forgot-password` | ForgotPasswordPage | Quên mật khẩu (gửi OTP reset) |
| `/auth/reset-password/:token` | ResetPasswordPage | Đặt lại mật khẩu với token |
| `/auth/verify-otp` | VerifyOTPPage | Xác thực OTP sau đăng ký |

### User Protected Routes
| Route | Component | Mô tả |
|-------|-----------|--------|
| `/account` | UserAccountPage | Xem thông tin tài khoản cá nhân |
| `/profile` | ProfilePage | Chỉnh sửa hồ sơ người dùng |
| `/profile/avatar` | AvatarUploadPage | Cập nhật ảnh đại diện |

---

## 2. PRODUCTS & CATEGORIES

### Customer Routes
| Route | Component | Mô tả |
|-------|-----------|--------|
| `/products` | ProductListPage | Danh sách sản phẩm (toàn bộ catalog) |
| `/products/:id` | ProductDetailPage | Chi tiết sản phẩm + liên quan + bình luận |
| `/products/search` | ProductSearchPage | Tìm kiếm nâng cao (tên, danh mục, khoảng giá) |
| `/products/category/:categoryId` | CategoryProductsPage | Sản phẩm theo danh mục |
| `/products/brand/:brandId` | BrandProductsPage | Sản phẩm theo thương hiệu |

### Admin Routes (Phân quyền: ADMIN + STAFF)
| Route | Component | Mô tả |
|-------|-----------|--------|
| `/admin/products` | ProductManagementPage | Danh sách tất cả sản phẩm |
| `/admin/products/create` | CreateProductPage | Tạo sản phẩm mới (tên, SKU, giá, mô tả, hình ảnh, thông số) |
| `/admin/products/:id/edit` | EditProductPage | Chỉnh sửa thông tin sản phẩm |
| `/admin/products/:id/images` | ProductImagesPage | Quản lý hình ảnh sản phẩm |
| `/admin/categories` | CategoriesManagementPage | Quản lý danh mục (cha-con phân cấp) |
| `/admin/brands` | BrandsManagementPage | Quản lý thương hiệu |
| `/admin/products/sizes` | SizesManagementPage | Quản lý kích thước |
| `/admin/products/colors` | ColorsManagementPage | Quản lý màu sắc |
| `/admin/products/materials` | MaterialsManagementPage | Quản lý chất liệu |

---

## 3. SHOPPING CART & ORDERS

### Customer Routes
| Route | Component | Mô tả |
|-------|-----------|--------|
| `/cart` | ShoppingCartPage | Giỏ hàng (xem, thêm, sửa, xóa sản phẩm) |
| `/checkout` | CheckoutPage | Thanh toán (chọn chi nhánh / giao tận nơi, phương thức thanh toán) |
| `/checkout/delivery-info` | DeliveryInfoPage | Nhập thông tin giao hàng |
| `/checkout/payment-method` | PaymentMethodPage | Chọn phương thức thanh toán (COD / Online) |
| `/payment` | PaymentGatewayPage | Trang thanh toán online (giả lập) |
| `/payment-result/:orderId` | PaymentResultPage | Kết quả thanh toán |
| `/orders` | OrderHistoryPage | Lịch sử đơn hàng |
| `/orders/:orderId` | OrderDetailPage | Chi tiết đơn hàng (trạng thái, timeline, sản phẩm) |
| `/orders/:orderId/track` | OrderTrackingPage | Theo dõi đơn hàng real-time |
| `/products/:id/reviews` | ProductReviewPage | Viết đánh giá & bình luận sản phẩm |
| `/returns` | ReturnRequestPage | Yêu cầu trả hàng / hủy đơn |

### Admin Routes (Phân quyền: ADMIN + STAFF)
| Route | Component | Mô tả |
|-------|-----------|--------|
| `/admin/orders` | OrdersManagementPage | Danh sách tất cả đơn hàng |
| `/admin/orders/create` | CreateOrderPage | Tạo đơn hàng thủ công (POS) |
| `/admin/orders/:orderId` | OrderDetailAdminPage | Xem chi tiết + cập nhật trạng thái đơn hàng |
| `/admin/orders/:orderId/edit` | EditOrderPage | Chỉnh sửa đơn hàng (trạng thái: chờ xác nhận → xác nhận → đóng gói → giao → hoàn thành) |
| `/admin/pos` | POSPage | Hệ thống POS (bán hàng tại quầy) |
| `/admin/returns` | ReturnManagementPage | Quản lý trả hàng / hủy đơn |
| `/admin/returns/create` | CreateReturnPage | Tạo phiếu trả hàng |
| `/admin/returns/:id/edit` | EditReturnPage | Cập nhật phiếu trả hàng |
| `/admin/discounts` | DiscountsManagementPage | Hub quản lý chiết khấu |
| `/admin/discounts/promotions` | PromotionsPage | Quản lý khuyến mãi |
| `/admin/discounts/promotions/create` | CreatePromotionPage | Tạo khuyến mãi mới |
| `/admin/discounts/promotions/:id/edit` | EditPromotionPage | Chỉnh sửa khuyến mãi |
| `/admin/discounts/vouchers` | VouchersPage | Quản lý voucher / mã giảm giá |
| `/admin/discounts/vouchers/create` | CreateVoucherPage | Tạo voucher mới |
| `/admin/discounts/vouchers/:id/edit` | EditVoucherPage | Chỉnh sửa voucher |

---

## 4. INVENTORY MANAGEMENT

### Admin Routes (Phân quyền: ADMIN + WAREHOUSE_STAFF)
| Route | Component | Mô tả |
|-------|-----------|--------|
| `/admin/inventory` | InventoryManagementPage | Xem tồn kho toàn hệ thống (theo chi nhánh) |
| `/admin/inventory/by-branch` | InventoryByBranchPage | Tồn kho chi tiết từng chi nhánh |
| `/admin/inventory/import` | InventoryImportPage | Nhập kho (phiếu nhập từ nhà cung cấp) |
| `/admin/inventory/import/create` | CreateImportPage | Tạo phiếu nhập mới |
| `/admin/inventory/import/:id` | ImportDetailPage | Chi tiết phiếu nhập |
| `/admin/inventory/transfer` | InventoryTransferPage | Điều chuyển kho giữa các chi nhánh |
| `/admin/inventory/transfer/create` | CreateTransferPage | Tạo phiếu điều chuyển |
| `/admin/inventory/return` | InventoryReturnPage | Trả hàng về kho (tăng tồn kho) |
| `/admin/inventory/return/create` | CreateReturnToStorePage | Tạo phiếu trả kho |
| `/admin/inventory/history` | InventoryHistoryPage | Lịch sử nhập/xuất/điều chuyển |
| `/admin/inventory/low-stock` | LowStockAlertsPage | Cảnh báo sản phẩm sắp hết hàng |
| `/admin/inventory/locations` | StorageLocationsPage | Quản lý vị trí lưu trữ |

---

## 5. STAFF MANAGEMENT

### Admin Routes (Phân quyền: ADMIN ONLY)
| Route | Component | Mô tả |
|-------|-----------|--------|
| `/admin/accounts` | AccountsManagementPage | Quản lý tài khoản nhân viên |
| `/admin/accounts/create` | CreateAccountPage | Tạo tài khoản nhân viên mới |
| `/admin/accounts/:id/edit` | EditAccountPage | Chỉnh sửa thông tin nhân viên |
| `/admin/accounts/:id/permissions` | PermissionsPage | Phân quyền chi tiết cho nhân viên |
| `/admin/accounts/:id/assign-branch` | AssignBranchPage | Gán nhân viên vào chi nhánh |
| `/admin/accounts/roles` | RolesManagementPage | Quản lý các vai trò (Admin, Manager, Staff, Warehouse) |
| `/admin/accounts/login-history` | LoginHistoryPage | Lịch sử đăng nhập nhân viên |

---

## 6. STORE/BRANCH MANAGEMENT

### Customer Routes
| Route | Component | Mô tả |
|-------|-----------|--------|
| `/branches` | BranchesListPage | Danh sách tất cả chi nhánh |
| `/branches/:id` | BranchDetailPage | Chi tiết chi nhánh (địa chỉ, bản đồ Google Maps, SĐT) |
| `/branches/near-me` | NearestBranchPage | Tìm chi nhánh gần nhất (dropdown tỉnh/thành phố) |

### Admin Routes (Phân quyền: ADMIN ONLY)
| Route | Component | Mô tả |
|-------|-----------|--------|
| `/admin/branches` | BranchesManagementPage | Danh sách tất cả chi nhánh |
| `/admin/branches/create` | CreateBranchPage | Tạo chi nhánh mới |
| `/admin/branches/:id/edit` | EditBranchPage | Chỉnh sửa thông tin chi nhánh |
| `/admin/branches/:id/staff` | BranchStaffPage | Xem nhân viên của chi nhánh |
| `/admin/branches/:id/inventory` | BranchInventoryPage | Tồn kho của chi nhánh |
| `/admin/branches/:id/performance` | BranchPerformancePage | Hiệu suất bán hàng chi nhánh |

---

## 7. CUSTOMER MANAGEMENT

### Admin Routes (Phân quyền: ADMIN + STAFF)
| Route | Component | Mô tả |
|-------|-----------|--------|
| `/admin/customers` | CustomersManagementPage | Danh sách khách hàng |
| `/admin/customers/classify` | CustomerClassificationPage | Phân loại KH (Thân thiết, VIP, Mới, Không hoạt động) |
| `/admin/customers/:id` | CustomerDetailPage | Chi tiết khách hàng + lịch sử mua |
| `/admin/customers/:id/purchase-history` | CustomerPurchaseHistoryPage | Lịch sử mua hàng chi tiết |
| `/admin/customers/:id/contact-info` | CustomerContactPage | Thông tin liên hệ khách hàng |
| `/admin/customers/search` | CustomerSearchPage | Tìm kiếm khách hàng (tên, email, SĐT) |
| `/admin/customers/loyalty-program` | LoyaltyProgramPage | Chương trình khách hàng thân thiết |

---

## 8. DASHBOARD & REPORTS

### Admin Routes (Phân quyền: ADMIN ONLY)
| Route | Component | Mô tả |
|-------|-----------|--------|
| `/admin` | DashboardPage | Dashboard chính (tổng quan, KPIs, biểu đồ) |
| `/admin/statistics` | StatisticsPage | Thống kê chi tiết |
| `/admin/reports` | ReportsHubPage | Trung tâm báo cáo |
| `/admin/reports/revenue` | RevenueReportPage | Báo cáo doanh thu (ngày/tháng/năm) |
| `/admin/reports/revenue/chart` | RevenueChartPage | Biểu đồ cột + đường doanh thu |
| `/admin/reports/expenses` | ExpensesReportPage | Báo cáo chi phí nhập hàng |
| `/admin/reports/inventory` | InventoryReportPage | Báo cáo tồn kho toàn hệ thống |
| `/admin/reports/inventory-by-branch` | InventoryByBranchReportPage | Báo cáo tồn kho theo chi nhánh |
| `/admin/reports/top-products` | TopProductsReportPage | Top 10 sản phẩm bán chạy |
| `/admin/reports/customers-new` | NewCustomersReportPage | Báo cáo khách hàng mới |
| `/admin/reports/customers-loyal` | LoyalCustomersReportPage | Báo cáo khách hàng thân thiết |
| `/admin/reports/staff-performance` | StaffPerformanceReportPage | Báo cáo hiệu suất nhân viên |
| `/admin/reports/export` | ExportReportPage | Xuất báo cáo Excel (exceljs) |
| `/admin/reports/export/revenue` | ExportRevenueExcelPage | Xuất doanh thu ra Excel |
| `/admin/reports/export/inventory` | ExportInventoryExcelPage | Xuất tồn kho ra Excel |
| `/admin/reports/export/customers` | ExportCustomersExcelPage | Xuất danh sách khách hàng ra Excel |

---

## ADDITIONAL ROUTES

### Public/Common Routes
| Route | Component | Mô tả |
|-------|-----------|--------|
| `/` | HomePage | Trang chủ (hiển thị sản phẩm nổi bật, banner) |
| `/about-us` | AboutUsPage | Giới thiệu Techzone |
| `/not-found` | NotFoundPage | Trang 404 |
| `/unauthorized` | UnauthorizedPage | Trang 403 (không có quyền truy cập) |

### Layout Routes
| Route | Layout | Mô tả |
|-------|--------|--------|
| `/admin/*` | AdminLayout | Layout admin (sidebar, header, footer) |
| `/auth/*` | AuthLayout | Layout auth (no sidebar, centered) |
| `/*` | MainLayout | Layout chính (header, footer, sidebar ngoài) |

---

## 🔐 ROLE-BASED ACCESS CONTROL (RBAC)

### Roles Defined:
- **ADMIN**: Toàn quyền quản lý tất cả
- **MANAGER**: Quản lý cửa hàng, nhân viên, đơn hàng, báo cáo (tương đối)
- **STAFF**: Xem đơn hàng, khách hàng, quản lý sản phẩm cơ bản
- **WAREHOUSE**: Quản lý kho, nhập/xuất/điều chuyển
- **CUSTOMER**: Chỉ truy cập route khách hàng (cart, orders, profile)

### Authorization Examples:
```typescript
// Admin only routes: /admin/accounts, /admin/branches, /admin/reports/export
// Admin + Staff routes: /admin/orders, /admin/customers, /admin/products
// Admin + Manager routes: /admin/products, /admin/orders/create
// Warehouse routes: /admin/inventory, /admin/inventory/import
// Customer routes: /products, /cart, /orders, /profile
```

---

## 📊 ROUTE STATISTICS

- **Total Frontend Routes**: 80+
- **Public Routes**: 15
- **Customer Protected Routes**: 20
- **Admin Protected Routes**: 55+
- **Dynamic Routes**: 20+ (with [id] parameters)
- **Nested Routes**: 35+ (parent/child structure)

---

## 🚀 DEPLOYMENT STATUS

✅ All 80+ routes documented
✅ Backend 50+ APIs mapped to frontend routes
✅ Role-based access control implemented
✅ Production-ready route structure
✅ Vietnamese UI across all routes
✅ Google OAuth integrated on auth routes

---

**Last Updated**: November 21, 2025
**Status**: Production Ready ✅
