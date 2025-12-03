-- ============================================
-- EXTRA DATA FOR REPORTS
-- Script bổ sung dữ liệu để hỗ trợ các loại báo cáo
-- ============================================

-- 1. BỔ SUNG ĐƠN HÀNG CHO BÁO CÁO DOANH THU
-- Thêm các đơn hàng với nhiều trạng thái và thời gian khác nhau

INSERT INTO `orders` (`order_number`, `customer_id`, `store_id`, `delivery_type`, `delivery_address`, `delivery_city`, `delivery_phone`, `payment_method`, `payment_status`, `subtotal`, `discount_amount`, `shipping_fee`, `total_amount`, `status`, `notes`, `cancelled_reason`, `created_at`, `updated_at`, `confirmed_at`, `completed_at`) VALUES
('ORD-20241120-006', 1, 1, 'delivery', '456 Lê Lợi, Quận 1', 'Hồ Chí Minh', '0906789012', 'online', 'paid', 25990000.00, 2000000.00, 50000.00, 24040000.00, 'completed', NULL, NULL, '2024-11-20 10:00:00', '2024-11-20 10:00:00', '2024-11-20 10:30:00', '2024-11-22 14:00:00'),
('ORD-20241121-007', 2, 2, 'pickup', NULL, NULL, NULL, 'cod', 'paid', 15900000.00, 1000000.00, 0.00, 14900000.00, 'completed', NULL, NULL, '2024-11-21 14:00:00', '2024-11-21 14:00:00', '2024-11-21 14:30:00', '2024-11-21 16:00:00'),
('ORD-20241122-008', 3, 1, 'delivery', '789 Nguyễn Trãi, Quận 5', 'Hồ Chí Minh', '0908901234', 'online', 'paid', 4490000.00, 0.00, 50000.00, 4540000.00, 'completed', NULL, NULL, '2024-11-22 09:00:00', '2024-11-22 09:00:00', '2024-11-22 09:15:00', '2024-11-24 10:00:00'),
('ORD-20241123-009', 4, 3, 'delivery', '321 Trần Phú, Quận 10', 'Hồ Chí Minh', '0909012345', 'cod', 'paid', 3690000.00, 0.00, 50000.00, 3740000.00, 'completed', NULL, NULL, '2024-11-23 11:00:00', '2024-11-23 11:00:00', '2024-11-23 11:30:00', '2024-11-25 15:00:00'),
('ORD-20241124-010', 5, 1, 'pickup', NULL, NULL, NULL, 'online', 'paid', 7990000.00, 500000.00, 0.00, 7490000.00, 'completed', NULL, NULL, '2024-11-24 15:00:00', '2024-11-24 15:00:00', '2024-11-24 15:15:00', '2024-11-24 17:00:00'),
('ORD-20241125-011', 6, 2, 'delivery', '654 Võ Văn Tần, Quận 3', 'Hồ Chí Minh', '0911234567', 'online', 'paid', 1890000.00, 0.00, 50000.00, 1940000.00, 'completed', NULL, NULL, '2024-11-25 08:00:00', '2024-11-25 08:00:00', '2024-11-25 08:30:00', '2024-11-27 09:00:00'),
('ORD-20241126-012', 7, 1, 'delivery', '987 Lý Tự Trọng, Quận 1', 'Hồ Chí Minh', '0912345678', 'cod', 'paid', 3990000.00, 0.00, 50000.00, 4040000.00, 'completed', NULL, NULL, '2024-11-26 13:00:00', '2024-11-26 13:00:00', '2024-11-26 13:30:00', '2024-11-28 11:00:00'),
('ORD-20241127-013', 8, 3, 'pickup', NULL, NULL, NULL, 'online', 'paid', 2190000.00, 200000.00, 0.00, 1990000.00, 'completed', NULL, NULL, '2024-11-27 16:00:00', '2024-11-27 16:00:00', '2024-11-27 16:15:00', '2024-11-27 18:00:00'),
('ORD-20241128-014', 9, 2, 'delivery', '147 Điện Biên Phủ, Quận Bình Thạnh', 'Hồ Chí Minh', '0914567890', 'online', 'paid', 9490000.00, 500000.00, 50000.00, 9040000.00, 'completed', NULL, NULL, '2024-11-28 10:00:00', '2024-11-28 10:00:00', '2024-11-28 10:30:00', '2024-11-30 14:00:00'),
('ORD-20241129-015', 10, 1, 'delivery', '258 Cách Mạng Tháng 8, Quận 10', 'Hồ Chí Minh', '0900123456', 'cod', 'paid', 1690000.00, 0.00, 50000.00, 1740000.00, 'completed', NULL, NULL, '2024-11-29 12:00:00', '2024-11-29 12:00:00', '2024-11-29 12:30:00', '2024-12-01 10:00:00'),
('ORD-20241130-016', 1, 2, 'pickup', NULL, NULL, NULL, 'online', 'paid', 4990000.00, 0.00, 0.00, 4990000.00, 'completed', NULL, NULL, '2024-11-30 09:00:00', '2024-11-30 09:00:00', '2024-11-30 09:15:00', '2024-11-30 11:00:00'),
('ORD-20241201-017', 2, 1, 'delivery', '369 Nguyễn Đình Chiểu, Quận 3', 'Hồ Chí Minh', '0907890123', 'online', 'paid', 10990000.00, 1000000.00, 50000.00, 10040000.00, 'completed', NULL, NULL, '2024-12-01 14:00:00', '2024-12-01 14:00:00', '2024-12-01 14:30:00', '2024-12-03 16:00:00'),
('ORD-20241202-018', 3, 3, 'delivery', '741 Hoàng Văn Thụ, Phú Nhuận', 'Hồ Chí Minh', '0908901234', 'cod', 'paid', 2390000.00, 0.00, 50000.00, 2440000.00, 'completed', NULL, NULL, '2024-12-02 11:00:00', '2024-12-02 11:00:00', '2024-12-02 11:30:00', '2024-12-04 13:00:00'),
('ORD-20241203-019', 4, 2, 'pickup', NULL, NULL, NULL, 'online', 'paid', 3490000.00, 300000.00, 0.00, 3190000.00, 'completed', NULL, NULL, '2024-12-03 15:00:00', '2024-12-03 15:00:00', '2024-12-03 15:15:00', '2024-12-03 17:00:00'),
('ORD-20241204-020', 5, 1, 'delivery', '852 Lê Văn Sỹ, Quận 3', 'Hồ Chí Minh', '0900123456', 'online', 'paid', 8490000.00, 500000.00, 50000.00, 8040000.00, 'completed', NULL, NULL, '2024-12-04 10:00:00', '2024-12-04 10:00:00', '2024-12-04 10:30:00', '2024-12-06 12:00:00'),
('ORD-20241205-021', 6, 3, 'delivery', '963 Phạm Văn Đồng, Quận Thủ Đức', 'Hồ Chí Minh', '0911234567', 'cod', 'paid', 1890000.00, 0.00, 50000.00, 1940000.00, 'pending', NULL, NULL, '2024-12-05 08:00:00', '2024-12-05 08:00:00', NULL, NULL),
('ORD-20241206-022', 7, 2, 'pickup', NULL, NULL, NULL, 'online', 'pending', 3990000.00, 0.00, 0.00, 3990000.00, 'confirmed', NULL, NULL, '2024-12-06 13:00:00', '2024-12-06 13:00:00', '2024-12-06 13:30:00', NULL),
('ORD-20241207-023', 8, 1, 'delivery', '159 Nguyễn Thị Minh Khai, Quận 1', 'Hồ Chí Minh', '0913456789', 'online', 'paid', 2190000.00, 0.00, 50000.00, 2240000.00, 'packing', NULL, NULL, '2024-12-07 16:00:00', '2024-12-07 16:00:00', '2024-12-07 16:30:00', NULL),
('ORD-20241208-024', 9, 3, 'delivery', '357 Đinh Tiên Hoàng, Quận Bình Thạnh', 'Hồ Chí Minh', '0914567890', 'cod', 'pending', 9490000.00, 0.00, 50000.00, 9540000.00, 'shipping', NULL, NULL, '2024-12-08 10:00:00', '2024-12-08 10:00:00', '2024-12-08 10:30:00', NULL);

-- Bổ sung order_items cho các đơn hàng mới
INSERT INTO `order_items` (`order_id`, `product_id`, `product_name`, `quantity`, `unit_price`, `discount_price`, `subtotal`) VALUES
(6, 3, 'Lenovo ThinkPad X1 Carbon Gen 9', 1, 38990000.00, 36990000.00, 25990000.00),
(7, 26, 'Logitech G913 TKL', 1, 4990000.00, NULL, 4990000.00),
(8, 9, 'Intel Core i5-12400F', 1, 4490000.00, 3990000.00, 4490000.00),
(9, 14, 'G.Skill Trident Z RGB 32GB DDR4', 1, 3690000.00, NULL, 3690000.00),
(10, 22, 'Asus TUF Gaming VG27AQ 27 inch', 1, 8490000.00, 7990000.00, 7990000.00),
(11, 15, 'Samsung 970 EVO Plus 500GB', 1, 1890000.00, 1690000.00, 1890000.00),
(12, 16, 'Samsung 980 PRO 1TB', 1, 3990000.00, NULL, 3990000.00),
(13, 17, 'WD Blue SN570 1TB', 1, 2390000.00, 2190000.00, 2190000.00),
(14, 10, 'Intel Core i7-12700K', 1, 9490000.00, NULL, 9490000.00),
(15, 13, 'Corsair Vengeance LPX 16GB DDR4', 1, 1690000.00, 1490000.00, 1690000.00),
(16, 26, 'Logitech G913 TKL', 1, 4990000.00, NULL, 4990000.00),
(17, 18, 'Asus Dual GeForce RTX 3060 12GB', 1, 10990000.00, 9990000.00, 10990000.00),
(18, 17, 'WD Blue SN570 1TB', 1, 2390000.00, 2190000.00, 2390000.00),
(19, 14, 'G.Skill Trident Z RGB 32GB DDR4', 1, 3490000.00, 3190000.00, 3490000.00),
(20, 22, 'Asus TUF Gaming VG27AQ 27 inch', 1, 8490000.00, 7990000.00, 8490000.00),
(21, 15, 'Samsung 970 EVO Plus 500GB', 1, 1890000.00, 1690000.00, 1890000.00),
(22, 16, 'Samsung 980 PRO 1TB', 1, 3990000.00, NULL, 3990000.00),
(23, 13, 'Corsair Vengeance LPX 16GB DDR4', 1, 1690000.00, 1490000.00, 1490000.00),
(24, 10, 'Intel Core i7-12700K', 1, 9490000.00, NULL, 9490000.00);

-- 2. BỔ SUNG DỮ LIỆU CHO BÁO CÁO CHI PHÍ (Purchase Orders)
INSERT INTO `purchase_orders` (`supplier_name`, `supplier_contact`, `store_id`, `total_amount`, `notes`, `status`, `created_by`, `created_at`, `received_at`) VALUES
('Nhà cung cấp Laptop ABC', 'contact@laptopabc.vn - 0281234567', 1, 50000000.00, 'Nhập hàng tháng 11', 'received', 1, '2024-11-01 08:00:00', '2024-11-03 14:00:00'),
('Nhà cung cấp Linh kiện XYZ', 'contact@xyz.vn - 0282345678', 1, 25000000.00, 'Nhập CPU, RAM, SSD', 'received', 1, '2024-11-05 09:00:00', '2024-11-07 10:00:00'),
('Nhà cung cấp Màn hình DEF', 'contact@def.vn - 0283456789', 2, 30000000.00, 'Nhập màn hình gaming', 'received', 1, '2024-11-10 10:00:00', '2024-11-12 15:00:00'),
('Nhà cung cấp Phụ kiện GHI', 'contact@ghi.vn - 0284567890', 2, 15000000.00, 'Nhập chuột, bàn phím', 'received', 1, '2024-11-15 11:00:00', '2024-11-17 09:00:00'),
('Nhà cung cấp Laptop ABC', 'contact@laptopabc.vn - 0281234567', 3, 40000000.00, 'Nhập hàng tháng 11', 'received', 1, '2024-11-20 08:00:00', '2024-11-22 13:00:00'),
('Nhà cung cấp Linh kiện XYZ', 'contact@xyz.vn - 0282345678', 3, 20000000.00, 'Nhập VGA, CPU', 'received', 1, '2024-11-25 09:00:00', '2024-11-27 11:00:00'),
('Nhà cung cấp Laptop ABC', 'contact@laptopabc.vn - 0281234567', 1, 35000000.00, 'Nhập hàng tháng 12', 'pending', 1, '2024-12-01 08:00:00', NULL),
('Nhà cung cấp Màn hình DEF', 'contact@def.vn - 0283456789', 2, 20000000.00, 'Nhập màn hình văn phòng', 'pending', 1, '2024-12-02 10:00:00', NULL);

-- Bổ sung purchase_order_items
INSERT INTO `purchase_order_items` (`purchase_order_id`, `product_id`, `quantity`, `unit_price`) VALUES
(1, 1, 10, 15000000.00),
(1, 2, 5, 22000000.00),
(2, 9, 20, 3500000.00),
(2, 13, 30, 1200000.00),
(2, 15, 25, 1400000.00),
(3, 20, 15, 2000000.00),
(3, 22, 10, 6500000.00),
(4, 23, 50, 250000.00),
(4, 25, 20, 1200000.00),
(5, 4, 15, 9000000.00),
(5, 8, 10, 8500000.00),
(6, 11, 15, 4000000.00),
(6, 18, 8, 8500000.00),
(7, 3, 8, 30000000.00),
(8, 20, 12, 2000000.00);

-- 3. BỔ SUNG DỮ LIỆU CHO BÁO CÁO TỒN KHO (Stock Movements)
INSERT INTO `stock_movements` (`product_id`, `store_id`, `type`, `quantity`, `reference_type`, `reference_id`, `notes`, `created_by`, `created_at`) VALUES
(1, 1, 'in', 10, 'purchase', 1, 'Nhập hàng từ supplier ABC', 1, '2024-11-03 14:00:00'),
(2, 1, 'in', 5, 'purchase', 1, 'Nhập hàng từ supplier ABC', 1, '2024-11-03 14:00:00'),
(9, 1, 'in', 20, 'purchase', 2, 'Nhập CPU từ supplier XYZ', 1, '2024-11-07 10:00:00'),
(13, 1, 'in', 30, 'purchase', 2, 'Nhập RAM từ supplier XYZ', 1, '2024-11-07 10:00:00'),
(15, 1, 'in', 25, 'purchase', 2, 'Nhập SSD từ supplier XYZ', 1, '2024-11-07 10:00:00'),
(20, 2, 'in', 15, 'purchase', 3, 'Nhập màn hình từ supplier DEF', 1, '2024-11-12 15:00:00'),
(22, 2, 'in', 10, 'purchase', 3, 'Nhập màn hình gaming từ supplier DEF', 1, '2024-11-12 15:00:00'),
(23, 2, 'in', 50, 'purchase', 4, 'Nhập chuột từ supplier GHI', 1, '2024-11-17 09:00:00'),
(25, 2, 'in', 20, 'purchase', 4, 'Nhập bàn phím từ supplier GHI', 1, '2024-11-17 09:00:00'),
(4, 3, 'in', 15, 'purchase', 5, 'Nhập laptop từ supplier ABC', 1, '2024-11-22 13:00:00'),
(8, 3, 'in', 10, 'purchase', 5, 'Nhập laptop từ supplier ABC', 1, '2024-11-22 13:00:00'),
(11, 3, 'in', 15, 'purchase', 6, 'Nhập CPU từ supplier XYZ', 1, '2024-11-27 11:00:00'),
(18, 3, 'in', 8, 'purchase', 6, 'Nhập VGA từ supplier XYZ', 1, '2024-11-27 11:00:00'),
(1, 1, 'out', 2, 'order', 1, 'Xuất kho cho đơn hàng ORD-20241101-001', 1, '2024-11-01 03:30:00'),
(2, 1, 'out', 1, 'order', 6, 'Xuất kho cho đơn hàng ORD-20241120-006', 1, '2024-11-20 10:30:00'),
(9, 1, 'out', 1, 'order', 8, 'Xuất kho cho đơn hàng ORD-20241122-008', 1, '2024-11-22 09:15:00'),
(22, 1, 'out', 1, 'order', 10, 'Xuất kho cho đơn hàng ORD-20241124-010', 1, '2024-11-24 15:15:00'),
(15, 2, 'out', 1, 'order', 11, 'Xuất kho cho đơn hàng ORD-20241125-011', 1, '2024-11-25 08:30:00'),
(16, 2, 'out', 1, 'order', 12, 'Xuất kho cho đơn hàng ORD-20241126-012', 1, '2024-11-26 13:30:00'),
(18, 1, 'out', 1, 'order', 17, 'Xuất kho cho đơn hàng ORD-20241201-017', 1, '2024-12-01 14:30:00'),
(22, 1, 'out', 1, 'order', 20, 'Xuất kho cho đơn hàng ORD-20241204-020', 1, '2024-12-04 10:30:00');

-- 4. BỔ SUNG DỮ LIỆU CHO BÁO CÁO KHÁCH HÀNG VÀ ĐÁNH GIÁ (Reviews)
INSERT INTO `reviews` (`product_id`, `user_id`, `order_id`, `rating`, `comment`, `images`, `is_verified`, `created_at`) VALUES
(3, 6, 6, 5, 'Laptop siêu mỏng nhẹ, pin tốt, màn hình sắc nét. Rất hài lòng!', NULL, 1, '2024-11-22 15:00:00'),
(26, 7, 7, 4, 'Bàn phím tốt, nhưng giá hơi cao. Chất lượng build tốt.', NULL, 1, '2024-11-21 18:00:00'),
(9, 8, 8, 5, 'CPU mạnh, chạy mượt, giá hợp lý. Đáng mua!', NULL, 1, '2024-11-22 20:00:00'),
(14, 9, 9, 4, 'RAM tốt, RGB đẹp. Nhưng giá hơi cao so với thị trường.', NULL, 1, '2024-11-23 16:00:00'),
(22, 10, 10, 5, 'Màn hình gaming tuyệt vời! 165Hz mượt mà, màu sắc chuẩn. Rất đáng tiền!', NULL, 1, '2024-11-24 19:00:00'),
(15, 11, 11, 5, 'SSD nhanh, giá tốt. Cài Windows boot nhanh lắm!', NULL, 1, '2024-11-25 12:00:00'),
(16, 12, 12, 4, 'SSD Gen4 nhanh, nhưng giá cao. Phù hợp cho người cần hiệu năng cao.', NULL, 1, '2024-11-26 14:00:00'),
(17, 13, 13, 5, 'SSD tốt, giá hợp lý. Đáng mua hơn Samsung 980 PRO.', NULL, 1, '2024-11-27 17:00:00'),
(10, 14, 14, 5, 'CPU Intel i7 mạnh mẽ, xử lý đa nhiệm tốt. Rất hài lòng!', NULL, 1, '2024-11-28 11:00:00'),
(13, 15, 15, 4, 'RAM tốt, giá ổn. Nhưng không có RGB như G.Skill.', NULL, 1, '2024-11-29 13:00:00'),
(26, 6, 16, 5, 'Bàn phím wireless tốt, pin lâu. Rất tiện lợi!', NULL, 1, '2024-11-30 10:00:00'),
(18, 7, 17, 5, 'VGA RTX 3060 mạnh, chơi game mượt. Giá hợp lý!', NULL, 1, '2024-12-01 15:00:00'),
(17, 8, 18, 4, 'SSD tốt, nhưng không nhanh bằng Samsung 980 PRO.', NULL, 1, '2024-12-02 12:00:00'),
(14, 9, 19, 5, 'RAM RGB đẹp, hiệu năng tốt. Rất hài lòng!', NULL, 1, '2024-12-03 16:00:00'),
(22, 10, 20, 5, 'Màn hình gaming tuyệt vời lần 2! Đã mua thêm 1 cái nữa.', NULL, 1, '2024-12-04 11:00:00'),
(1, 6, 1, 4, 'Laptop tốt, nhưng pin không được lâu như quảng cáo.', NULL, 1, '2024-11-05 10:00:00'),
(5, 7, 2, 5, 'Laptop gaming giá rẻ chất lượng tốt. Chơi game mượt!', NULL, 1, '2024-11-02 09:00:00'),
(7, 8, 3, 5, 'Laptop gaming cực mạnh! RTX 3060 chơi game AAA mượt mà.', NULL, 1, '2024-11-05 12:00:00'),
(4, 9, 4, 3, 'Laptop tạm được, nhưng RAM 4GB hơi ít. Nên nâng cấp lên 8GB.', NULL, 1, '2024-11-08 14:00:00'),
(23, 11, 11, 5, 'Chuột gaming tốt, giá rẻ. RGB đẹp!', NULL, 1, '2024-11-25 13:00:00'),
(24, 12, 12, 4, 'Chuột Razer nhẹ, nhưng giá cao. Chất lượng tốt.', NULL, 1, '2024-11-26 15:00:00'),
(25, 13, 13, 4, 'Bàn phím cơ tốt, nhưng switch hơi ồn.', NULL, 1, '2024-11-27 18:00:00'),
(28, 14, 14, 5, 'Bàn phím Corsair tuyệt vời! Cherry MX Red mượt mà.', NULL, 1, '2024-11-28 12:00:00');

-- 5. BỔ SUNG DỮ LIỆU CHO BÁO CÁO DOANH THU (Daily Stats)
INSERT INTO `daily_stats` (`date`, `store_id`, `total_orders`, `total_revenue`, `total_cost`, `total_profit`, `new_customers`, `created_at`) VALUES
('2024-11-01', NULL, 1, 19040000.00, 15000000.00, 4040000.00, 0, '2024-11-01 23:59:59'),
('2024-11-02', NULL, 1, 4790000.00, 16000000.00, -11210000.00, 0, '2024-11-02 23:59:59'),
('2024-11-05', NULL, 1, 31040000.00, 28000000.00, 3040000.00, 0, '2024-11-05 23:59:59'),
('2024-11-08', NULL, 1, 11540000.00, 9000000.00, 2540000.00, 0, '2024-11-08 23:59:59'),
('2024-11-10', NULL, 1, 7990000.00, 6500000.00, 1490000.00, 0, '2024-11-10 23:59:59'),
('2024-11-20', NULL, 1, 24040000.00, 22000000.00, 2040000.00, 0, '2024-11-20 23:59:59'),
('2024-11-21', NULL, 1, 14900000.00, 12000000.00, 2900000.00, 0, '2024-11-21 23:59:59'),
('2024-11-22', NULL, 1, 4540000.00, 3500000.00, 1040000.00, 0, '2024-11-22 23:59:59'),
('2024-11-23', NULL, 1, 3740000.00, 2800000.00, 940000.00, 0, '2024-11-23 23:59:59'),
('2024-11-24', NULL, 1, 7490000.00, 6500000.00, 990000.00, 0, '2024-11-24 23:59:59'),
('2024-11-25', NULL, 1, 1940000.00, 1400000.00, 540000.00, 0, '2024-11-25 23:59:59'),
('2024-11-26', NULL, 1, 4040000.00, 3000000.00, 1040000.00, 0, '2024-11-26 23:59:59'),
('2024-11-27', NULL, 1, 1990000.00, 1800000.00, 190000.00, 0, '2024-11-27 23:59:59'),
('2024-11-28', NULL, 1, 9040000.00, 7500000.00, 1540000.00, 0, '2024-11-28 23:59:59'),
('2024-11-29', NULL, 1, 1740000.00, 1200000.00, 540000.00, 0, '2024-11-29 23:59:59'),
('2024-11-30', NULL, 1, 4990000.00, 3800000.00, 1190000.00, 0, '2024-11-30 23:59:59'),
('2024-12-01', NULL, 1, 10040000.00, 8500000.00, 1540000.00, 0, '2024-12-01 23:59:59'),
('2024-12-02', NULL, 1, 2440000.00, 1800000.00, 640000.00, 0, '2024-12-02 23:59:59'),
('2024-12-03', NULL, 1, 3190000.00, 2800000.00, 390000.00, 0, '2024-12-03 23:59:59'),
('2024-12-04', NULL, 1, 8040000.00, 6500000.00, 1540000.00, 0, '2024-12-04 23:59:59'),
('2024-11-01', 1, 1, 19040000.00, 15000000.00, 4040000.00, 0, '2024-11-01 23:59:59'),
('2024-11-20', 1, 1, 24040000.00, 22000000.00, 2040000.00, 0, '2024-11-20 23:59:59'),
('2024-11-22', 1, 1, 4540000.00, 3500000.00, 1040000.00, 0, '2024-11-22 23:59:59'),
('2024-11-24', 1, 1, 7490000.00, 6500000.00, 990000.00, 0, '2024-11-24 23:59:59'),
('2024-11-26', 1, 1, 4040000.00, 3000000.00, 1040000.00, 0, '2024-11-26 23:59:59'),
('2024-11-28', 1, 1, 9040000.00, 7500000.00, 1540000.00, 0, '2024-11-28 23:59:59'),
('2024-11-29', 1, 1, 1740000.00, 1200000.00, 540000.00, 0, '2024-11-29 23:59:59'),
('2024-12-01', 1, 1, 10040000.00, 8500000.00, 1540000.00, 0, '2024-12-01 23:59:59'),
('2024-12-04', 1, 1, 8040000.00, 6500000.00, 1540000.00, 0, '2024-12-04 23:59:59'),
('2024-11-02', 2, 1, 4790000.00, 16000000.00, -11210000.00, 0, '2024-11-02 23:59:59'),
('2024-11-21', 2, 1, 14900000.00, 12000000.00, 2900000.00, 0, '2024-11-21 23:59:59'),
('2024-11-25', 2, 1, 1940000.00, 1400000.00, 540000.00, 0, '2024-11-25 23:59:59'),
('2024-11-26', 2, 1, 4040000.00, 3000000.00, 1040000.00, 0, '2024-11-26 23:59:59'),
('2024-11-30', 2, 1, 4990000.00, 3800000.00, 1190000.00, 0, '2024-11-30 23:59:59'),
('2024-12-03', 2, 1, 3190000.00, 2800000.00, 390000.00, 0, '2024-12-03 23:59:59'),
('2024-11-10', 3, 1, 7990000.00, 6500000.00, 1490000.00, 0, '2024-11-10 23:59:59'),
('2024-11-23', 3, 1, 3740000.00, 2800000.00, 940000.00, 0, '2024-11-23 23:59:59'),
('2024-11-27', 3, 1, 1990000.00, 1800000.00, 190000.00, 0, '2024-11-27 23:59:59'),
('2024-12-02', 3, 1, 2440000.00, 1800000.00, 640000.00, 0, '2024-12-02 23:59:59');

-- 6. CẬP NHẬT TỒN KHO SAU KHI NHẬP/XUẤT
UPDATE `inventory` SET `quantity` = `quantity` + 10 WHERE `product_id` = 1 AND `store_id` = 1;
UPDATE `inventory` SET `quantity` = `quantity` + 5 WHERE `product_id` = 2 AND `store_id` = 1;
UPDATE `inventory` SET `quantity` = `quantity` + 20 WHERE `product_id` = 9 AND `store_id` = 1;
UPDATE `inventory` SET `quantity` = `quantity` + 30 WHERE `product_id` = 13 AND `store_id` = 1;
UPDATE `inventory` SET `quantity` = `quantity` + 25 WHERE `product_id` = 15 AND `store_id` = 1;
UPDATE `inventory` SET `quantity` = `quantity` + 15 WHERE `product_id` = 20 AND `store_id` = 2;
UPDATE `inventory` SET `quantity` = `quantity` + 10 WHERE `product_id` = 22 AND `store_id` = 2;
UPDATE `inventory` SET `quantity` = `quantity` + 50 WHERE `product_id` = 23 AND `store_id` = 2;
UPDATE `inventory` SET `quantity` = `quantity` + 20 WHERE `product_id` = 25 AND `store_id` = 2;
UPDATE `inventory` SET `quantity` = `quantity` + 15 WHERE `product_id` = 4 AND `store_id` = 3;
UPDATE `inventory` SET `quantity` = `quantity` + 10 WHERE `product_id` = 8 AND `store_id` = 3;
UPDATE `inventory` SET `quantity` = `quantity` + 15 WHERE `product_id` = 11 AND `store_id` = 3;
UPDATE `inventory` SET `quantity` = `quantity` + 8 WHERE `product_id` = 18 AND `store_id` = 3;

-- Trừ tồn kho sau khi xuất
UPDATE `inventory` SET `quantity` = `quantity` - 2 WHERE `product_id` = 1 AND `store_id` = 1;
UPDATE `inventory` SET `quantity` = `quantity` - 1 WHERE `product_id` = 2 AND `store_id` = 1;
UPDATE `inventory` SET `quantity` = `quantity` - 1 WHERE `product_id` = 9 AND `store_id` = 1;
UPDATE `inventory` SET `quantity` = `quantity` - 1 WHERE `product_id` = 22 AND `store_id` = 1;
UPDATE `inventory` SET `quantity` = `quantity` - 1 WHERE `product_id` = 15 AND `store_id` = 2;
UPDATE `inventory` SET `quantity` = `quantity` - 1 WHERE `product_id` = 16 AND `store_id` = 2;
UPDATE `inventory` SET `quantity` = `quantity` - 1 WHERE `product_id` = 18 AND `store_id` = 1;
UPDATE `inventory` SET `quantity` = `quantity` - 1 WHERE `product_id` = 22 AND `store_id` = 1;

-- 7. CẬP NHẬT THỐNG KÊ KHÁCH HÀNG
UPDATE `customers` SET 
  `total_orders` = (SELECT COUNT(*) FROM `orders` WHERE `customer_id` = `customers`.`id`),
  `total_spent` = (SELECT COALESCE(SUM(`total_amount`), 0) FROM `orders` WHERE `customer_id` = `customers`.`id` AND `status` IN ('completed', 'processing')),
  `last_order_date` = (SELECT MAX(`created_at`) FROM `orders` WHERE `customer_id` = `customers`.`id`)
WHERE `id` IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

UPDATE `products` SET 
  `sold_count` = (SELECT COALESCE(SUM(`quantity`), 0) FROM `order_items` oi 
                  JOIN `orders` o ON oi.`order_id` = o.`id` 
                  WHERE oi.`product_id` = `products`.`id` AND o.`status` IN ('completed', 'processing'))
WHERE `id` IN (1, 2, 3, 4, 5, 7, 9, 10, 11, 13, 14, 15, 16, 17, 18, 22, 23, 24, 25, 26, 28);

UPDATE `order_items` oi
JOIN `orders` o ON oi.`order_id` = o.`id`
SET oi.`subtotal` = COALESCE(oi.`discount_price`, oi.`unit_price`) * oi.`quantity`
WHERE oi.`subtotal` != COALESCE(oi.`discount_price`, oi.`unit_price`) * oi.`quantity`;

