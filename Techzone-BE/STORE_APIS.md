# Quản Lý Cửa Hàng API Documentation

Tài liệu này mô tả các API đang có cho phân hệ Quản lý Cửa hàng của Techzone.

## 6.1. Danh sách cửa hàng
- **Method**: `GET`
- **Route**: `/api/stores`
- **Authentication**: Required (Bearer Token)
- **Authorization**: Admin
- **Query Parameters**:
  - `page` (optional): integer, mặc định `1`
  - `limit` (optional): integer, mặc định `20`
  - `search` (optional): string – tìm theo tên, địa chỉ hoặc thành phố
  - `is_active` (optional): boolean string (`true`|`false`)
- **Payload**: Không có
- **Response JSON**:
```json
{
  "success": true,
  "message": "Lấy danh sách cửa hàng thành công",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 35
  },
  "data": [
    {
      "id": 1,
      "name": "Techzone Quận 1",
      "address": "12 Nguyễn Huệ, Quận 1, TP.HCM",
      "city": "Hồ Chí Minh",
      "district": "Quận 1",
      "phone": "0909000000",
      "manager_id": 5,
      "is_active": true,
      "created_at": "2024-11-01T00:00:00.000Z",
      "updated_at": "2024-11-10T00:00:00.000Z"
    }
  ]
}
```

## 6.2. Lấy danh sách rút gọn (dropdown)
- **Method**: `GET`
- **Route**: `/api/stores/dropdown`
- **Authentication**: Not required
- **Authorization**: Public
- **Query Parameters**: Không có
- **Payload**: Không có
- **Response JSON**:
```json
{
  "success": true,
  "message": "Lấy danh sách cửa hàng thành công",
  "data": [
    { "id": 1, "name": "Techzone Quận 1" },
    { "id": 2, "name": "Techzone Quận 3" }
  ]
}
```

## 6.3. Chi tiết cửa hàng
- **Method**: `GET`
- **Route**: `/api/stores/{id}`
- **Authentication**: Required (Bearer Token)
- **Authorization**: Admin
- **Path Parameters**:
  - `id` (required): integer – mã cửa hàng
- **Payload**: Không có
- **Response JSON**:
```json
{
  "success": true,
  "message": "Lấy chi tiết cửa hàng thành công",
  "data": {
    "id": 1,
    "name": "Techzone Quận 1",
    "address": "12 Nguyễn Huệ, Quận 1, TP.HCM",
    "city": "Hồ Chí Minh",
    "district": "Quận 1",
    "phone": "0909000000",
    "manager_id": 5,
    "manager_name": "Nguyễn Văn A",
    "total_products": 200,
    "total_staff": 15,
    "total_orders": 320,
    "total_inventory": 580,
    "is_active": true,
    "created_at": "2024-11-01T00:00:00.000Z",
    "updated_at": "2024-11-10T00:00:00.000Z"
  }
}
```

## 6.4. Tạo cửa hàng
- **Method**: `POST`
- **Route**: `/api/stores`
- **Authentication**: Required (Bearer Token)
- **Authorization**: Admin
- **Payload**:
```json
{
  "name": "Techzone Quận 7",
  "address": "99 Nguyễn Lương Bằng, Quận 7, TP.HCM",
  "city": "Hồ Chí Minh",
  "district": "Quận 7",
  "phone": "0909111222",
  "manager_id": 8,
  "is_active": true
}
```
- **Response JSON**:
```json
{
  "success": true,
  "message": "Tạo cửa hàng thành công",
  "data": {
    "id": 4,
    "name": "Techzone Quận 7",
    "address": "99 Nguyễn Lương Bằng, Quận 7, TP.HCM",
    "city": "Hồ Chí Minh",
    "district": "Quận 7",
    "phone": "0909111222",
    "manager_id": 8,
    "is_active": true,
    "created_at": "2024-11-23T00:00:00.000Z"
  }
}
```

## 6.5. Cập nhật cửa hàng
- **Method**: `PUT`
- **Route**: `/api/stores/{id}`
- **Authentication**: Required (Bearer Token)
- **Authorization**: Admin
- **Path Parameters**:
  - `id` (required): integer – mã cửa hàng
- **Payload** (chỉ gửi các trường cần cập nhật):
```json
{
  "name": "Techzone Quận 1 - Flagship",
  "phone": "0909222333",
  "manager_id": 10,
  "is_active": false
}
```
- **Response JSON**:
```json
{
  "success": true,
  "message": "Cập nhật cửa hàng thành công",
  "data": {
    "id": 1,
    "name": "Techzone Quận 1 - Flagship",
    "phone": "0909222333",
    "is_active": false,
    "updated_at": "2024-11-25T00:00:00.000Z"
  }
}
```

## 6.6. Ngưng kích hoạt / xóa mềm cửa hàng
- **Method**: `DELETE`
- **Route**: `/api/stores/{id}`
- **Authentication**: Required (Bearer Token)
- **Authorization**: Admin
- **Path Parameters**:
  - `id` (required): integer – mã cửa hàng
- **Payload**: Không có
- **Response JSON**:
```json
{
  "success": true,
  "message": "Xóa cửa hàng thành công",
  "data": {
    "id": 1
  }
}
```

> ⚠️ Ghi chú: API `DELETE` thực hiện cập nhật `is_active = false` (xóa mềm). Có thể kích hoạt lại cửa hàng bằng API `PUT` với `is_active = true`.

