# Techzone - E-commerce Management System

## Overview
Hệ thống quản lý bán hàng laptop và linh kiện máy tính toàn diện với 8 modules chức năng, sử dụng MySQL database, Express.js backend và React 18 + Vite frontend. Tất cả UI text bằng tiếng Việt.

## Current State (Updated: 2024)
**Backend**: ✅ Đã hoàn thành 3/8 modules chính (Auth, Products, Cart/Orders) với MySQL  
**Frontend**: ⚠️ Đang chạy nhưng chưa kết nối API backend  
**Database**: ✅ MySQL schema đã được thiết kế và seeded với data mẫu

## Recent Changes

### 2024-11-21: Backend Rebuild với MySQL
- **Xóa bỏ hoàn toàn** MongoDB student-info codebase cũ
- **Xây dựng lại** backend từ đầu với MySQL2, Express.js
- **Completed Modules:**
  - Module 1: Authentication (register với OTP, login, JWT, refresh token, password reset)
  - Module 2: Products & Categories (CRUD, search, filter, pagination, brands)
  - Module 3: Cart & Orders (add to cart, checkout, order management với transactions)
- **Database**: 30+ tables covering all 8 modules, seeded với 5 categories, 5 brands, 30 products, 3 stores

### Critical Fixes Applied:
1. ✅ Cart controller: Fixed const redeclaration, inventory null handling
2. ✅ Order controller: Fixed array destructuring, added store/customer validation
3. ✅ Auth: Added refresh token endpoint với dedicated verifyRefreshToken
4. ✅ JWT: Separated JWT_SECRET và JWT_REFRESH_SECRET
5. ✅ Error handling: Pre-validation before transactions

## Project Architecture

### Backend Structure (`Techzone-BE/`)
```
src/
├── config/          - Database connection (MySQL2 pool)
├── controllers/     - Business logic (auth, product, category, cart, order)
├── middleware/      - Auth, validation, error handling, rate limiting
├── routes/          - API endpoints
├── services/        - Email service, OTP service
├── validators/      - Input validation (express-validator)
└── utils/           - Response helpers, bcrypt, JWT utilities
```

### Database Schema (MySQL)
- **Users & Auth**: users, roles, otp_codes, user_login_logs
- **Products**: products, categories, brands, product_images, product_specifications, product_reviews
- **Orders**: orders, order_items, carts, cart_items
- **Inventory**: inventory, inventory_logs, stores
- **Customers**: customers

### API Endpoints
**Auth** (`/api/auth`):
- POST /request-register-otp - Gửi OTP đăng ký
- POST /register - Đăng ký với OTP verification
- POST /login - Đăng nhập
- GET /profile - Lấy thông tin user
- PUT /profile - Cập nhật profile
- POST /change-password - Đổi mật khẩu
- POST /refresh-token - Làm mới access token
- POST /request-password-reset - Gửi OTP reset password
- POST /reset-password - Đặt lại mật khẩu

**Products** (`/api/products`):
- GET / - Lấy danh sách sản phẩm (có filter, search, pagination)
- GET /:id - Chi tiết sản phẩm
- GET /best-sellers - Sản phẩm bán chạy
- GET /new-products - Sản phẩm mới
- POST / - Tạo sản phẩm (Admin/Staff only)
- PUT /:id - Cập nhật sản phẩm (Admin/Staff only)
- DELETE /:id - Xóa sản phẩm (Admin/Staff only)

**Categories** (`/api/categories`):
- GET / - Lấy danh sách danh mục
- GET /:id - Chi tiết danh mục
- GET /brands/all - Lấy danh sách thương hiệu
- POST / - Tạo danh mục (Admin only)
- PUT /:id - Cập nhật danh mục (Admin only)

**Cart** (`/api/cart`):
- GET / - Lấy giỏ hàng
- POST /add - Thêm sản phẩm vào giỏ
- PUT /items/:item_id - Cập nhật số lượng
- DELETE /items/:item_id - Xóa sản phẩm khỏi giỏ
- DELETE /clear - Xóa toàn bộ giỏ hàng

**Orders** (`/api/orders`):
- POST / - Tạo đơn hàng (checkout)
- GET /my-orders - Lấy danh sách đơn hàng của user
- GET /:id - Chi tiết đơn hàng
- PUT /:id/cancel - Hủy đơn hàng
- GET /all/list - Lấy tất cả đơn hàng (Admin/Staff)
- PUT /:id/status - Cập nhật trạng thái (Admin/Staff)

## User Preferences

### Technical Stack
- **Database**: Pure MySQL (NO ORM) - use mysql2 with raw SQL queries
- **Backend**: Express.js with ES6 modules
- **Frontend**: React 18 + Vite
- **Authentication**: JWT + OTP via email (NOT Clerk for now)
- **Language**: Tất cả UI text PHẢI bằng tiếng Việt

### Code Conventions
- Use ES6 import/export (not CommonJS require)
- Async/await for async operations
- Proper error handling với try-catch
- SQL injection prevention với parameterized queries
- Standardized API responses: `{ success, message, data }`

### Security Best Practices
- Password hashing với bcryptjs
- JWT tokens (access + refresh)
- Rate limiting cho login và OTP
- Input validation với express-validator
- SQL injection prevention
- CORS configuration

## Next Priority Tasks

### Remaining Modules (5/8)
4. **Module 4**: Inventory Management (nhập/xuất kho theo chi nhánh)
5. **Module 5**: Staff Management (CRUD nhân viên, permissions)
6. **Module 6**: Store Management (quản lý chi nhánh)
7. **Module 7**: Customer Management (CRM, classification)
8. **Module 8**: Statistics & Reports (dashboard, charts, Excel export)

### Frontend Integration
- Kết nối API backend
- Thay thế tất cả mock data bằng real API calls
- Implement authentication flow
- Vietnamese text cho toàn bộ UI

### Database & Deployment
- MySQL startup issues trong Replit environment cần giải quyết
- Deployment configuration

## Known Issues

### MySQL Server
- MySQL server không tự động start trong Replit
- Cần chạy `./start-mysql.sh` manually trước khi chạy backend
- Socket path: `/tmp/mysql.sock`

### Design Limitations
- Cart stock check: Hiện tại check tổng inventory (all stores), không theo từng chi nhánh cụ thể
  - Trade-off: User có thể add to cart thành công nhưng checkout fail nếu branch không có hàng
  - Improvement: Yêu cầu user chọn store trước khi add to cart (cần update frontend)

## Environment Variables (.env)
```
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=techzone
DB_SOCKET=/tmp/mysql.sock

# JWT
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Email (for OTP)
EMAIL_USER=techzone@example.com
EMAIL_PASSWORD=your-email-password

# Server
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5000
```

## Running the Project

### Backend
```bash
cd Techzone-BE
npm install
# Start MySQL first
./start-mysql.sh
# Seed database (first time only)
mysql -u root --socket=/tmp/mysql.sock < database/schema.sql
mysql -u root --socket=/tmp/mysql.sock < database/seed.sql
# Start server
npm run dev
```

### Frontend
```bash
cd Techzone-FE
pnpm install
pnpm run dev
```

Backend chạy trên port 3001, Frontend chạy trên port 5000.

## Project Status
- ✅ Database design & schema
- ✅ Seed data generation
- ✅ Backend core modules (3/8 completed)
- ⚠️ Clerk integration (pending)
- ❌ Remaining 5 modules
- ❌ Frontend-Backend integration
- ❌ Deployment configuration
