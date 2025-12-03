# Báo Cáo API Documentation

Tài liệu này mô tả các API báo cáo hiện có trong hệ thống Techzone.

## 1. Báo Cáo Doanh Thu (Revenue Reports)

### 1.1. Báo cáo doanh thu theo chi nhánh
- **Method**: `GET`
- **Route**: `/api/stats/revenue/by-store`
- **Authentication**: Required (Bearer Token)
- **Authorization**: Admin, Manager, Staff
- **Query Parameters**: Không có
- **Payload**: Không có
- **Response JSON**:
```json
{
  "success": true,
  "message": "Lấy thống kê doanh thu theo chi nhánh thành công",
  "data": [
    {
      "id": 1,
      "name": "Techzone Quận 1",
      "revenue": 50000000.00,
      "order_count": 25,
      "product_count": 150
    }
  ]
}
```

### 1.2. Báo cáo doanh thu theo danh mục
- **Method**: `GET`
- **Route**: `/api/stats/revenue/by-category`
- **Authentication**: Required (Bearer Token)
- **Authorization**: Admin, Manager, Staff
- **Query Parameters**: Không có
- **Payload**: Không có
- **Response JSON**:
```json
{
  "success": true,
  "message": "Lấy thống kê doanh thu theo danh mục thành công",
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "revenue": 30000000.00,
      "quantity_sold": 15,
      "orders": 10
    }
  ]
}
```

### 1.3. Báo cáo doanh thu theo thời gian
- **Method**: `GET`
- **Route**: `/api/stats/revenue/over-time`
- **Authentication**: Required (Bearer Token)
- **Authorization**: Admin, Manager, Staff
- **Query Parameters**:
  - `period` (optional): `day` | `month` | `year` (default: `day`)
  - `store_id` (optional): integer
- **Payload**: Không có
- **Response JSON**:
```json
{
  "success": true,
  "message": "Lấy thống kê doanh thu theo thời gian thành công",
  "data": [
    {
      "period": "2024-11-01",
      "revenue": 5000000.00,
      "orders": 5
    }
  ]
}
```

### 1.4. Dashboard tổng quan (bao gồm doanh thu)
- **Method**: `GET`
- **Route**: `/api/stats/dashboard`
- **Authentication**: Required (Bearer Token)
- **Authorization**: Admin, Manager, Staff
- **Query Parameters**:
  - `store_id` (optional): integer
  - `from_date` (optional): date string (YYYY-MM-DD)
  - `to_date` (optional): date string (YYYY-MM-DD)
- **Payload**: Không có
- **Response JSON**:
```json
{
  "success": true,
  "message": "Lấy thống kê dashboard thành công",
  "data": {
    "total_revenue": 100000000.00,
    "total_orders": 50,
    "new_customers": 10,
    "top_products": [
      {
        "id": 1,
        "name": "Dell Latitude 5420",
        "total_sold": 25,
        "revenue": 50000000.00
      }
    ]
  }
}
```

## 2. Báo Cáo Chi Phí (Cost Reports)

### 2.1. Báo cáo chi phí nhập hàng
- **Method**: `GET`
- **Route**: `/api/stats/cost`
- **Authentication**: Required (Bearer Token)
- **Authorization**: Admin, Manager, Staff
- **Query Parameters**:
  - `store_id` (optional): integer
  - `from_date` (optional): date string (YYYY-MM-DD)
  - `to_date` (optional): date string (YYYY-MM-DD)
  - `period` (optional): `day` | `month` | `year` (default: `day`)
- **Payload**: Không có
- **Response JSON**:
```json
{
  "success": true,
  "message": "Lấy báo cáo chi phí thành công",
  "data": {
    "summary": [
      {
        "period": "2024-11-01",
        "store_id": 1,
        "store_name": "Techzone Quận 1",
        "purchase_count": 2,
        "total_cost": 75000000.00,
        "received_count": 2,
        "pending_count": 0,
        "cancelled_count": 0
      }
    ],
    "top_products": [
      {
        "id": 1,
        "name": "Dell Latitude 5420",
        "sku": "DELL-LAT-5420",
        "total_quantity_purchased": 10,
        "total_cost": 150000000.00,
        "avg_purchase_price": 15000000.00,
        "purchase_times": 1
      }
    ]
  }
}
```

### 2.2. Xuất báo cáo tổng hợp (có thể bao gồm chi phí)
- **Method**: `GET`
- **Route**: `/api/stats/export`
- **Authentication**: Required (Bearer Token)
- **Authorization**: Admin, Manager, Staff
- **Query Parameters**:
  - `report_type`: `sales` | `inventory` (default: `sales`)
  - `from_date` (optional): date string
  - `to_date` (optional): date string
  - `store_id` (optional): integer
- **Payload**: Không có
- **Response JSON** (khi report_type=sales):
```json
{
  "success": true,
  "message": "Xuất báo cáo thành công",
  "data": {
    "orders": [
      {
        "id": 1,
        "total_amount": 19040000.00,
        "status": "completed",
        "created_at": "2024-11-01T00:00:00.000Z",
        "payment_method": "online",
        "store_name": "Techzone Quận 1",
        "customer_name": "Nguyễn Thị Hương"
      }
    ]
  }
}
```

## 3. Báo Cáo Tồn Kho (Inventory Reports)

### 3.1. Danh sách tồn kho theo chi nhánh
- **Method**: `GET`
- **Route**: `/api/inventory/by-store`
- **Authentication**: Required (Bearer Token)
- **Authorization**: Admin, Manager, Staff
- **Query Parameters**:
  - `store_id` (required): integer
  - `page` (optional): integer (default: 1)
  - `limit` (optional): integer (default: 20)
  - `search` (optional): string
- **Payload**: Không có
- **Response JSON**:
```json
{
  "success": true,
  "message": "Lấy danh sách kho thành công",
  "data": [
    {
      "id": 1,
      "product_id": 1,
      "store_id": 1,
      "quantity": 15,
      "reorder_level": 10,
      "last_restocked": "2024-11-28T00:00:00.000Z",
      "name": "Dell Latitude 5420",
      "sku": "DELL-LAT-5420",
      "price": 18990000.00,
      "category_name": "Laptop",
      "store_name": "Techzone Quận 1"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

### 3.2. Sản phẩm cần nhập kho (stock thấp)
- **Method**: `GET`
- **Route**: `/api/inventory/low-stock`
- **Authentication**: Required (Bearer Token)
- **Authorization**: Admin, Manager, Staff
- **Query Parameters**:
  - `store_id` (required): integer
- **Payload**: Không có
- **Response JSON**:
```json
{
  "success": true,
  "message": "Danh sách sản phẩm cần nhập kho",
  "data": [
    {
      "id": 1,
      "product_id": 1,
      "quantity": 5,
      "reorder_level": 10,
      "name": "Dell Latitude 5420",
      "sku": "DELL-LAT-5420",
      "price": 18990000.00,
      "category_name": "Laptop"
    }
  ]
}
```

### 3.3. Lịch sử nhập/xuất kho
- **Method**: `GET`
- **Route**: `/api/inventory/logs`
- **Authentication**: Required (Bearer Token)
- **Authorization**: Admin, Manager, Staff
- **Query Parameters**:
  - `store_id` (optional): integer
  - `product_id` (optional): integer
  - `page` (optional): integer (default: 1)
  - `limit` (optional): integer (default: 20)
- **Payload**: Không có
- **Response JSON**:
```json
{
  "success": true,
  "message": "Lấy danh sách nhật ký kho thành công",
  "data": [
    {
      "id": 1,
      "product_id": 1,
      "store_id": 1,
      "type": "import",
      "quantity": 10,
      "created_at": "2024-11-28T00:00:00.000Z",
      "product_name": "Dell Latitude 5420",
      "store_name": "Techzone Quận 1"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### 3.4. Xuất báo cáo tồn kho
- **Method**: `GET`
- **Route**: `/api/stats/export?report_type=inventory`
- **Authentication**: Required (Bearer Token)
- **Authorization**: Admin, Manager, Staff
- **Query Parameters**:
  - `report_type`: `inventory` (required)
  - `store_id` (optional): integer
- **Payload**: Không có
- **Response JSON**:
```json
{
  "success": true,
  "message": "Xuất báo cáo thành công",
  "data": {
    "inventory": [
      {
        "id": 1,
        "name": "Dell Latitude 5420",
        "sku": "DELL-LAT-5420",
        "quantity": 15,
        "reorder_level": 10,
        "store_name": "Techzone Quận 1",
        "price": 18990000.00,
        "inventory_value": 284850000.00
      }
    ]
  }
}
```

## 4. Báo Cáo Khách Hàng và Đánh Giá (Customer & Review Reports)

### 4.1. Danh sách khách hàng
- **Method**: `GET`
- **Route**: `/api/customers`
- **Authentication**: Required (Bearer Token)
- **Authorization**: Admin, Manager, Staff
- **Query Parameters**:
  - `page` (optional): integer (default: 1)
  - `limit` (optional): integer (default: 20)
  - `search` (optional): string
  - `sort_by` (optional): `total_spent` | `total_orders` | `created_at` (default: `total_spent`)
- **Payload**: Không có
- **Response JSON**:
```json
{
  "success": true,
  "message": "Lấy danh sách khách hàng thành công",
  "data": [
    {
      "id": 1,
      "user_id": 6,
      "classification": "vip",
      "total_orders": 25,
      "total_spent": 125000000.00,
      "last_order_date": "2024-11-14T00:00:00.000Z",
      "notes": null,
      "email": "customer1@gmail.com",
      "full_name": "Nguyễn Thị Hương",
      "phone": "0906789012"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

### 4.2. Danh sách khách hàng VIP
- **Method**: `GET`
- **Route**: `/api/customers/vip/list`
- **Authentication**: Required (Bearer Token)
- **Authorization**: Admin, Manager, Staff
- **Query Parameters**:
  - `limit` (optional): integer (default: 10)
- **Payload**: Không có
- **Response JSON**:
```json
{
  "success": true,
  "message": "Lấy danh sách khách hàng VIP thành công",
  "data": [
    {
      "id": 1,
      "user_id": 6,
      "classification": "vip",
      "total_orders": 25,
      "total_spent": 125000000.00,
      "email": "customer1@gmail.com",
      "full_name": "Nguyễn Thị Hương",
      "phone": "0906789012"
    }
  ]
}
```

### 4.3. Chi tiết khách hàng
- **Method**: `GET`
- **Route**: `/api/customers/:id`
- **Authentication**: Required (Bearer Token)
- **Authorization**: Admin, Manager, Staff
- **Query Parameters**: Không có
- **Payload**: Không có
- **Response JSON**:
```json
{
  "success": true,
  "message": "Lấy chi tiết khách hàng thành công",
  "data": {
    "id": 1,
    "user_id": 6,
    "classification": "vip",
    "total_orders": 25,
    "total_spent": 125000000.00,
    "email": "customer1@gmail.com",
    "full_name": "Nguyễn Thị Hương",
    "phone": "0906789012",
    "order_count": 25,
    "completed_orders": 20,
    "recent_orders": [
      {
        "id": 1,
        "total_amount": 19040000.00,
        "status": "completed",
        "created_at": "2024-11-01T00:00:00.000Z"
      }
    ]
  }
}
```

### 4.4. Báo cáo đơn hàng theo trạng thái
- **Method**: `GET`
- **Route**: `/api/stats/orders/by-status`
- **Authentication**: Required (Bearer Token)
- **Authorization**: Admin, Manager, Staff
- **Query Parameters**:
  - `store_id` (optional): integer
- **Payload**: Không có
- **Response JSON**:
```json
{
  "success": true,
  "message": "Lấy thống kê đơn hàng theo trạng thái thành công",
  "data": [
    {
      "status": "completed",
      "count": 30,
      "revenue": 500000000.00
    },
    {
      "status": "pending",
      "count": 5,
      "revenue": 10000000.00
    }
  ]
}
```

### 4.5. Thống kê đánh giá sản phẩm
- **Method**: `GET`
- **Route**: `/api/stats/reviews`
- **Authentication**: Required (Bearer Token)
- **Authorization**: Admin, Manager, Staff
- **Query Parameters**:
  - `product_id` (optional): integer
  - `from_date` (optional): date string (YYYY-MM-DD)
  - `to_date` (optional): date string (YYYY-MM-DD)
  - `min_rating` (optional): integer (1-5)
- **Payload**: Không có
- **Response JSON**:
```json
{
  "success": true,
  "message": "Lấy thống kê đánh giá thành công",
  "data": {
    "summary": {
      "total_reviews": 30,
      "avg_rating": "4.50",
      "rating_5": 15,
      "rating_4": 10,
      "rating_3": 3,
      "rating_2": 1,
      "rating_1": 1,
      "verified_reviews": 25
    },
    "top_products": [
      {
        "id": 22,
        "name": "Asus TUF Gaming VG27AQ 27 inch",
        "sku": "ASUS-VG27AQ-27",
        "review_count": 5,
        "avg_rating": "5.00",
        "five_star_count": 5,
        "verified_count": 5
      }
    ],
    "time_series": [
      {
        "date": "2024-11-24",
        "review_count": 2,
        "avg_rating": "5.00"
      }
    ],
    "recent_reviews": [
      {
        "id": 15,
        "product_id": 22,
        "user_id": 10,
        "rating": 5,
        "comment": "Màn hình gaming tuyệt vời lần 2! Đã mua thêm 1 cái nữa.",
        "is_verified": 1,
        "created_at": "2024-12-04T00:00:00.000Z",
        "product_name": "Asus TUF Gaming VG27AQ 27 inch",
        "user_name": "Vũ Thị Ngọc"
      }
    ]
  }
}
```

## 5. Báo Cáo Lợi Nhuận (Profit Reports)

### 5.1. Báo cáo lợi nhuận (Revenue - Cost)
- **Method**: `GET`
- **Route**: `/api/stats/profit`
- **Authentication**: Required (Bearer Token)
- **Authorization**: Admin, Manager, Staff
- **Query Parameters**:
  - `store_id` (optional): integer
  - `from_date` (optional): date string (YYYY-MM-DD)
  - `to_date` (optional): date string (YYYY-MM-DD)
  - `period` (optional): `day` | `month` | `year` (default: `day`)
- **Payload**: Không có
- **Response JSON**:
```json
{
  "success": true,
  "message": "Lấy báo cáo lợi nhuận thành công",
  "data": {
    "data": [
      {
        "period": "2024-11-01",
        "store_id": 1,
        "revenue": 19040000.00,
        "cost": 15000000.00,
        "profit": 4040000.00,
        "profit_margin": "21.22",
        "order_count": 1
      }
    ],
    "totals": {
      "total_revenue": 150000000.00,
      "total_cost": 120000000.00,
      "total_profit": 30000000.00,
      "total_profit_margin": "20.00",
      "total_orders": 25
    }
  }
}
```

## Tổng Kết

### Các API đã có:
✅ Báo cáo doanh thu (4 API)
✅ Báo cáo chi phí (1 API)
✅ Báo cáo lợi nhuận (1 API)
✅ Báo cáo tồn kho (4 API)
✅ Báo cáo khách hàng (3 API)
✅ Báo cáo đánh giá (1 API)

### Tổng số API báo cáo: 14 API

