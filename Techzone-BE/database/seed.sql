-- Seed Data for Techzone E-commerce
USE techzone;

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Use DELETE statements because MySQL does not allow TRUNCATE on tables referenced by FKs
DELETE FROM voucher_usage;
DELETE FROM vouchers;
DELETE FROM promotion_products;
DELETE FROM promotions;
DELETE FROM return_items;
DELETE FROM returns;
DELETE FROM reviews;
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM cart_items;
DELETE FROM carts;
DELETE FROM customers;
DELETE FROM purchase_order_items;
DELETE FROM purchase_orders;
DELETE FROM stock_movements;
DELETE FROM inventory;
DELETE FROM product_images;
DELETE FROM products;
DELETE FROM brands;
DELETE FROM categories;
DELETE FROM staff_shifts;
DELETE FROM user_login_logs;
DELETE FROM stores;
DELETE FROM otp_codes;
DELETE FROM users;
DELETE FROM roles;
DELETE FROM daily_stats;

-- Reset AUTO_INCREMENT counters to mimic TRUNCATE behavior
ALTER TABLE voucher_usage AUTO_INCREMENT = 1;
ALTER TABLE vouchers AUTO_INCREMENT = 1;
ALTER TABLE promotion_products AUTO_INCREMENT = 1;
ALTER TABLE promotions AUTO_INCREMENT = 1;
ALTER TABLE return_items AUTO_INCREMENT = 1;
ALTER TABLE returns AUTO_INCREMENT = 1;
ALTER TABLE reviews AUTO_INCREMENT = 1;
ALTER TABLE order_items AUTO_INCREMENT = 1;
ALTER TABLE orders AUTO_INCREMENT = 1;
ALTER TABLE cart_items AUTO_INCREMENT = 1;
ALTER TABLE carts AUTO_INCREMENT = 1;
ALTER TABLE customers AUTO_INCREMENT = 1;
ALTER TABLE purchase_order_items AUTO_INCREMENT = 1;
ALTER TABLE purchase_orders AUTO_INCREMENT = 1;
ALTER TABLE stock_movements AUTO_INCREMENT = 1;
ALTER TABLE inventory AUTO_INCREMENT = 1;
ALTER TABLE product_images AUTO_INCREMENT = 1;
ALTER TABLE products AUTO_INCREMENT = 1;
ALTER TABLE brands AUTO_INCREMENT = 1;
ALTER TABLE categories AUTO_INCREMENT = 1;
ALTER TABLE staff_shifts AUTO_INCREMENT = 1;
ALTER TABLE user_login_logs AUTO_INCREMENT = 1;
ALTER TABLE stores AUTO_INCREMENT = 1;
ALTER TABLE otp_codes AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE roles AUTO_INCREMENT = 1;
ALTER TABLE daily_stats AUTO_INCREMENT = 1;

-- =============================================
-- Roles
-- =============================================
INSERT INTO roles (id, name, description) VALUES
(1, 'admin', 'Quản trị viên hệ thống'),
(2, 'staff', 'Nhân viên bán hàng'),
(3, 'customer', 'Khách hàng');

-- =============================================
-- Stores (Chi nhánh)
-- =============================================
INSERT INTO stores (id, name, address, city, phone, email, google_maps_url, is_active) VALUES
(1, 'Techzone Quận 1', '123 Nguyễn Huệ, Phường Bến Nghé', 'Hồ Chí Minh', '02838252525', 'q1@techzone.vn', 'https://maps.google.com/?q=10.7769,106.7009', TRUE),
(2, 'Techzone Quận 3', '456 Võ Văn Tần, Phường 5', 'Hồ Chí Minh', '02839305050', 'q3@techzone.vn', 'https://maps.google.com/?q=10.7781,106.6919', TRUE),
(3, 'Techzone Hà Nội', '789 Hoàng Quốc Việt, Cầu Giấy', 'Hà Nội', '02438365656', 'hn@techzone.vn', 'https://maps.google.com/?q=21.0368,105.7955', TRUE);

-- =============================================
-- Users (Admin: admin@techzone.vn / Admin@123)
-- =============================================
INSERT INTO users (id, email, password_hash, full_name, phone, role_id, is_active, is_verified, store_id) VALUES
(1, 'admin@techzone.vn', '$2b$10$5tZlV.nbUqVKkXRMFiXbwuTChNkC1G/1mcnDNzBi41/NnFIYkUtDe', 'Nguyễn Văn Admin', '0901234567', 1, TRUE, TRUE, NULL),
(2, 'staff1@techzone.vn', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Trần Thị Hoa', '0902345678', 2, TRUE, TRUE, 1),
(3, 'staff2@techzone.vn', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Lê Văn Nam', '0903456789', 2, TRUE, TRUE, 2),
(4, 'staff3@techzone.vn', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Phạm Thị Lan', '0904567890', 2, TRUE, TRUE, 3),
(5, 'staff4@techzone.vn', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Hoàng Văn Minh', '0905678901', 2, TRUE, TRUE, 1);

-- Khách hàng
INSERT INTO users (id, email, password_hash, full_name, phone, role_id, is_active, is_verified, store_id) VALUES
(6, 'customer1@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Nguyễn Thị Hương', '0906789012', 3, TRUE, TRUE, NULL),
(7, 'customer2@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Trần Văn Đức', '0907890123', 3, TRUE, TRUE, NULL),
(8, 'customer3@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Lê Thị Mai', '0908901234', 3, TRUE, TRUE, NULL),
(9, 'customer4@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Phạm Văn Tùng', '0909012345', 3, TRUE, TRUE, NULL),
(10, 'customer5@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Vũ Thị Ngọc', '0900123456', 3, TRUE, TRUE, NULL);

-- Thêm 15 khách hàng nữa
INSERT INTO users (email, password_hash, full_name, phone, role_id, is_active, is_verified) VALUES
('customer6@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Đặng Văn Hải', '0911234567', 3, TRUE, TRUE),
('customer7@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Bùi Thị Thảo', '0912345678', 3, TRUE, TRUE),
('customer8@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Võ Văn Khoa', '0913456789', 3, TRUE, TRUE),
('customer9@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Đinh Thị Yến', '0914567890', 3, TRUE, TRUE),
('customer10@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Ngô Văn Long', '0915678901', 3, TRUE, TRUE),
('customer11@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Phan Thị Hoa', '0916789012', 3, TRUE, TRUE),
('customer12@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Lý Văn Tân', '0917890123', 3, TRUE, TRUE),
('customer13@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Trương Thị Lan', '0918901234', 3, TRUE, TRUE),
('customer14@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Đỗ Văn Hùng', '0919012345', 3, TRUE, TRUE),
('customer15@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Mai Thị Phương', '0920123456', 3, TRUE, TRUE),
('customer16@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Hồ Văn Tuấn', '0921234567', 3, TRUE, TRUE),
('customer17@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Chu Thị Nhung', '0922345678', 3, TRUE, TRUE),
('customer18@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Dương Văn Sơn', '0923456789', 3, TRUE, TRUE),
('customer19@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Tô Thị Kim', '0924567890', 3, TRUE, TRUE),
('customer20@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Lưu Văn Đạt', '0925678901', 3, TRUE, TRUE);

-- =============================================
-- Customers
-- =============================================
INSERT INTO customers (user_id, classification, total_orders, total_spent, last_order_date) VALUES
(6, 'vip', 25, 125000000, '2024-11-15'),
(7, 'regular', 12, 45000000, '2024-11-10'),
(8, 'regular', 8, 32000000, '2024-11-05'),
(9, 'vip', 18, 89000000, '2024-11-18'),
(10, 'new', 2, 8500000, '2024-11-12'),
(11, 'regular', 6, 28000000, '2024-10-25'),
(12, 'inactive', 3, 12000000, '2024-08-10'),
(13, 'new', 1, 15000000, '2024-11-19'),
(14, 'regular', 9, 38000000, '2024-11-08'),
(15, 'vip', 22, 105000000, '2024-11-16'),
(16, 'new', 1, 5500000, '2024-11-17'),
(17, 'regular', 7, 29500000, '2024-11-02'),
(18, 'inactive', 4, 18000000, '2024-07-20'),
(19, 'new', 2, 12000000, '2024-11-14'),
(20, 'regular', 10, 42000000, '2024-11-11'),
(21, 'new', 1, 7000000, '2024-11-20'),
(22, 'vip', 28, 138000000, '2024-11-19'),
(23, 'regular', 5, 22000000, '2024-10-30'),
(24, 'new', 1, 9500000, '2024-11-18'),
(25, 'regular', 11, 48000000, '2024-11-13');

-- =============================================
-- Categories
-- =============================================
INSERT INTO categories (id, name, slug, parent_id, description, display_order) VALUES
(1, 'Laptop', 'laptop', NULL, 'Laptop các loại', 1),
(2, 'Linh kiện máy tính', 'linh-kien-may-tinh', NULL, 'Linh kiện và phụ kiện', 2),
(3, 'Màn hình', 'man-hinh', NULL, 'Màn hình máy tính', 3),
(4, 'Phụ kiện', 'phu-kien', NULL, 'Phụ kiện máy tính', 4),
(5, 'Gaming', 'gaming', NULL, 'Sản phẩm Gaming', 5);

-- Sub-categories
INSERT INTO categories (name, slug, parent_id, description, display_order) VALUES
('Laptop Gaming', 'laptop-gaming', 1, 'Laptop chơi game', 1),
('Laptop Văn phòng', 'laptop-van-phong', 1, 'Laptop làm việc', 2),
('CPU', 'cpu', 2, 'Bộ vi xử lý', 1),
('RAM', 'ram', 2, 'Bộ nhớ trong', 2),
('SSD', 'ssd', 2, 'Ổ cứng SSD', 3),
('VGA', 'vga', 2, 'Card màn hình', 4),
('Chuột', 'chuot', 4, 'Chuột máy tính', 1),
('Bàn phím', 'ban-phim', 4, 'Bàn phím', 2);

-- =============================================
-- Brands
-- =============================================
INSERT INTO brands (id, name, slug, description) VALUES
(1, 'Dell', 'dell', 'Thương hiệu Dell của Mỹ'),
(2, 'HP', 'hp', 'Hewlett-Packard'),
(3, 'Lenovo', 'lenovo', 'Lenovo Trung Quốc'),
(4, 'ASUS', 'asus', 'ASUS Taiwan'),
(5, 'Acer', 'acer', 'Acer Taiwan'),
(6, 'MSI', 'msi', 'MSI Gaming'),
(7, 'Intel', 'intel', 'Intel Corporation'),
(8, 'AMD', 'amd', 'AMD Corporation'),
(9, 'Samsung', 'samsung', 'Samsung Electronics'),
(10, 'LG', 'lg', 'LG Electronics');

-- =============================================
-- Products (30 sản phẩm)
-- =============================================
INSERT INTO products (sku, name, slug, category_id, brand_id, description, specifications, base_price, selling_price, discount_price, is_featured, is_new) VALUES
-- Laptops
('DELL-LAT-5420', 'Dell Latitude 5420', 'dell-latitude-5420', 1, 1, 'Laptop Dell Latitude 5420 dành cho doanh nghiệp', '{"cpu": "Intel Core i5-1135G7", "ram": "8GB DDR4", "storage": "256GB SSD", "display": "14 inch FHD"}', 15000000, 18990000, 17490000, TRUE, FALSE),
('HP-ELITEBOOK-840', 'HP EliteBook 840 G8', 'hp-elitebook-840-g8', 1, 2, 'HP EliteBook 840 G8 cao cấp', '{"cpu": "Intel Core i7-1165G7", "ram": "16GB DDR4", "storage": "512GB SSD", "display": "14 inch FHD"}', 22000000, 26990000, NULL, TRUE, TRUE),
('LENOVO-THINKPAD-X1', 'Lenovo ThinkPad X1 Carbon Gen 9', 'lenovo-thinkpad-x1-carbon', 1, 3, 'Lenovo ThinkPad X1 Carbon siêu mỏng nhẹ', '{"cpu": "Intel Core i7-1185G7", "ram": "16GB LPDDR4x", "storage": "1TB SSD", "display": "14 inch 2K"}', 30000000, 38990000, 36990000, TRUE, TRUE),
('ASUS-VIVOBOOK-15', 'Asus VivoBook 15 X515', 'asus-vivobook-15-x515', 7, 4, 'Laptop Asus VivoBook 15 giá tốt', '{"cpu": "Intel Core i3-1115G4", "ram": "4GB DDR4", "storage": "256GB SSD", "display": "15.6 inch FHD"}', 9000000, 12990000, 11490000, FALSE, FALSE),
('ACER-ASPIRE-7', 'Acer Aspire 7 A715', 'acer-aspire-7-a715', 6, 5, 'Acer Aspire 7 laptop gaming giá rẻ', '{"cpu": "Intel Core i5-11400H", "ram": "8GB DDR4", "storage": "512GB SSD", "gpu": "GTX 1650", "display": "15.6 inch FHD 144Hz"}', 16000000, 19990000, NULL, TRUE, TRUE),
('MSI-GF63-THIN', 'MSI GF63 Thin 11SC', 'msi-gf63-thin-11sc', 6, 6, 'MSI GF63 Thin laptop gaming mỏng nhẹ', '{"cpu": "Intel Core i5-11400H", "ram": "8GB DDR4", "storage": "512GB SSD", "gpu": "GTX 1650 Max-Q", "display": "15.6 inch FHD"}', 17000000, 21490000, 19990000, TRUE, FALSE),
('ASUS-ROG-STRIX', 'Asus ROG Strix G15', 'asus-rog-strix-g15', 6, 4, 'Asus ROG Strix G15 gaming mạnh mẽ', '{"cpu": "AMD Ryzen 7 5800H", "ram": "16GB DDR4", "storage": "512GB SSD", "gpu": "RTX 3060", "display": "15.6 inch FHD 144Hz"}', 28000000, 33990000, 31990000, TRUE, TRUE),
('DELL-INSPIRON-15', 'Dell Inspiron 15 3511', 'dell-inspiron-15-3511', 7, 1, 'Dell Inspiron 15 văn phòng', '{"cpu": "Intel Core i3-1115G4", "ram": "4GB DDR4", "storage": "256GB SSD", "display": "15.6 inch HD"}', 8500000, 11490000, NULL, FALSE, FALSE),

-- CPUs
('INTEL-I5-12400F', 'Intel Core i5-12400F', 'intel-core-i5-12400f', 8, 7, 'CPU Intel Core i5-12400F 6 nhân 12 luồng', '{"cores": 6, "threads": 12, "base_clock": "2.5GHz", "boost_clock": "4.4GHz", "socket": "LGA1700"}', 3500000, 4490000, 3990000, TRUE, FALSE),
('INTEL-I7-12700K', 'Intel Core i7-12700K', 'intel-core-i7-12700k', 8, 7, 'CPU Intel Core i7-12700K 12 nhân 20 luồng', '{"cores": 12, "threads": 20, "base_clock": "3.6GHz", "boost_clock": "5.0GHz", "socket": "LGA1700"}', 7500000, 9490000, NULL, TRUE, TRUE),
('AMD-RYZEN5-5600X', 'AMD Ryzen 5 5600X', 'amd-ryzen-5-5600x', 8, 8, 'CPU AMD Ryzen 5 5600X 6 nhân 12 luồng', '{"cores": 6, "threads": 12, "base_clock": "3.7GHz", "boost_clock": "4.6GHz", "socket": "AM4"}', 4000000, 5290000, 4790000, TRUE, FALSE),
('AMD-RYZEN7-5800X', 'AMD Ryzen 7 5800X', 'amd-ryzen-7-5800x', 8, 8, 'CPU AMD Ryzen 7 5800X 8 nhân 16 luồng', '{"cores": 8, "threads": 16, "base_clock": "3.8GHz", "boost_clock": "4.7GHz", "socket": "AM4"}', 6500000, 8290000, NULL, TRUE, FALSE),

-- RAM
('CORSAIR-VENGEANCE-16GB', 'Corsair Vengeance LPX 16GB DDR4', 'corsair-vengeance-16gb-ddr4', 9, 1, 'RAM Corsair Vengeance LPX 16GB DDR4 3200MHz', '{"capacity": "16GB", "type": "DDR4", "speed": "3200MHz", "cas_latency": "CL16"}', 1200000, 1690000, 1490000, FALSE, FALSE),
('GSKILL-TRIDENT-32GB', 'G.Skill Trident Z RGB 32GB DDR4', 'gskill-trident-32gb-ddr4', 9, 1, 'RAM G.Skill Trident Z RGB 32GB DDR4 3600MHz', '{"capacity": "32GB", "type": "DDR4", "speed": "3600MHz", "cas_latency": "CL18", "rgb": true}', 2800000, 3690000, NULL, TRUE, TRUE),

-- SSD
('SAMSUNG-970-EVO-500GB', 'Samsung 970 EVO Plus 500GB', 'samsung-970-evo-plus-500gb', 10, 9, 'SSD Samsung 970 EVO Plus 500GB NVMe M.2', '{"capacity": "500GB", "interface": "NVMe M.2", "read_speed": "3500MB/s", "write_speed": "3200MB/s"}', 1400000, 1890000, 1690000, FALSE, FALSE),
('SAMSUNG-980-PRO-1TB', 'Samsung 980 PRO 1TB', 'samsung-980-pro-1tb', 10, 9, 'SSD Samsung 980 PRO 1TB NVMe M.2 Gen4', '{"capacity": "1TB", "interface": "NVMe M.2 Gen4", "read_speed": "7000MB/s", "write_speed": "5000MB/s"}', 3000000, 3990000, NULL, TRUE, TRUE),
('WD-BLUE-SN570-1TB', 'WD Blue SN570 1TB', 'wd-blue-sn570-1tb', 10, 1, 'SSD WD Blue SN570 1TB NVMe M.2', '{"capacity": "1TB", "interface": "NVMe M.2", "read_speed": "3500MB/s", "write_speed": "3000MB/s"}', 1800000, 2390000, 2190000, FALSE, FALSE),

-- VGA
('ASUS-RTX3060-12GB', 'Asus Dual GeForce RTX 3060 12GB', 'asus-dual-rtx-3060-12gb', 11, 4, 'VGA Asus Dual GeForce RTX 3060 12GB GDDR6', '{"gpu": "RTX 3060", "vram": "12GB GDDR6", "cuda_cores": 3584, "boost_clock": "1777MHz"}', 8500000, 10990000, 9990000, TRUE, FALSE),
('MSI-RTX3070-8GB', 'MSI GeForce RTX 3070 GAMING X TRIO 8GB', 'msi-rtx-3070-gaming-x-trio', 11, 6, 'VGA MSI GeForce RTX 3070 GAMING X TRIO 8GB', '{"gpu": "RTX 3070", "vram": "8GB GDDR6", "cuda_cores": 5888, "boost_clock": "1815MHz"}', 14000000, 17990000, 16490000, TRUE, TRUE),

-- Màn hình
('LG-24MK430H', 'LG 24MK430H-B 24 inch IPS', 'lg-24mk430h-24inch-ips', 3, 10, 'Màn hình LG 24 inch IPS Full HD', '{"size": "24inch", "resolution": "1920x1080", "panel": "IPS", "refresh_rate": "75Hz"}', 2000000, 2690000, NULL, FALSE, FALSE),
('SAMSUNG-27-C27R500', 'Samsung C27R500 27 inch Curved', 'samsung-c27r500-27inch', 3, 9, 'Màn hình Samsung 27 inch màn hình cong', '{"size": "27inch", "resolution": "1920x1080", "panel": "VA Curved", "refresh_rate": "60Hz"}', 3200000, 4190000, 3790000, FALSE, TRUE),
('ASUS-VG27AQ-27', 'Asus TUF Gaming VG27AQ 27 inch', 'asus-tuf-vg27aq-27inch', 3, 4, 'Màn hình Gaming Asus TUF VG27AQ 27 inch 165Hz', '{"size": "27inch", "resolution": "2560x1440", "panel": "IPS", "refresh_rate": "165Hz", "gsync": true}', 6500000, 8490000, 7990000, TRUE, TRUE),

-- Chuột
('LOGITECH-G102', 'Logitech G102 Lightsync', 'logitech-g102-lightsync', 12, 1, 'Chuột Gaming Logitech G102 Lightsync RGB', '{"dpi": "8000", "buttons": 6, "rgb": true, "sensor": "optical"}', 250000, 390000, 299000, TRUE, FALSE),
('RAZER-VIPER-MINI', 'Razer Viper Mini', 'razer-viper-mini', 12, 1, 'Chuột Gaming Razer Viper Mini siêu nhẹ', '{"dpi": "8500", "buttons": 6, "weight": "61g", "sensor": "optical"}', 550000, 790000, NULL, TRUE, TRUE),

-- Bàn phím
('AKKO-3084B-PLUS', 'Akko 3084B Plus', 'akko-3084b-plus', 13, 1, 'Bàn phím cơ Akko 3084B Plus Bluetooth', '{"layout": "80%", "switch": "Akko CS Switch", "connectivity": "Bluetooth/Wired", "rgb": true}', 1200000, 1590000, 1390000, FALSE, FALSE),
('LOGITECH-G913-TKL', 'Logitech G913 TKL', 'logitech-g913-tkl', 13, 1, 'Bàn phím cơ Gaming Logitech G913 TKL', '{"layout": "TKL", "switch": "GL Clicky", "connectivity": "Wireless", "rgb": true, "battery": "40 hours"}', 3800000, 4990000, NULL, TRUE, TRUE),

-- Thêm sản phẩm
('HP-PAVILION-15', 'HP Pavilion 15-eg0xxx', 'hp-pavilion-15-eg0xxx', 7, 2, 'HP Pavilion 15 văn phòng học tập', '{"cpu": "Intel Core i5-1135G7", "ram": "8GB DDR4", "storage": "512GB SSD", "display": "15.6 inch FHD"}', 14000000, 16990000, 15490000, FALSE, FALSE),
('CORSAIR-K70-RGB', 'Corsair K70 RGB MK.2', 'corsair-k70-rgb-mk2', 13, 1, 'Bàn phím cơ Gaming Corsair K70 RGB', '{"layout": "Full size", "switch": "Cherry MX Red", "connectivity": "Wired", "rgb": true}', 2800000, 3490000, 2990000, TRUE, FALSE),
('DELL-P2422H-24', 'Dell P2422H 24 inch', 'dell-p2422h-24inch', 3, 1, 'Màn hình Dell P2422H 24 inch văn phòng', '{"size": "24inch", "resolution": "1920x1080", "panel": "IPS", "refresh_rate": "60Hz"}', 3000000, 3890000, NULL, FALSE, FALSE);

-- =============================================
-- Product Images
-- =============================================
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES
(1, 'https://picsum.photos/seed/dell-lat-5420-1/800/600', TRUE, 1),
(1, 'https://picsum.photos/seed/dell-lat-5420-2/800/600', FALSE, 2),
(2, 'https://picsum.photos/seed/hp-elite-840-1/800/600', TRUE, 1),
(2, 'https://picsum.photos/seed/hp-elite-840-2/800/600', FALSE, 2),
(3, 'https://picsum.photos/seed/lenovo-x1-1/800/600', TRUE, 1),
(4, 'https://picsum.photos/seed/asus-vivo-1/800/600', TRUE, 1),
(5, 'https://picsum.photos/seed/acer-aspire-1/800/600', TRUE, 1),
(6, 'https://picsum.photos/seed/msi-gf63-1/800/600', TRUE, 1),
(7, 'https://picsum.photos/seed/asus-rog-1/800/600', TRUE, 1),
(8, 'https://picsum.photos/seed/dell-insp-1/800/600', TRUE, 1),
(9, 'https://picsum.photos/seed/intel-i5-1/800/600', TRUE, 1),
(10, 'https://picsum.photos/seed/intel-i7-1/800/600', TRUE, 1),
(11, 'https://picsum.photos/seed/amd-r5-1/800/600', TRUE, 1),
(12, 'https://picsum.photos/seed/amd-r7-1/800/600', TRUE, 1),
(13, 'https://picsum.photos/seed/corsair-ram-1/800/600', TRUE, 1),
(14, 'https://picsum.photos/seed/gskill-ram-1/800/600', TRUE, 1),
(15, 'https://picsum.photos/seed/samsung-970-1/800/600', TRUE, 1),
(16, 'https://picsum.photos/seed/samsung-980-1/800/600', TRUE, 1),
(17, 'https://picsum.photos/seed/wd-sn570-1/800/600', TRUE, 1),
(18, 'https://picsum.photos/seed/asus-3060-1/800/600', TRUE, 1),
(19, 'https://picsum.photos/seed/msi-3070-1/800/600', TRUE, 1),
(20, 'https://picsum.photos/seed/lg-24mk-1/800/600', TRUE, 1),
(21, 'https://picsum.photos/seed/samsung-c27-1/800/600', TRUE, 1),
(22, 'https://picsum.photos/seed/asus-vg27-1/800/600', TRUE, 1),
(23, 'https://picsum.photos/seed/logi-g102-1/800/600', TRUE, 1),
(24, 'https://picsum.photos/seed/razer-viper-1/800/600', TRUE, 1),
(25, 'https://picsum.photos/seed/akko-3084-1/800/600', TRUE, 1),
(26, 'https://picsum.photos/seed/logi-g913-1/800/600', TRUE, 1),
(27, 'https://picsum.photos/seed/hp-pav-1/800/600', TRUE, 1),
(28, 'https://picsum.photos/seed/corsair-k70-1/800/600', TRUE, 1),
(29, 'https://picsum.photos/seed/dell-p24-1/800/600', TRUE, 1),
(30, 'https://picsum.photos/seed/product-30-1/800/600', TRUE, 1);

-- =============================================
-- Inventory (Tồn kho theo chi nhánh)
-- =============================================
INSERT INTO inventory (product_id, store_id, quantity, reserved_quantity) VALUES
-- Store 1
(1, 1, 15, 2), (2, 1, 8, 1), (3, 1, 5, 0), (4, 1, 20, 3),
(5, 1, 12, 1), (9, 1, 25, 4), (10, 1, 15, 2), (13, 1, 30, 5),
(18, 1, 10, 1), (20, 1, 18, 2), (23, 1, 40, 6), (25, 1, 22, 3),

-- Store 2
(1, 2, 12, 1), (2, 2, 10, 0), (4, 2, 18, 2), (5, 2, 15, 2),
(6, 2, 8, 1), (11, 2, 20, 3), (14, 2, 25, 4), (16, 2, 12, 1),
(19, 2, 7, 0), (21, 2, 15, 2), (24, 2, 35, 5), (26, 2, 18, 2),

-- Store 3
(2, 3, 6, 0), (3, 3, 8, 1), (7, 3, 5, 0), (9, 3, 22, 3),
(10, 3, 18, 2), (12, 3, 16, 2), (15, 3, 28, 4), (17, 3, 20, 3),
(18, 3, 12, 1), (22, 3, 10, 1), (23, 3, 38, 6), (28, 3, 15, 2);

-- =============================================
-- Promotions & Vouchers
-- =============================================
INSERT INTO promotions (name, description, discount_type, discount_value, min_purchase, start_date, end_date, is_active) VALUES
('Khuyến mãi Laptop', 'Giảm giá 10% cho tất cả laptop', 'percent', 10, 10000000, '2024-11-01', '2024-12-31', TRUE),
('Sale Gaming', 'Giảm 2 triệu cho sản phẩm gaming', 'fixed', 2000000, 15000000, '2024-11-15', '2024-11-30', TRUE);

INSERT INTO vouchers (code, name, description, discount_type, discount_value, min_purchase, max_discount, usage_limit, used_count, start_date, end_date, is_active) VALUES
('WELCOME2024', 'Chào mừng khách hàng mới', 'Ưu đãi chào mừng khách mới', 'percent', 5, 5000000, NULL, 100, 0, '2024-11-01', '2024-12-31', TRUE),
('BLACKFRIDAY', 'Black Friday Sale', 'Giảm giá sự kiện Black Friday', 'fixed', 1000000, 20000000, NULL, 50, 0, '2024-11-20', '2024-11-30', TRUE),
('FREESHIP', 'Miễn phí vận chuyển', 'Miễn phí ship cho đơn đủ điều kiện', 'fixed', 50000, 2000000, NULL, 200, 0, '2024-11-01', '2024-12-31', TRUE);

-- =============================================
-- Sample Orders
-- =============================================
INSERT INTO orders (order_number, customer_id, store_id, delivery_type, delivery_address, delivery_city, delivery_phone, payment_method, payment_status, subtotal, discount_amount, shipping_fee, total_amount, status, confirmed_at, completed_at) VALUES
('ORD-20241101-001', 1, 1, 'delivery', '123 Nguyễn Văn Linh, Quận 7', 'Hồ Chí Minh', '0906789012', 'online', 'paid', 18990000, 0, 50000, 19040000, 'completed', '2024-11-01 10:30:00', '2024-11-05 16:00:00'),
('ORD-20241102-002', 2, 2, 'pickup', NULL, NULL, NULL, 'cod', 'paid', 5290000, 500000, 0, 4790000, 'completed', '2024-11-02 11:00:00', '2024-11-02 15:00:00'),
('ORD-20241105-003', 3, 1, 'delivery', '456 Lê Văn Việt, Quận 9', 'Hồ Chí Minh', '0908901234', 'online', 'paid', 33990000, 3000000, 50000, 31040000, 'completed', '2024-11-05 09:00:00', '2024-11-10 18:00:00'),
('ORD-20241108-004', 4, 2, 'delivery', '789 Trần Hưng Đạo, Quận 1', 'Hồ Chí Minh', '0909012345', 'cod', 'paid', 12990000, 1500000, 50000, 11540000, 'shipping', '2024-11-08 14:00:00', NULL),
('ORD-20241110-005', 5, 3, 'pickup', NULL, NULL, NULL, 'online', 'paid', 8490000, 500000, 0, 7990000, 'completed', '2024-11-10 10:00:00', '2024-11-10 16:00:00');

INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, discount_price, subtotal) VALUES
(1, 2, 'HP EliteBook 840 G8', 1, 26990000, NULL, 26990000),
(2, 11, 'AMD Ryzen 5 5600X', 1, 5290000, 4790000, 4790000),
(3, 7, 'Asus ROG Strix G15', 1, 33990000, 31990000, 31990000),
(4, 4, 'Asus VivoBook 15 X515', 1, 12990000, 11490000, 11490000),
(5, 22, 'Asus TUF Gaming VG27AQ 27 inch', 1, 8490000, 7990000, 7990000);

-- =============================================
-- Reviews
-- =============================================
INSERT INTO reviews (product_id, user_id, order_id, rating, comment, is_verified) VALUES
(2, 6, 1, 5, 'Laptop rất tốt, chạy mượt, thiết kế đẹp!', TRUE),
(11, 7, 2, 4, 'CPU chạy ổn, giá hợp lý', TRUE),
(7, 8, 3, 5, 'Máy gaming cực mạnh, chơi game siêu mượt!', TRUE),
(4, 9, 4, 3, 'Máy tạm được, hơi chậm khi mở nhiều tab', TRUE),
(22, 10, 5, 5, 'Màn hình đẹp, màu sắc chuẩn, 165Hz mượt lắm', TRUE);

-- Một số review chưa verify
INSERT INTO reviews (product_id, user_id, order_id, rating, comment, is_verified) VALUES
(1, 11, 1, 4, 'Sản phẩm ổn, giao hàng nhanh', FALSE),
(5, 12, 2, 5, 'Laptop gaming giá rẻ chất lượng tốt', FALSE);

SET FOREIGN_KEY_CHECKS = 1;

COMMIT;
