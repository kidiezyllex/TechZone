import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ReactQueryClientProvider } from '@/provider/ReactQueryClientProvider'
import { UserProvider } from '@/context/useUserContext'
import { ToastContainer } from 'react-toastify'
import { LazyComponentLoader } from '@/components/Common/LazyComponentLoader'


import RootLayout from '@/layouts/RootLayout'
import AdminLayout from '@/layouts/AdminLayout'


const HomePage = React.lazy(() => import('@/pages/HomePage'))
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'))
const AboutUsPage = React.lazy(() => import('@/pages/AboutUsPage'))
const LoginPage = React.lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = React.lazy(() => import('@/pages/auth/RegisterPage'))


const ProductsPage = React.lazy(() => import('@/pages/ProductsPage'))
const ProductDetailPage = React.lazy(() => import('@/pages/ProductDetailPage'))
const AccountPage = React.lazy(() => import('@/pages/AccountPage'))
const OrdersPage = React.lazy(() => import('@/pages/OrdersPage'))
const OrderDetailPage = React.lazy(() => import('@/pages/OrderDetailPage'))
const ReturnsPage = React.lazy(() => import('@/pages/ReturnsPage'))
const CheckoutShippingPage = React.lazy(() => import('@/pages/CheckoutShippingPage'))
const CheckoutSuccessPage = React.lazy(() => import('@/pages/CheckoutSuccessPage'))
const PaymentResultPage = React.lazy(() => import('@/pages/PaymentResultPage'))

const AdminDashboardPage = React.lazy(() => import('@/pages/admin/AdminDashboardPage'))
const AdminStatisticsPage = React.lazy(() => import('@/pages/admin/AdminStatisticsPage'))
const AdminLoginPage = React.lazy(() => import('@/pages/admin/AdminLoginPage'))

const AdminAccountsPage = React.lazy(() => import('@/pages/admin/AdminAccountsPage'))
const AdminAccountCreatePage = React.lazy(() => import('@/pages/admin/AdminAccountCreatePage'))
const AdminAccountEditPage = React.lazy(() => import('@/pages/admin/AdminAccountEditPage'))

const AdminDiscountsPage = React.lazy(() => import('@/pages/admin/AdminDiscountsPage'))
const AdminPromotionsPage = React.lazy(() => import('@/pages/admin/AdminPromotionsPage'))
const AdminPromotionCreatePage = React.lazy(() => import('@/pages/admin/AdminPromotionCreatePage'))
const AdminPromotionEditPage = React.lazy(() => import('@/pages/admin/AdminPromotionEditPage'))
const AdminVouchersPage = React.lazy(() => import('@/pages/admin/AdminVouchersPage'))
const AdminVoucherCreatePage = React.lazy(() => import('@/pages/admin/AdminVoucherCreatePage'))
const AdminVoucherEditPage = React.lazy(() => import('@/pages/admin/AdminVoucherEditPage'))

const AdminOrdersPage = React.lazy(() => import('@/pages/admin/AdminOrdersPage'))
const AdminOrderDetailPage = React.lazy(() => import('@/pages/admin/AdminOrderDetailPage'))
const AdminOrderCreatePage = React.lazy(() => import('@/pages/admin/AdminOrderCreatePage'))
const AdminOrderEditPage = React.lazy(() => import('@/pages/admin/AdminOrderEditPage'))

const AdminPosPage = React.lazy(() => import('@/pages/admin/AdminPosPage'))

const AdminProductsPage = React.lazy(() => import('@/pages/admin/AdminProductsPage'))
const AdminProductBrandsPage = React.lazy(() => import('@/pages/admin/AdminProductBrandsPage'))
const AdminProductCategoriesPage = React.lazy(() => import('@/pages/admin/AdminProductCategoriesPage'))
const AdminProductColorsPage = React.lazy(() => import('@/pages/admin/AdminProductColorsPage'))
const AdminProductCreatePage = React.lazy(() => import('@/pages/admin/AdminProductCreatePage'))
const AdminProductEditPage = React.lazy(() => import('@/pages/admin/AdminProductEditPage'))
const AdminProductMaterialsPage = React.lazy(() => import('@/pages/admin/AdminProductMaterialsPage'))
const AdminProductSizesPage = React.lazy(() => import('@/pages/admin/AdminProductSizesPage'))

const AdminReturnsPage = React.lazy(() => import('@/pages/admin/AdminReturnsPage'))
const AdminReturnCreatePage = React.lazy(() => import('@/pages/admin/AdminReturnCreatePage'))
const AdminReturnEditPage = React.lazy(() => import('@/pages/admin/AdminReturnEditPage'))

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="text-sm text-muted-foreground animate-pulse">Đang tải trang...</p>
    </div>
  </div>
)

function App() {
  return (
    <ReactQueryClientProvider>
      <Router>
        <UserProvider>
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            limit={3}
          />
          <Routes>
            { }
            <Route path="/" element={<RootLayout />}>
              <Route index element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <HomePage />
                </LazyComponentLoader>
              } />
              <Route path="about-us" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <AboutUsPage />
                </LazyComponentLoader>
              } />
              <Route path="account" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <AccountPage />
                </LazyComponentLoader>
              } />
              <Route path="products" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <ProductsPage />
                </LazyComponentLoader>
              } />
              <Route path="products/:slug" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <ProductDetailPage />
                </LazyComponentLoader>
              } />
              <Route path="account" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <AccountPage />
                </LazyComponentLoader>
              } />
              <Route path="orders" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <OrdersPage />
                </LazyComponentLoader>
              } />
              <Route path="orders/:id" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <OrderDetailPage />
                </LazyComponentLoader>
              } />
              <Route path="returns" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <ReturnsPage />
                </LazyComponentLoader>
              } />
              <Route path="checkout/shipping" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <CheckoutShippingPage />
                </LazyComponentLoader>
              } />
              <Route path="checkout/success" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <CheckoutSuccessPage />
                </LazyComponentLoader>
              } />
              <Route path="payment-result" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <PaymentResultPage />
                </LazyComponentLoader>
              } />
            </Route>

            { }
            <Route path="auth/login/*" element={
              <LazyComponentLoader fallback={<PageLoader />}>
                <LoginPage />
              </LazyComponentLoader>
            } />
            <Route path="auth/register/*" element={
              <LazyComponentLoader fallback={<PageLoader />}>
                <RegisterPage />
              </LazyComponentLoader>
            } />

            { }
            <Route
              path="admin/login"
              element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <AdminLoginPage />
                </LazyComponentLoader>
              }
            />

            { }
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <AdminDashboardPage />
                </LazyComponentLoader>
              } />
              <Route path="statistics" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <AdminStatisticsPage />
                </LazyComponentLoader>
              } />

              { }
              <Route path="accounts" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <AdminAccountsPage />
                </LazyComponentLoader>
              } />
              <Route path="accounts/create" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <AdminAccountCreatePage />
                </LazyComponentLoader>
              } />
              <Route path="accounts/edit/:id" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <AdminAccountEditPage />
                </LazyComponentLoader>
              } />

              { }
              <Route path="discounts" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <AdminDiscountsPage />
                </LazyComponentLoader>
              } />
              <Route path="discounts/promotions" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <AdminPromotionsPage />
                </LazyComponentLoader>
              } />
              <Route path="discounts/promotions/create" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <AdminPromotionCreatePage />
                </LazyComponentLoader>
              } />
              <Route path="discounts/promotions/edit/:id" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <AdminPromotionEditPage />
                </LazyComponentLoader>
              } />
              <Route path="discounts/vouchers" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <AdminVouchersPage />
                </LazyComponentLoader>
              } />
              <Route path="discounts/vouchers/create" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <AdminVoucherCreatePage />
                </LazyComponentLoader>
              } />
              <Route path="discounts/vouchers/edit/:id" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <AdminVoucherEditPage />
                </LazyComponentLoader>
              } />

              { }
              <Route path="orders" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <AdminOrdersPage />
                </LazyComponentLoader>
              } />
              <Route path="orders/:orderId" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <AdminOrderDetailPage />
                </LazyComponentLoader>
              } />
              <Route path="orders/create" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <AdminOrderCreatePage />
                </LazyComponentLoader>
              } />
              <Route path="orders/edit/:id" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <AdminOrderEditPage />
                </LazyComponentLoader>
              } />

              { }
              <Route path="pos" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <AdminPosPage />
                </LazyComponentLoader>
              } />

              { }
              <Route path="products" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <AdminProductsPage />
                </LazyComponentLoader>
              } />
              <Route path="products/brands" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <AdminProductBrandsPage />
                </LazyComponentLoader>
              } />
              <Route path="products/categories" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <AdminProductCategoriesPage />
                </LazyComponentLoader>
              } />
              <Route path="products/colors" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <AdminProductColorsPage />
                </LazyComponentLoader>
              } />
              <Route path="products/create" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <AdminProductCreatePage />
                </LazyComponentLoader>
              } />
              <Route path="products/edit/:id" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <AdminProductEditPage />
                </LazyComponentLoader>
              } />
              <Route path="products/materials" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <AdminProductMaterialsPage />
                </LazyComponentLoader>
              } />
              <Route path="products/sizes" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <AdminProductSizesPage />
                </LazyComponentLoader>
              } />

              { }
              <Route path="returns" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <AdminReturnsPage />
                </LazyComponentLoader>
              } />
              <Route path="returns/create" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <AdminReturnCreatePage />
                </LazyComponentLoader>
              } />
              <Route path="returns/edit/:id" element={
                <LazyComponentLoader fallback={<PageLoader />}>
                  <AdminReturnEditPage />
                </LazyComponentLoader>
              } />
            </Route>

            { }
            <Route path="*" element={
              <LazyComponentLoader fallback={<PageLoader />}>
                <NotFoundPage />
              </LazyComponentLoader>
            } />
          </Routes>
        </UserProvider>
      </Router>
    </ReactQueryClientProvider>
  )
}

export default App