-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th12 15, 2025 lúc 12:03 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Skipped phpMyAdmin database creation
--
-- Cơ sở dữ liệu: `techzone`
--
CREATE DATABASE IF NOT EXISTS `techzone` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `techzone`;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `brands`
--

CREATE TABLE `brands` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `logo_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `brands`
--

INSERT INTO `brands` (`id`, `name`, `slug`, `description`, `logo_url`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Dell', 'dell', 'Thương hiệu Dell của Mỹ', NULL, 1, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(2, 'HP', 'hp', 'Hewlett-Packard', NULL, 1, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(3, 'Lenovo', 'lenovo', 'Lenovo Trung Quốc', NULL, 1, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(4, 'ASUS', 'asus', 'ASUS Taiwan', NULL, 1, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(5, 'Acer', 'acer', 'Acer Taiwan', NULL, 1, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(6, 'MSI', 'msi', 'MSI Gaming', NULL, 1, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(7, 'Intel', 'intel', 'Intel Corporation', NULL, 1, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(8, 'AMD', 'amd', 'AMD Corporation', NULL, 1, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(9, 'Samsung', 'samsung', 'Samsung Electronics', NULL, 1, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(10, 'LG', 'lg', 'LG Electronics', NULL, 1, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(11, 'TimeMaster', '', NULL, NULL, 1, '2025-12-12 20:01:10', '2025-12-12 20:01:10');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `carts`
--

CREATE TABLE `carts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `cart_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `parent_id`, `description`, `image_url`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Laptop', 'laptop', NULL, 'Laptop các loại', NULL, 1, 1, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(2, 'Linh kiện máy tính', 'linh-kien-may-tinh', NULL, 'Linh kiện và phụ kiện', NULL, 2, 1, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(3, 'Màn hình', 'man-hinh', NULL, 'Màn hình máy tính', NULL, 3, 1, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(4, 'Phụ kiện', 'phu-kien', NULL, 'Phụ kiện máy tính', NULL, 4, 1, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(5, 'Gaming', 'gaming', NULL, 'Sản phẩm Gaming', NULL, 5, 1, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(6, 'Laptop Gaming', 'laptop-gaming', 1, 'Laptop chơi game', NULL, 1, 1, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(7, 'Laptop Văn phòng', 'laptop-van-phong', 1, 'Laptop làm việc', NULL, 2, 1, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(8, 'CPU', 'cpu', 2, 'Bộ vi xử lý', NULL, 1, 1, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(9, 'RAM', 'ram', 2, 'Bộ nhớ trong', NULL, 2, 1, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(10, 'SSD', 'ssd', 2, 'Ổ cứng SSD', NULL, 3, 1, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(11, 'VGA', 'vga', 2, 'Card màn hình', NULL, 4, 1, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(12, 'Chuột', 'chuot', 4, 'Chuột máy tính', NULL, 1, 0, '2025-11-28 09:52:31', '2025-12-12 20:01:44'),
(13, 'Bàn phím', 'ban-phim', 4, 'Bàn phím', NULL, 2, 1, '2025-11-28 09:52:31', '2025-11-28 09:52:31');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `classification` enum('new','regular','vip','inactive') DEFAULT 'new',
  `total_orders` int(11) DEFAULT 0,
  `total_spent` decimal(15,2) DEFAULT 0.00,
  `last_order_date` timestamp NULL DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `customers`
--

INSERT INTO `customers` (`id`, `user_id`, `classification`, `total_orders`, `total_spent`, `last_order_date`, `notes`, `created_at`, `updated_at`) VALUES
(1, 6, 'vip', 3, 48070000.00, '2025-11-28 09:52:31', NULL, '2025-11-28 09:52:31', '2025-12-04 05:10:46'),
(2, 7, 'regular', 3, 29730000.00, '2025-11-28 09:52:31', NULL, '2025-11-28 09:52:31', '2025-12-04 05:10:46'),
(3, 8, 'regular', 3, 38020000.00, '2025-11-28 09:52:31', NULL, '2025-11-28 09:52:31', '2025-12-04 05:10:46'),
(4, 9, 'vip', 3, 6930000.00, '2025-11-28 09:52:31', NULL, '2025-11-28 09:52:31', '2025-12-04 05:10:46'),
(5, 10, 'new', 3, 23520000.00, '2025-11-28 09:52:31', NULL, '2025-11-28 09:52:31', '2025-12-04 05:10:46'),
(6, 11, 'regular', 2, 1940000.00, '2024-12-05 01:00:00', NULL, '2025-11-28 09:52:31', '2025-12-04 05:10:46'),
(7, 12, 'inactive', 2, 4040000.00, '2024-12-06 06:00:00', NULL, '2025-11-28 09:52:31', '2025-12-04 05:10:46'),
(8, 13, 'new', 2, 1990000.00, '2024-12-07 09:00:00', NULL, '2025-11-28 09:52:31', '2025-12-04 05:10:46'),
(9, 14, 'regular', 2, 9040000.00, '2024-12-08 03:00:00', NULL, '2025-11-28 09:52:31', '2025-12-04 05:10:46'),
(10, 15, 'vip', 1, 1740000.00, '2024-11-29 05:00:00', NULL, '2025-11-28 09:52:31', '2025-12-04 05:10:46'),
(11, 16, 'new', 1, 5500000.00, '2024-11-16 17:00:00', NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(12, 17, 'regular', 7, 29500000.00, '2024-11-01 17:00:00', NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(13, 18, 'inactive', 4, 18000000.00, '2024-07-19 17:00:00', NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(14, 19, 'new', 2, 12000000.00, '2024-11-13 17:00:00', NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(15, 20, 'regular', 10, 42000000.00, '2024-11-10 17:00:00', NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(16, 21, 'new', 1, 7000000.00, '2024-11-19 17:00:00', NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(17, 22, 'vip', 28, 138000000.00, '2024-11-18 17:00:00', NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(18, 23, 'regular', 5, 22000000.00, '2024-10-29 17:00:00', NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(19, 24, 'new', 1, 9500000.00, '2024-11-17 17:00:00', NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(20, 25, 'regular', 11, 48000000.00, '2024-11-12 17:00:00', NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(21, 26, 'new', 6, 166866000.00, '2025-12-13 13:32:47', NULL, '2025-12-04 05:36:42', '2025-12-13 13:32:47');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `daily_stats`
--

CREATE TABLE `daily_stats` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `store_id` int(11) DEFAULT NULL COMMENT 'NULL = toàn hệ thống',
  `total_orders` int(11) DEFAULT 0,
  `total_revenue` decimal(15,2) DEFAULT 0.00,
  `total_cost` decimal(15,2) DEFAULT 0.00,
  `total_profit` decimal(15,2) DEFAULT 0.00,
  `new_customers` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `daily_stats`
--

INSERT INTO `daily_stats` (`id`, `date`, `store_id`, `total_orders`, `total_revenue`, `total_cost`, `total_profit`, `new_customers`, `created_at`) VALUES
(1, '2024-11-01', NULL, 1, 19040000.00, 15000000.00, 4040000.00, 0, '2024-11-01 16:59:59'),
(2, '2024-11-02', NULL, 1, 4790000.00, 16000000.00, -11210000.00, 0, '2024-11-02 16:59:59'),
(3, '2024-11-05', NULL, 1, 31040000.00, 28000000.00, 3040000.00, 0, '2024-11-05 16:59:59'),
(4, '2024-11-08', NULL, 1, 11540000.00, 9000000.00, 2540000.00, 0, '2024-11-08 16:59:59'),
(5, '2024-11-10', NULL, 1, 7990000.00, 6500000.00, 1490000.00, 0, '2024-11-10 16:59:59'),
(6, '2024-11-20', NULL, 1, 24040000.00, 22000000.00, 2040000.00, 0, '2024-11-20 16:59:59'),
(7, '2024-11-21', NULL, 1, 14900000.00, 12000000.00, 2900000.00, 0, '2024-11-21 16:59:59'),
(8, '2024-11-22', NULL, 1, 4540000.00, 3500000.00, 1040000.00, 0, '2024-11-22 16:59:59'),
(9, '2024-11-23', NULL, 1, 3740000.00, 2800000.00, 940000.00, 0, '2024-11-23 16:59:59'),
(10, '2024-11-24', NULL, 1, 7490000.00, 6500000.00, 990000.00, 0, '2024-11-24 16:59:59'),
(11, '2024-11-25', NULL, 1, 1940000.00, 1400000.00, 540000.00, 0, '2024-11-25 16:59:59'),
(12, '2024-11-26', NULL, 1, 4040000.00, 3000000.00, 1040000.00, 0, '2024-11-26 16:59:59'),
(13, '2024-11-27', NULL, 1, 1990000.00, 1800000.00, 190000.00, 0, '2024-11-27 16:59:59'),
(14, '2024-11-28', NULL, 1, 9040000.00, 7500000.00, 1540000.00, 0, '2024-11-28 16:59:59'),
(15, '2024-11-29', NULL, 1, 1740000.00, 1200000.00, 540000.00, 0, '2024-11-29 16:59:59'),
(16, '2024-11-30', NULL, 1, 4990000.00, 3800000.00, 1190000.00, 0, '2024-11-30 16:59:59'),
(17, '2024-12-01', NULL, 1, 10040000.00, 8500000.00, 1540000.00, 0, '2024-12-01 16:59:59'),
(18, '2024-12-02', NULL, 1, 2440000.00, 1800000.00, 640000.00, 0, '2024-12-02 16:59:59'),
(19, '2024-12-03', NULL, 1, 3190000.00, 2800000.00, 390000.00, 0, '2024-12-03 16:59:59'),
(20, '2024-12-04', NULL, 1, 8040000.00, 6500000.00, 1540000.00, 0, '2024-12-04 16:59:59'),
(21, '2024-11-01', 1, 1, 19040000.00, 15000000.00, 4040000.00, 0, '2024-11-01 16:59:59'),
(22, '2024-11-20', 1, 1, 24040000.00, 22000000.00, 2040000.00, 0, '2024-11-20 16:59:59'),
(23, '2024-11-22', 1, 1, 4540000.00, 3500000.00, 1040000.00, 0, '2024-11-22 16:59:59'),
(24, '2024-11-24', 1, 1, 7490000.00, 6500000.00, 990000.00, 0, '2024-11-24 16:59:59'),
(25, '2024-11-26', 1, 1, 4040000.00, 3000000.00, 1040000.00, 0, '2024-11-26 16:59:59'),
(26, '2024-11-28', 1, 1, 9040000.00, 7500000.00, 1540000.00, 0, '2024-11-28 16:59:59'),
(27, '2024-11-29', 1, 1, 1740000.00, 1200000.00, 540000.00, 0, '2024-11-29 16:59:59'),
(28, '2024-12-01', 1, 1, 10040000.00, 8500000.00, 1540000.00, 0, '2024-12-01 16:59:59'),
(29, '2024-12-04', 1, 1, 8040000.00, 6500000.00, 1540000.00, 0, '2024-12-04 16:59:59'),
(30, '2024-11-02', 2, 1, 4790000.00, 16000000.00, -11210000.00, 0, '2024-11-02 16:59:59'),
(31, '2024-11-21', 2, 1, 14900000.00, 12000000.00, 2900000.00, 0, '2024-11-21 16:59:59'),
(32, '2024-11-25', 2, 1, 1940000.00, 1400000.00, 540000.00, 0, '2024-11-25 16:59:59'),
(33, '2024-11-26', 2, 1, 4040000.00, 3000000.00, 1040000.00, 0, '2024-11-26 16:59:59'),
(34, '2024-11-30', 2, 1, 4990000.00, 3800000.00, 1190000.00, 0, '2024-11-30 16:59:59'),
(35, '2024-12-03', 2, 1, 3190000.00, 2800000.00, 390000.00, 0, '2024-12-03 16:59:59'),
(36, '2024-11-10', 3, 1, 7990000.00, 6500000.00, 1490000.00, 0, '2024-11-10 16:59:59'),
(37, '2024-11-23', 3, 1, 3740000.00, 2800000.00, 940000.00, 0, '2024-11-23 16:59:59'),
(38, '2024-11-27', 3, 1, 1990000.00, 1800000.00, 190000.00, 0, '2024-11-27 16:59:59'),
(39, '2024-12-02', 3, 1, 2440000.00, 1800000.00, 640000.00, 0, '2024-12-02 16:59:59');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `inventory`
--

CREATE TABLE `inventory` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `reserved_quantity` int(11) NOT NULL DEFAULT 0 COMMENT 'Số lượng đang trong đơn hàng chưa xác nhận',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `inventory`
--

INSERT INTO `inventory` (`id`, `product_id`, `store_id`, `quantity`, `reserved_quantity`, `updated_at`) VALUES
(1, 1, 1, 23, 2, '2025-12-04 05:10:46'),
(2, 2, 1, 12, 1, '2025-12-04 05:10:46'),
(3, 3, 1, 5, 0, '2025-11-28 09:52:31'),
(4, 4, 1, 20, 3, '2025-11-28 09:52:31'),
(5, 5, 1, 12, 1, '2025-11-28 09:52:31'),
(6, 9, 1, 44, 4, '2025-12-04 05:10:46'),
(7, 10, 1, 15, 2, '2025-11-28 09:52:31'),
(8, 13, 1, 60, 5, '2025-12-04 05:10:45'),
(9, 18, 1, 9, 1, '2025-12-04 05:10:46'),
(10, 20, 1, 18, 2, '2025-11-28 09:52:31'),
(11, 23, 1, 40, 6, '2025-11-28 09:52:31'),
(12, 25, 1, 22, 3, '2025-11-28 09:52:31'),
(13, 1, 2, 12, 1, '2025-11-28 09:52:31'),
(14, 2, 2, 10, 0, '2025-11-28 09:52:31'),
(15, 4, 2, 18, 2, '2025-11-28 09:52:31'),
(16, 5, 2, 15, 2, '2025-11-28 09:52:31'),
(17, 6, 2, 8, 1, '2025-11-28 09:52:31'),
(18, 11, 2, 20, 3, '2025-11-28 09:52:31'),
(19, 14, 2, 25, 4, '2025-11-28 09:52:31'),
(20, 16, 2, 11, 1, '2025-12-04 05:10:46'),
(21, 19, 2, 7, 0, '2025-11-28 09:52:31'),
(22, 21, 2, 15, 2, '2025-11-28 09:52:31'),
(23, 24, 2, 35, 5, '2025-11-28 09:52:31'),
(24, 26, 2, 18, 2, '2025-11-28 09:52:31'),
(25, 2, 3, 6, 0, '2025-11-28 09:52:31'),
(26, 3, 3, 8, 1, '2025-11-28 09:52:31'),
(27, 7, 3, 5, 0, '2025-11-28 09:52:31'),
(28, 9, 3, 22, 3, '2025-11-28 09:52:31'),
(29, 10, 3, 18, 2, '2025-11-28 09:52:31'),
(30, 12, 3, 16, 2, '2025-11-28 09:52:31'),
(31, 15, 3, 28, 4, '2025-11-28 09:52:31'),
(32, 17, 3, 20, 3, '2025-11-28 09:52:31'),
(33, 18, 3, 20, 1, '2025-12-04 05:10:46'),
(34, 22, 3, 10, 1, '2025-11-28 09:52:31'),
(35, 23, 3, 38, 6, '2025-11-28 09:52:31'),
(36, 28, 3, 15, 2, '2025-11-28 09:52:31');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `order_number` varchar(50) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `store_id` int(11) DEFAULT NULL COMMENT 'Chi nhánh nhận hàng hoặc xuất kho',
  `delivery_type` enum('pickup','delivery') NOT NULL,
  `delivery_address` text DEFAULT NULL,
  `delivery_city` varchar(100) DEFAULT NULL,
  `delivery_phone` varchar(20) DEFAULT NULL,
  `payment_method` enum('cod','online') NOT NULL,
  `payment_status` enum('pending','paid','refunded') DEFAULT 'pending',
  `subtotal` decimal(15,2) NOT NULL,
  `discount_amount` decimal(15,2) DEFAULT 0.00,
  `shipping_fee` decimal(15,2) DEFAULT 0.00,
  `total_amount` decimal(15,2) NOT NULL,
  `status` enum('pending','confirmed','packing','shipping','completed','cancelled') DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `cancelled_reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `confirmed_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `store_id`, `delivery_type`, `delivery_address`, `delivery_city`, `delivery_phone`, `payment_method`, `payment_status`, `subtotal`, `discount_amount`, `shipping_fee`, `total_amount`, `status`, `notes`, `cancelled_reason`, `created_at`, `updated_at`, `confirmed_at`, `completed_at`) VALUES
(1, 'ORD-20241101-001', 1, 1, 'delivery', '123 Nguyễn Văn Linh, Quận 7', 'Hồ Chí Minh', '0906789012', 'online', 'paid', 18990000.00, 0.00, 50000.00, 19040000.00, 'completed', NULL, NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31', '2024-11-01 03:30:00', '2024-11-05 09:00:00'),
(2, 'ORD-20241102-002', 2, 2, 'pickup', NULL, NULL, NULL, 'cod', 'paid', 5290000.00, 500000.00, 0.00, 4790000.00, 'completed', NULL, NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31', '2024-11-02 04:00:00', '2024-11-02 08:00:00'),
(3, 'ORD-20241105-003', 3, 1, 'delivery', '456 Lê Văn Việt, Quận 9', 'Hồ Chí Minh', '0908901234', 'online', 'paid', 33990000.00, 3000000.00, 50000.00, 31040000.00, 'completed', NULL, NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31', '2024-11-05 02:00:00', '2024-11-10 11:00:00'),
(4, 'ORD-20241108-004', 4, 2, 'delivery', '789 Trần Hưng Đạo, Quận 1', 'Hồ Chí Minh', '0909012345', 'cod', 'paid', 12990000.00, 1500000.00, 50000.00, 11540000.00, 'shipping', NULL, NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31', '2024-11-08 07:00:00', NULL),
(5, 'ORD-20241110-005', 5, 3, 'pickup', NULL, NULL, NULL, 'online', 'paid', 8490000.00, 500000.00, 0.00, 7990000.00, 'completed', NULL, NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31', '2024-11-10 03:00:00', '2024-11-10 09:00:00'),
(6, 'ORD-20241120-006', 1, 1, 'delivery', '456 Lê Lợi, Quận 1', 'Hồ Chí Minh', '0906789012', 'online', 'paid', 25990000.00, 2000000.00, 50000.00, 24040000.00, 'completed', NULL, NULL, '2024-11-20 03:00:00', '2024-11-20 03:00:00', '2024-11-20 03:30:00', '2024-11-22 07:00:00'),
(7, 'ORD-20241121-007', 2, 2, 'pickup', NULL, NULL, NULL, 'cod', 'paid', 15900000.00, 1000000.00, 0.00, 14900000.00, 'completed', NULL, NULL, '2024-11-21 07:00:00', '2024-11-21 07:00:00', '2024-11-21 07:30:00', '2024-11-21 09:00:00'),
(8, 'ORD-20241122-008', 3, 1, 'delivery', '789 Nguyễn Trãi, Quận 5', 'Hồ Chí Minh', '0908901234', 'online', 'paid', 4490000.00, 0.00, 50000.00, 4540000.00, 'completed', NULL, NULL, '2024-11-22 02:00:00', '2024-11-22 02:00:00', '2024-11-22 02:15:00', '2024-11-24 03:00:00'),
(9, 'ORD-20241123-009', 4, 3, 'delivery', '321 Trần Phú, Quận 10', 'Hồ Chí Minh', '0909012345', 'cod', 'paid', 3690000.00, 0.00, 50000.00, 3740000.00, 'completed', NULL, NULL, '2024-11-23 04:00:00', '2024-11-23 04:00:00', '2024-11-23 04:30:00', '2024-11-25 08:00:00'),
(10, 'ORD-20241124-010', 5, 1, 'pickup', NULL, NULL, NULL, 'online', 'paid', 7990000.00, 500000.00, 0.00, 7490000.00, 'completed', NULL, NULL, '2024-11-24 08:00:00', '2024-11-24 08:00:00', '2024-11-24 08:15:00', '2024-11-24 10:00:00'),
(11, 'ORD-20241125-011', 6, 2, 'delivery', '654 Võ Văn Tần, Quận 3', 'Hồ Chí Minh', '0911234567', 'online', 'paid', 1890000.00, 0.00, 50000.00, 1940000.00, 'completed', NULL, NULL, '2024-11-25 01:00:00', '2024-11-25 01:00:00', '2024-11-25 01:30:00', '2024-11-27 02:00:00'),
(12, 'ORD-20241126-012', 7, 1, 'delivery', '987 Lý Tự Trọng, Quận 1', 'Hồ Chí Minh', '0912345678', 'cod', 'paid', 3990000.00, 0.00, 50000.00, 4040000.00, 'completed', NULL, NULL, '2024-11-26 06:00:00', '2024-11-26 06:00:00', '2024-11-26 06:30:00', '2024-11-28 04:00:00'),
(13, 'ORD-20241127-013', 8, 3, 'pickup', NULL, NULL, NULL, 'online', 'paid', 2190000.00, 200000.00, 0.00, 1990000.00, 'completed', NULL, NULL, '2024-11-27 09:00:00', '2024-11-27 09:00:00', '2024-11-27 09:15:00', '2024-11-27 11:00:00'),
(14, 'ORD-20241128-014', 9, 2, 'delivery', '147 Điện Biên Phủ, Quận Bình Thạnh', 'Hồ Chí Minh', '0914567890', 'online', 'paid', 9490000.00, 500000.00, 50000.00, 9040000.00, 'completed', NULL, NULL, '2024-11-28 03:00:00', '2024-11-28 03:00:00', '2024-11-28 03:30:00', '2024-11-30 07:00:00'),
(15, 'ORD-20241129-015', 10, 1, 'delivery', '258 Cách Mạng Tháng 8, Quận 10', 'Hồ Chí Minh', '0900123456', 'cod', 'paid', 1690000.00, 0.00, 50000.00, 1740000.00, 'completed', NULL, NULL, '2024-11-29 05:00:00', '2024-11-29 05:00:00', '2024-11-29 05:30:00', '2024-12-01 03:00:00'),
(16, 'ORD-20241130-016', 1, 2, 'pickup', NULL, NULL, NULL, 'online', 'paid', 4990000.00, 0.00, 0.00, 4990000.00, 'completed', NULL, NULL, '2024-11-30 02:00:00', '2024-11-30 02:00:00', '2024-11-30 02:15:00', '2024-11-30 04:00:00'),
(17, 'ORD-20241201-017', 2, 1, 'delivery', '369 Nguyễn Đình Chiểu, Quận 3', 'Hồ Chí Minh', '0907890123', 'online', 'paid', 10990000.00, 1000000.00, 50000.00, 10040000.00, 'completed', NULL, NULL, '2024-12-01 07:00:00', '2024-12-01 07:00:00', '2024-12-01 07:30:00', '2024-12-03 09:00:00'),
(18, 'ORD-20241202-018', 3, 3, 'delivery', '741 Hoàng Văn Thụ, Phú Nhuận', 'Hồ Chí Minh', '0908901234', 'cod', 'paid', 2390000.00, 0.00, 50000.00, 2440000.00, 'completed', NULL, NULL, '2024-12-02 04:00:00', '2024-12-02 04:00:00', '2024-12-02 04:30:00', '2024-12-04 06:00:00'),
(19, 'ORD-20241203-019', 4, 2, 'pickup', NULL, NULL, NULL, 'online', 'paid', 3490000.00, 300000.00, 0.00, 3190000.00, 'completed', NULL, NULL, '2024-12-03 08:00:00', '2024-12-03 08:00:00', '2024-12-03 08:15:00', '2024-12-03 10:00:00'),
(20, 'ORD-20241204-020', 5, 1, 'delivery', '852 Lê Văn Sỹ, Quận 3', 'Hồ Chí Minh', '0900123456', 'online', 'paid', 8490000.00, 500000.00, 50000.00, 8040000.00, 'completed', NULL, NULL, '2024-12-04 03:00:00', '2024-12-04 03:00:00', '2024-12-04 03:30:00', '2024-12-06 05:00:00'),
(21, 'ORD-20241205-021', 6, 3, 'delivery', '963 Phạm Văn Đồng, Quận Thủ Đức', 'Hồ Chí Minh', '0911234567', 'cod', 'paid', 1890000.00, 0.00, 50000.00, 1940000.00, 'pending', NULL, NULL, '2024-12-05 01:00:00', '2024-12-05 01:00:00', NULL, NULL),
(22, 'ORD-20241206-022', 7, 2, 'pickup', NULL, NULL, NULL, 'online', 'pending', 3990000.00, 0.00, 0.00, 3990000.00, 'confirmed', NULL, NULL, '2024-12-06 06:00:00', '2024-12-06 06:00:00', '2024-12-06 06:30:00', NULL),
(23, 'ORD-20241207-023', 8, 1, 'delivery', '159 Nguyễn Thị Minh Khai, Quận 1', 'Hồ Chí Minh', '0913456789', 'online', 'paid', 2190000.00, 0.00, 50000.00, 2240000.00, 'packing', NULL, NULL, '2024-12-07 09:00:00', '2024-12-07 09:00:00', '2024-12-07 09:30:00', NULL),
(24, 'ORD-20241208-024', 9, 3, 'delivery', '357 Đinh Tiên Hoàng, Quận Bình Thạnh', 'Hồ Chí Minh', '0914567890', 'cod', 'pending', 9490000.00, 0.00, 50000.00, 9540000.00, 'shipping', NULL, NULL, '2024-12-08 03:00:00', '2024-12-08 03:00:00', '2024-12-08 03:30:00', NULL),
(25, 'DH2025602498', 21, NULL, 'delivery', 'Chùa Láng, Xã Lương Thông, Huyện Hà Quảng, Tỉnh Cao Bằng, Việt Nam', NULL, '0356745362', 'cod', 'paid', 71470000.00, 0.00, 0.00, 75043500.00, 'completed', NULL, NULL, '2025-12-04 05:36:42', '2025-12-04 05:38:29', '2025-12-04 05:38:21', '2025-12-04 05:38:29'),
(26, 'DH2025-126554', 21, NULL, 'delivery', 'Chùa Láng, Xã Khánh Xuân, Huyện Bảo Lạc, Tỉnh Cao Bằng, Việt Nam', NULL, '0845887428', 'online', 'pending', 17490000.00, 0.00, 0.00, 18364500.00, 'shipping', NULL, NULL, '2025-12-04 06:02:06', '2025-12-04 06:05:48', '2025-12-04 06:05:41', NULL),
(27, 'DH2025-472526', 21, NULL, 'delivery', 'Chùa Láng, Thị trấn Vân Tùng, Huyện Ngân Sơn, Tỉnh Bắc Kạn, Việt Nam', NULL, '0845887428', 'online', 'pending', 17490000.00, 0.00, 0.00, 18364500.00, 'pending', NULL, NULL, '2025-12-04 08:54:32', '2025-12-04 08:54:32', NULL, NULL),
(28, 'DH2025-280404', 21, NULL, 'delivery', 'Vung Tau, Xã Địa Linh, Huyện Ba Bể, Tỉnh Bắc Kạn, Việt Nam', NULL, '0845887428', 'online', 'paid', 17490000.00, 0.00, 0.00, 18364500.00, 'pending', NULL, NULL, '2025-12-12 19:54:40', '2025-12-12 19:54:40', NULL, NULL),
(29, 'DH2025-376656', 21, NULL, 'delivery', 'Vung Tau, Xã Minh Phú, Huyện Sóc Sơn, Thành phố Hà Nội, Việt Nam', NULL, '0888470919', 'online', 'paid', 17490000.00, 0.00, 0.00, 18364500.00, 'completed', NULL, NULL, '2025-12-12 19:56:16', '2025-12-12 20:00:42', '2025-12-12 19:59:21', '2025-12-12 20:00:42'),
(30, 'DH2025-766763', 21, NULL, 'delivery', 'Vung Tau, Phường Phúc Xá, Quận Ba Đình, Thành phố Hà Nội, Việt Nam', NULL, '0845887428', 'online', 'paid', 17490000.00, 0.00, 0.00, 18364500.00, 'completed', NULL, NULL, '2025-12-13 13:32:47', '2025-12-13 13:34:44', '2025-12-13 13:34:05', '2025-12-13 13:34:44');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL COMMENT 'Lưu tên sản phẩm tại thời điểm đặt',
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(15,2) NOT NULL,
  `discount_price` decimal(15,2) DEFAULT NULL,
  `subtotal` decimal(15,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `quantity`, `unit_price`, `discount_price`, `subtotal`) VALUES
(1, 1, 2, 'HP EliteBook 840 G8', 1, 26990000.00, NULL, 26990000.00),
(2, 2, 11, 'AMD Ryzen 5 5600X', 1, 5290000.00, 4790000.00, 4790000.00),
(3, 3, 7, 'Asus ROG Strix G15', 1, 33990000.00, 31990000.00, 31990000.00),
(4, 4, 4, 'Asus VivoBook 15 X515', 1, 12990000.00, 11490000.00, 11490000.00),
(5, 5, 22, 'Asus TUF Gaming VG27AQ 27 inch', 1, 8490000.00, 7990000.00, 7990000.00),
(6, 6, 3, 'Lenovo ThinkPad X1 Carbon Gen 9', 1, 38990000.00, 36990000.00, 36990000.00),
(7, 7, 26, 'Logitech G913 TKL', 1, 4990000.00, NULL, 4990000.00),
(8, 8, 9, 'Intel Core i5-12400F', 1, 4490000.00, 3990000.00, 3990000.00),
(9, 9, 14, 'G.Skill Trident Z RGB 32GB DDR4', 1, 3690000.00, NULL, 3690000.00),
(10, 10, 22, 'Asus TUF Gaming VG27AQ 27 inch', 1, 8490000.00, 7990000.00, 7990000.00),
(11, 11, 15, 'Samsung 970 EVO Plus 500GB', 1, 1890000.00, 1690000.00, 1690000.00),
(12, 12, 16, 'Samsung 980 PRO 1TB', 1, 3990000.00, NULL, 3990000.00),
(13, 13, 17, 'WD Blue SN570 1TB', 1, 2390000.00, 2190000.00, 2190000.00),
(14, 14, 10, 'Intel Core i7-12700K', 1, 9490000.00, NULL, 9490000.00),
(15, 15, 13, 'Corsair Vengeance LPX 16GB DDR4', 1, 1690000.00, 1490000.00, 1490000.00),
(16, 16, 26, 'Logitech G913 TKL', 1, 4990000.00, NULL, 4990000.00),
(17, 17, 18, 'Asus Dual GeForce RTX 3060 12GB', 1, 10990000.00, 9990000.00, 9990000.00),
(18, 18, 17, 'WD Blue SN570 1TB', 1, 2390000.00, 2190000.00, 2190000.00),
(19, 19, 14, 'G.Skill Trident Z RGB 32GB DDR4', 1, 3490000.00, 3190000.00, 3190000.00),
(20, 20, 22, 'Asus TUF Gaming VG27AQ 27 inch', 1, 8490000.00, 7990000.00, 7990000.00),
(21, 21, 15, 'Samsung 970 EVO Plus 500GB', 1, 1890000.00, 1690000.00, 1690000.00),
(22, 22, 16, 'Samsung 980 PRO 1TB', 1, 3990000.00, NULL, 3990000.00),
(23, 23, 13, 'Corsair Vengeance LPX 16GB DDR4', 1, 1690000.00, 1490000.00, 1490000.00),
(24, 24, 10, 'Intel Core i7-12700K', 1, 9490000.00, NULL, 9490000.00),
(25, 25, 2, 'HP EliteBook 840 G8', 2, 26990000.00, NULL, 53980000.00),
(26, 25, 1, 'Dell Latitude 5420', 1, 17490000.00, NULL, 17490000.00),
(27, 26, 1, 'Dell Latitude 5420', 1, 17490000.00, NULL, 17490000.00),
(28, 27, 1, 'Dell Latitude 5420', 1, 17490000.00, NULL, 17490000.00),
(29, 28, 1, 'Dell Latitude 5420', 1, 17490000.00, NULL, 17490000.00),
(30, 29, 1, 'Dell Latitude 5420', 1, 17490000.00, NULL, 17490000.00),
(31, 30, 1, 'Dell Latitude 5420', 1, 17490000.00, NULL, 17490000.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `otp_codes`
--

CREATE TABLE `otp_codes` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `code` varchar(10) NOT NULL,
  `type` enum('register','reset_password','verify') NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_used` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `sku` varchar(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `category_id` int(11) NOT NULL,
  `brand_id` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `specifications` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Thông số kỹ thuật dạng JSON' CHECK (json_valid(`specifications`)),
  `base_price` decimal(15,2) NOT NULL COMMENT 'Giá nhập',
  `selling_price` decimal(15,2) NOT NULL COMMENT 'Giá bán',
  `discount_price` decimal(15,2) DEFAULT NULL COMMENT 'Giá khuyến mãi',
  `is_featured` tinyint(1) DEFAULT 0,
  `is_new` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `view_count` int(11) DEFAULT 0,
  `sold_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`id`, `sku`, `name`, `slug`, `category_id`, `brand_id`, `description`, `specifications`, `base_price`, `selling_price`, `discount_price`, `is_featured`, `is_new`, `is_active`, `view_count`, `sold_count`, `created_at`, `updated_at`) VALUES
(1, 'DELL-LAT-5420', 'Dell Latitude 5420', 'dell-latitude-5420', 1, 1, 'Laptop Dell Latitude 5420 dành cho doanh nghiệp', '{\"cpu\":\"Intel Core i5-1135G7\",\"ram\":\"8GB DDR4\",\"storage\":\"256GB SSD\",\"display\":\"14 inch FHD\"}', 15000000.00, 18990000.00, 17490000.00, 0, 0, 1, 0, 6, '2025-11-28 09:52:31', '2025-12-13 13:35:28'),
(2, 'HP-ELITEBOOK-840', 'HP EliteBook 840 G8', 'hp-elitebook-840-g8', 1, 2, 'HP EliteBook 840 G8 cao cấp', '{\"cpu\":\"Intel Core i7-1165G7\",\"ram\":\"16GB DDR4\",\"storage\":\"512GB SSD\",\"display\":\"14 inch FHD\"}', 22000000.00, 26990000.00, NULL, 0, 0, 1, 0, 3, '2025-11-28 09:52:31', '2025-12-04 05:36:42'),
(3, 'LENOVO-THINKPAD-X1', 'Lenovo ThinkPad X1 Carbon Gen 9', 'lenovo-thinkpad-x1-carbon', 1, 3, 'Lenovo ThinkPad X1 Carbon siêu mỏng nhẹ', '{\"cpu\":\"Intel Core i7-1185G7\",\"ram\":\"16GB LPDDR4x\",\"storage\":\"1TB SSD\",\"display\":\"14 inch 2K\"}', 30000000.00, 38990000.00, 36990000.00, 0, 0, 1, 0, 1, '2025-11-28 09:52:31', '2025-12-13 10:31:16'),
(4, 'ASUS-VIVOBOOK-15', 'Asus VivoBook 15 X515', 'asus-vivobook-15-x515', 7, 4, 'Laptop Asus VivoBook 15 giá tốt', '{\"cpu\":\"Intel Core i3-1115G4\",\"ram\":\"4GB DDR4\",\"storage\":\"256GB SSD\",\"display\":\"15.6 inch FHD\"}', 9000000.00, 12990000.00, 11490000.00, 0, 0, 1, 0, 0, '2025-11-28 09:52:31', '2025-12-13 10:32:26'),
(5, 'ACER-ASPIRE-7', 'Acer Aspire 7 A715', 'acer-aspire-7-a715', 6, 5, 'Acer Aspire 7 laptop gaming giá rẻ', '{\"cpu\":\"Intel Core i5-11400H\",\"ram\":\"8GB DDR4\",\"storage\":\"512GB SSD\",\"gpu\":\"GTX 1650\",\"display\":\"15.6 inch FHD 144Hz\"}', 16000000.00, 19990000.00, NULL, 0, 0, 1, 0, 0, '2025-11-28 09:52:31', '2025-12-13 10:33:42'),
(6, 'MSI-GF63-THIN', 'MSI GF63 Thin 11SC', 'msi-gf63-thin-11sc', 6, 6, 'MSI GF63 Thin laptop gaming mỏng nhẹ', '{\"cpu\":\"Intel Core i5-11400H\",\"ram\":\"8GB DDR4\",\"storage\":\"512GB SSD\",\"gpu\":\"GTX 1650 Max-Q\",\"display\":\"15.6 inch FHD\"}', 17000000.00, 21490000.00, 19990000.00, 0, 0, 1, 0, 0, '2025-11-28 09:52:31', '2025-12-13 10:34:23'),
(7, 'ASUS-ROG-STRIX', 'Asus ROG Strix G15', 'asus-rog-strix-g15', 6, 4, 'Asus ROG Strix G15 gaming mạnh mẽ', '{\"cpu\":\"AMD Ryzen 7 5800H\",\"ram\":\"16GB DDR4\",\"storage\":\"512GB SSD\",\"gpu\":\"RTX 3060\",\"display\":\"15.6 inch FHD 144Hz\"}', 28000000.00, 33990000.00, 31990000.00, 0, 0, 1, 0, 1, '2025-11-28 09:52:31', '2025-12-13 10:35:03'),
(8, 'DELL-INSPIRON-15', 'Dell Inspiron 15 3511', 'dell-inspiron-15-3511', 7, 1, 'Dell Inspiron 15 văn phòng', '{\"cpu\":\"Intel Core i3-1115G4\",\"ram\":\"4GB DDR4\",\"storage\":\"256GB SSD\",\"display\":\"15.6 inch HD\"}', 8500000.00, 11490000.00, NULL, 0, 0, 1, 0, 0, '2025-11-28 09:52:31', '2025-12-13 10:35:45'),
(9, 'INTEL-I5-12400F', 'Intel Core i5-12400F', 'intel-core-i5-12400f', 8, 7, 'CPU Intel Core i5-12400F 6 nhân 12 luồng', '{\"cores\": 6, \"threads\": 12, \"base_clock\": \"2.5GHz\", \"boost_clock\": \"4.4GHz\", \"socket\": \"LGA1700\"}', 3500000.00, 4490000.00, 3990000.00, 1, 0, 1, 0, 1, '2025-11-28 09:52:31', '2025-12-04 05:10:46'),
(10, 'INTEL-I7-12700K', 'Intel Core i7-12700K', 'intel-core-i7-12700k', 8, 7, 'CPU Intel Core i7-12700K 12 nhân 20 luồng', '{\"cores\": 12, \"threads\": 20, \"base_clock\": \"3.6GHz\", \"boost_clock\": \"5.0GHz\", \"socket\": \"LGA1700\"}', 7500000.00, 9490000.00, NULL, 1, 1, 1, 0, 1, '2025-11-28 09:52:31', '2025-12-04 05:10:46'),
(11, 'AMD-RYZEN5-5600X', 'AMD Ryzen 5 5600X', 'amd-ryzen-5-5600x', 8, 8, 'CPU AMD Ryzen 5 5600X 6 nhân 12 luồng', '{\"cores\": 6, \"threads\": 12, \"base_clock\": \"3.7GHz\", \"boost_clock\": \"4.6GHz\", \"socket\": \"AM4\"}', 4000000.00, 5290000.00, 4790000.00, 1, 0, 1, 0, 1, '2025-11-28 09:52:31', '2025-12-04 05:10:46'),
(12, 'AMD-RYZEN7-5800X', 'AMD Ryzen 7 5800X', 'amd-ryzen-7-5800x', 8, 8, 'CPU AMD Ryzen 7 5800X 8 nhân 16 luồng', '{\"cores\": 8, \"threads\": 16, \"base_clock\": \"3.8GHz\", \"boost_clock\": \"4.7GHz\", \"socket\": \"AM4\"}', 6500000.00, 8290000.00, NULL, 1, 0, 1, 0, 0, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(13, 'CORSAIR-VENGEANCE-16GB', 'Corsair Vengeance LPX 16GB DDR4', 'corsair-vengeance-16gb-ddr4', 9, 1, 'RAM Corsair Vengeance LPX 16GB DDR4 3200MHz', '{\"capacity\": \"16GB\", \"type\": \"DDR4\", \"speed\": \"3200MHz\", \"cas_latency\": \"CL16\"}', 1200000.00, 1690000.00, 1490000.00, 0, 0, 1, 0, 1, '2025-11-28 09:52:31', '2025-12-04 05:10:46'),
(14, 'GSKILL-TRIDENT-32GB', 'G.Skill Trident Z RGB 32GB DDR4', 'gskill-trident-32gb-ddr4', 9, 1, 'RAM G.Skill Trident Z RGB 32GB DDR4 3600MHz', '{\"capacity\": \"32GB\", \"type\": \"DDR4\", \"speed\": \"3600MHz\", \"cas_latency\": \"CL18\", \"rgb\": true}', 2800000.00, 3690000.00, NULL, 1, 1, 1, 0, 2, '2025-11-28 09:52:31', '2025-12-04 05:10:46'),
(15, 'SAMSUNG-970-EVO-500GB', 'Samsung 970 EVO Plus 500GB', 'samsung-970-evo-plus-500gb', 10, 9, 'SSD Samsung 970 EVO Plus 500GB NVMe M.2', '{\"capacity\": \"500GB\", \"interface\": \"NVMe M.2\", \"read_speed\": \"3500MB/s\", \"write_speed\": \"3200MB/s\"}', 1400000.00, 1890000.00, 1690000.00, 0, 0, 1, 0, 1, '2025-11-28 09:52:31', '2025-12-04 05:10:46'),
(16, 'SAMSUNG-980-PRO-1TB', 'Samsung 980 PRO 1TB', 'samsung-980-pro-1tb', 10, 9, 'SSD Samsung 980 PRO 1TB NVMe M.2 Gen4', '{\"capacity\": \"1TB\", \"interface\": \"NVMe M.2 Gen4\", \"read_speed\": \"7000MB/s\", \"write_speed\": \"5000MB/s\"}', 3000000.00, 3990000.00, NULL, 1, 1, 1, 0, 1, '2025-11-28 09:52:31', '2025-12-04 05:10:46'),
(17, 'WD-BLUE-SN570-1TB', 'WD Blue SN570 1TB', 'wd-blue-sn570-1tb', 10, 1, 'SSD WD Blue SN570 1TB NVMe M.2', '{\"capacity\": \"1TB\", \"interface\": \"NVMe M.2\", \"read_speed\": \"3500MB/s\", \"write_speed\": \"3000MB/s\"}', 1800000.00, 2390000.00, 2190000.00, 0, 0, 1, 0, 2, '2025-11-28 09:52:31', '2025-12-04 05:10:46'),
(18, 'ASUS-RTX3060-12GB', 'Asus Dual GeForce RTX 3060 12GB', 'asus-dual-rtx-3060-12gb', 11, 4, 'VGA Asus Dual GeForce RTX 3060 12GB GDDR6', '{\"gpu\": \"RTX 3060\", \"vram\": \"12GB GDDR6\", \"cuda_cores\": 3584, \"boost_clock\": \"1777MHz\"}', 8500000.00, 10990000.00, 9990000.00, 1, 0, 1, 0, 1, '2025-11-28 09:52:31', '2025-12-04 05:10:46'),
(19, 'MSI-RTX3070-8GB', 'MSI GeForce RTX 3070 GAMING X TRIO 8GB', 'msi-rtx-3070-gaming-x-trio', 11, 6, 'VGA MSI GeForce RTX 3070 GAMING X TRIO 8GB', '{\"gpu\": \"RTX 3070\", \"vram\": \"8GB GDDR6\", \"cuda_cores\": 5888, \"boost_clock\": \"1815MHz\"}', 14000000.00, 17990000.00, 16490000.00, 1, 1, 1, 0, 0, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(20, 'LG-24MK430H', 'LG 24MK430H-B 24 inch IPS', 'lg-24mk430h-24inch-ips', 3, 10, 'Màn hình LG 24 inch IPS Full HD', '{\"size\": \"24inch\", \"resolution\": \"1920x1080\", \"panel\": \"IPS\", \"refresh_rate\": \"75Hz\"}', 2000000.00, 2690000.00, NULL, 0, 0, 1, 0, 0, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(21, 'SAMSUNG-27-C27R500', 'Samsung C27R500 27 inch Curved', 'samsung-c27r500-27inch', 3, 9, 'Màn hình Samsung 27 inch màn hình cong', '{\"size\": \"27inch\", \"resolution\": \"1920x1080\", \"panel\": \"VA Curved\", \"refresh_rate\": \"60Hz\"}', 3200000.00, 4190000.00, 3790000.00, 0, 1, 1, 0, 0, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(22, 'ASUS-VG27AQ-27', 'Asus TUF Gaming VG27AQ 27 inch', 'asus-tuf-vg27aq-27inch', 3, 4, 'Màn hình Gaming Asus TUF VG27AQ 27 inch 165Hz', '{\"size\": \"27inch\", \"resolution\": \"2560x1440\", \"panel\": \"IPS\", \"refresh_rate\": \"165Hz\", \"gsync\": true}', 6500000.00, 8490000.00, 7990000.00, 1, 1, 1, 0, 3, '2025-11-28 09:52:31', '2025-12-04 05:10:46'),
(23, 'LOGITECH-G102', 'Logitech G102 Lightsync', 'logitech-g102-lightsync', 12, 1, 'Chuột Gaming Logitech G102 Lightsync RGB', '{\"dpi\": \"8000\", \"buttons\": 6, \"rgb\": true, \"sensor\": \"optical\"}', 250000.00, 390000.00, 299000.00, 1, 0, 1, 0, 0, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(24, 'RAZER-VIPER-MINI', 'Razer Viper Mini', 'razer-viper-mini', 12, 1, 'Chuột Gaming Razer Viper Mini siêu nhẹ', '{\"dpi\": \"8500\", \"buttons\": 6, \"weight\": \"61g\", \"sensor\": \"optical\"}', 550000.00, 790000.00, NULL, 1, 1, 1, 0, 0, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(25, 'AKKO-3084B-PLUS', 'Akko 3084B Plus', 'akko-3084b-plus', 13, 1, 'Bàn phím cơ Akko 3084B Plus Bluetooth', '{\"layout\": \"80%\", \"switch\": \"Akko CS Switch\", \"connectivity\": \"Bluetooth/Wired\", \"rgb\": true}', 1200000.00, 1590000.00, 1390000.00, 0, 0, 1, 0, 0, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(26, 'LOGITECH-G913-TKL', 'Logitech G913 TKL', 'logitech-g913-tkl', 13, 1, 'Bàn phím cơ Gaming Logitech G913 TKL', '{\"layout\": \"TKL\", \"switch\": \"GL Clicky\", \"connectivity\": \"Wireless\", \"rgb\": true, \"battery\": \"40 hours\"}', 3800000.00, 4990000.00, NULL, 1, 1, 1, 0, 2, '2025-11-28 09:52:31', '2025-12-04 05:10:46'),
(27, 'HP-PAVILION-15', 'HP Pavilion 15-eg0xxx', 'hp-pavilion-15-eg0xxx', 7, 2, 'HP Pavilion 15 văn phòng học tập', '{\"cpu\": \"Intel Core i5-1135G7\", \"ram\": \"8GB DDR4\", \"storage\": \"512GB SSD\", \"display\": \"15.6 inch FHD\"}', 14000000.00, 16990000.00, 15490000.00, 0, 0, 1, 0, 0, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(28, 'CORSAIR-K70-RGB', 'Corsair K70 RGB MK.2', 'corsair-k70-rgb-mk2', 13, 1, 'Bàn phím cơ Gaming Corsair K70 RGB', '{\"layout\": \"Full size\", \"switch\": \"Cherry MX Red\", \"connectivity\": \"Wired\", \"rgb\": true}', 2800000.00, 3490000.00, 2990000.00, 1, 0, 1, 0, 0, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(29, 'DELL-P2422H-24', 'Dell P2422H 24 inch', 'dell-p2422h-24inch', 3, 1, 'Màn hình Dell P2422H 24 inch văn phòng', '{\"size\": \"24inch\", \"resolution\": \"1920x1080\", \"panel\": \"IPS\", \"refresh_rate\": \"60Hz\"}', 3000000.00, 3890000.00, NULL, 0, 0, 1, 0, 0, '2025-11-28 09:52:31', '2025-11-28 09:52:31');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `is_primary`, `display_order`, `created_at`) VALUES
(11, 9, 'https://picsum.photos/seed/intel-i5-1/800/600', 1, 1, '2025-11-28 09:52:31'),
(12, 10, 'https://picsum.photos/seed/intel-i7-1/800/600', 1, 1, '2025-11-28 09:52:31'),
(13, 11, 'https://picsum.photos/seed/amd-r5-1/800/600', 1, 1, '2025-11-28 09:52:31'),
(14, 12, 'https://picsum.photos/seed/amd-r7-1/800/600', 1, 1, '2025-11-28 09:52:31'),
(15, 13, 'https://picsum.photos/seed/corsair-ram-1/800/600', 1, 1, '2025-11-28 09:52:31'),
(16, 14, 'https://picsum.photos/seed/gskill-ram-1/800/600', 1, 1, '2025-11-28 09:52:31'),
(17, 15, 'https://picsum.photos/seed/samsung-970-1/800/600', 1, 1, '2025-11-28 09:52:31'),
(18, 16, 'https://picsum.photos/seed/samsung-980-1/800/600', 1, 1, '2025-11-28 09:52:31'),
(19, 17, 'https://picsum.photos/seed/wd-sn570-1/800/600', 1, 1, '2025-11-28 09:52:31'),
(20, 18, 'https://picsum.photos/seed/asus-3060-1/800/600', 1, 1, '2025-11-28 09:52:31'),
(21, 19, 'https://picsum.photos/seed/msi-3070-1/800/600', 1, 1, '2025-11-28 09:52:31'),
(22, 20, 'https://picsum.photos/seed/lg-24mk-1/800/600', 1, 1, '2025-11-28 09:52:31'),
(23, 21, 'https://picsum.photos/seed/samsung-c27-1/800/600', 1, 1, '2025-11-28 09:52:31'),
(24, 22, 'https://picsum.photos/seed/asus-vg27-1/800/600', 1, 1, '2025-11-28 09:52:31'),
(25, 23, 'https://picsum.photos/seed/logi-g102-1/800/600', 1, 1, '2025-11-28 09:52:31'),
(26, 24, 'https://picsum.photos/seed/razer-viper-1/800/600', 1, 1, '2025-11-28 09:52:31'),
(27, 25, 'https://picsum.photos/seed/akko-3084-1/800/600', 1, 1, '2025-11-28 09:52:31'),
(28, 26, 'https://picsum.photos/seed/logi-g913-1/800/600', 1, 1, '2025-11-28 09:52:31'),
(29, 27, 'https://picsum.photos/seed/hp-pav-1/800/600', 1, 1, '2025-11-28 09:52:31'),
(30, 28, 'https://picsum.photos/seed/corsair-k70-1/800/600', 1, 1, '2025-11-28 09:52:31'),
(31, 29, 'https://picsum.photos/seed/dell-p24-1/800/600', 1, 1, '2025-11-28 09:52:31'),
(32, 30, 'https://picsum.photos/seed/product-30-1/800/600', 1, 1, '2025-11-28 09:52:31'),
(37, 2, 'https://m.media-amazon.com/images/I/71Cgosd4ejL._AC_SL1500_.jpg', 1, 0, '2025-12-02 18:20:53'),
(38, 2, 'https://m.media-amazon.com/images/I/71lcaxhYHNL._AC_SL1500_.jpg', 0, 1, '2025-12-02 18:20:53'),
(39, 2, 'https://m.media-amazon.com/images/I/81J6gZnZi-L._AC_SL1500_.jpg', 0, 2, '2025-12-02 18:20:53'),
(40, 2, 'https://m.media-amazon.com/images/I/81Y65ffO7gL._AC_SL1500_.jpg', 0, 3, '2025-12-02 18:20:53'),
(41, 2, 'https://m.media-amazon.com/images/I/71h-31uIsKL._AC_SL1500_.jpg', 0, 4, '2025-12-02 18:20:53'),
(42, 3, 'https://m.media-amazon.com/images/I/61GLMkdXL0L._AC_SX425_.jpg', 1, 0, '2025-12-13 10:31:16'),
(43, 3, 'https://m.media-amazon.com/images/I/61E7IzY6cHL._AC_SX425_.jpg', 0, 1, '2025-12-13 10:31:16'),
(44, 3, 'https://m.media-amazon.com/images/I/51FV+BsfXDL._AC_SX679_.jpg', 0, 2, '2025-12-13 10:31:16'),
(45, 3, 'https://m.media-amazon.com/images/I/31AhHRIb-PL._AC_SX425_.jpg', 0, 3, '2025-12-13 10:31:16'),
(46, 4, 'https://m.media-amazon.com/images/I/71TfjqvF4YL._AC_SL1500_.jpg', 1, 0, '2025-12-13 10:32:26'),
(47, 4, 'https://m.media-amazon.com/images/I/81QkZNX6BHL._AC_SX425_.jpg', 0, 1, '2025-12-13 10:32:26'),
(48, 4, 'https://m.media-amazon.com/images/I/71+1D6Q0e0L._AC_SL1500_.jpg', 0, 2, '2025-12-13 10:32:26'),
(49, 5, 'https://m.media-amazon.com/images/I/71HaRA5qEFL._AC_SL1500_.jpg', 1, 0, '2025-12-13 10:33:42'),
(50, 5, 'https://m.media-amazon.com/images/I/61Zf-9VyGNL._AC_SL1024_.jpg', 0, 1, '2025-12-13 10:33:42'),
(51, 5, 'https://m.media-amazon.com/images/I/61B78r6SzIL._AC_SL1024_.jpg', 0, 2, '2025-12-13 10:33:42'),
(52, 5, 'https://m.media-amazon.com/images/I/81AEnFukplL._AC_SL1500_.jpg', 0, 3, '2025-12-13 10:33:42'),
(53, 6, 'https://m.media-amazon.com/images/I/71BCum1YVzL._AC_SL1500_.jpg', 1, 0, '2025-12-13 10:34:23'),
(54, 6, 'https://m.media-amazon.com/images/I/71wkOzMg16L._AC_SL1500_.jpg', 0, 1, '2025-12-13 10:34:23'),
(55, 6, 'https://m.media-amazon.com/images/I/71VXEuHNLaL._AC_SL1500_.jpg', 0, 2, '2025-12-13 10:34:23'),
(56, 7, 'https://m.media-amazon.com/images/I/612-xtk-nUL._AC_SL1200_.jpg', 1, 0, '2025-12-13 10:35:03'),
(57, 7, 'https://m.media-amazon.com/images/I/61kCwoBwreL._AC_SL1200_.jpg', 0, 1, '2025-12-13 10:35:03'),
(58, 7, 'https://m.media-amazon.com/images/I/61Rk6mV1ATL._AC_SL1200_.jpg', 0, 2, '2025-12-13 10:35:03'),
(59, 8, 'https://m.media-amazon.com/images/I/81x8wuiiloS._AC_SL1500_.jpg', 1, 0, '2025-12-13 10:35:45'),
(60, 8, 'https://m.media-amazon.com/images/I/41ithPyBvSS._AC_SL1500_.jpg', 0, 1, '2025-12-13 10:35:45'),
(61, 8, 'https://m.media-amazon.com/images/I/518Vhh4+FiS._AC_SL1500_.jpg', 0, 2, '2025-12-13 10:35:45'),
(82, 1, 'https://m.media-amazon.com/images/I/716x9UYiXUL._AC_SL1500_.jpg', 1, 0, '2025-12-13 13:35:28'),
(83, 1, 'https://m.media-amazon.com/images/I/71XY6QXWbZL._AC_SL1500_.jpg', 0, 1, '2025-12-13 13:35:28'),
(84, 1, 'https://m.media-amazon.com/images/I/714RJ-sP6JL._AC_SL1500_.jpg', 0, 2, '2025-12-13 13:35:28'),
(85, 1, 'https://m.media-amazon.com/images/I/61XM4ZYV4lL._AC_SL1500_.jpg', 0, 3, '2025-12-13 13:35:28');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `promotions`
--

CREATE TABLE `promotions` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `discount_type` enum('percent','fixed') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `min_purchase` decimal(15,2) DEFAULT 0.00,
  `max_discount` decimal(15,2) DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `promotions`
--

INSERT INTO `promotions` (`id`, `name`, `description`, `discount_type`, `discount_value`, `min_purchase`, `max_discount`, `start_date`, `end_date`, `is_active`, `created_at`) VALUES
(1, 'Khuyến mãi Laptop', 'Giảm giá 10% cho tất cả laptop', 'percent', 10.00, 10000000.00, NULL, '2024-11-01 00:00:00', '2024-12-31 00:00:00', 1, '2025-11-28 09:52:31'),
(2, 'Sale Gaming', 'Giảm 2 triệu cho sản phẩm gaming', 'fixed', 2000000.00, 15000000.00, NULL, '2024-11-15 00:00:00', '2024-11-30 00:00:00', 1, '2025-11-28 09:52:31');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `promotion_products`
--

CREATE TABLE `promotion_products` (
  `id` int(11) NOT NULL,
  `promotion_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `purchase_orders`
--

CREATE TABLE `purchase_orders` (
  `id` int(11) NOT NULL,
  `supplier_name` varchar(255) NOT NULL,
  `supplier_contact` text DEFAULT NULL,
  `store_id` int(11) NOT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `notes` text DEFAULT NULL,
  `status` enum('pending','received','cancelled') DEFAULT 'pending',
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `received_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `purchase_orders`
--

INSERT INTO `purchase_orders` (`id`, `supplier_name`, `supplier_contact`, `store_id`, `total_amount`, `notes`, `status`, `created_by`, `created_at`, `received_at`) VALUES
(1, 'Nhà cung cấp Laptop ABC', 'contact@laptopabc.vn - 0281234567', 1, 50000000.00, 'Nhập hàng tháng 11', 'received', 1, '2024-11-01 01:00:00', '2024-11-03 07:00:00'),
(2, 'Nhà cung cấp Linh kiện XYZ', 'contact@xyz.vn - 0282345678', 1, 25000000.00, 'Nhập CPU, RAM, SSD', 'received', 1, '2024-11-05 02:00:00', '2024-11-07 03:00:00'),
(3, 'Nhà cung cấp Màn hình DEF', 'contact@def.vn - 0283456789', 2, 30000000.00, 'Nhập màn hình gaming', 'received', 1, '2024-11-10 03:00:00', '2024-11-12 08:00:00'),
(4, 'Nhà cung cấp Phụ kiện GHI', 'contact@ghi.vn - 0284567890', 2, 15000000.00, 'Nhập chuột, bàn phím', 'received', 1, '2024-11-15 04:00:00', '2024-11-17 02:00:00'),
(5, 'Nhà cung cấp Laptop ABC', 'contact@laptopabc.vn - 0281234567', 3, 40000000.00, 'Nhập hàng tháng 11', 'received', 1, '2024-11-20 01:00:00', '2024-11-22 06:00:00'),
(6, 'Nhà cung cấp Linh kiện XYZ', 'contact@xyz.vn - 0282345678', 3, 20000000.00, 'Nhập VGA, CPU', 'received', 1, '2024-11-25 02:00:00', '2024-11-27 04:00:00'),
(7, 'Nhà cung cấp Laptop ABC', 'contact@laptopabc.vn - 0281234567', 1, 35000000.00, 'Nhập hàng tháng 12', 'pending', 1, '2024-12-01 01:00:00', NULL),
(8, 'Nhà cung cấp Màn hình DEF', 'contact@def.vn - 0283456789', 2, 20000000.00, 'Nhập màn hình văn phòng', 'pending', 1, '2024-12-02 03:00:00', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `purchase_order_items`
--

CREATE TABLE `purchase_order_items` (
  `id` int(11) NOT NULL,
  `purchase_order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(15,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `purchase_order_items`
--

INSERT INTO `purchase_order_items` (`id`, `purchase_order_id`, `product_id`, `quantity`, `unit_price`) VALUES
(1, 1, 1, 10, 15000000.00),
(2, 1, 2, 5, 22000000.00),
(3, 2, 9, 20, 3500000.00),
(4, 2, 13, 30, 1200000.00),
(5, 2, 15, 25, 1400000.00),
(6, 3, 20, 15, 2000000.00),
(7, 3, 22, 10, 6500000.00),
(8, 4, 23, 50, 250000.00),
(9, 4, 25, 20, 1200000.00),
(10, 5, 4, 15, 9000000.00),
(11, 5, 8, 10, 8500000.00),
(12, 6, 11, 15, 4000000.00),
(13, 6, 18, 8, 8500000.00),
(14, 7, 3, 8, 30000000.00),
(15, 8, 20, 12, 2000000.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `returns`
--

CREATE TABLE `returns` (
  `id` int(11) NOT NULL,
  `return_number` varchar(50) NOT NULL,
  `order_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `reason` text NOT NULL,
  `refund_amount` decimal(15,2) NOT NULL,
  `status` enum('pending','approved','rejected','completed') DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `return_items`
--

CREATE TABLE `return_items` (
  `id` int(11) NOT NULL,
  `return_id` int(11) NOT NULL,
  `order_item_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `comment` text DEFAULT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Array of image URLs' CHECK (json_valid(`images`)),
  `is_verified` tinyint(1) DEFAULT 0 COMMENT 'Đã mua hàng',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `reviews`
--

INSERT INTO `reviews` (`id`, `product_id`, `user_id`, `order_id`, `rating`, `comment`, `images`, `is_verified`, `created_at`) VALUES
(1, 2, 6, 1, 5, 'Laptop rất tốt, chạy mượt, thiết kế đẹp!', NULL, 1, '2025-11-28 09:52:31'),
(2, 11, 7, 2, 4, 'CPU chạy ổn, giá hợp lý', NULL, 1, '2025-11-28 09:52:31'),
(3, 7, 8, 3, 5, 'Máy gaming cực mạnh, chơi game siêu mượt!', NULL, 1, '2025-11-28 09:52:31'),
(4, 4, 9, 4, 3, 'Máy tạm được, hơi chậm khi mở nhiều tab', NULL, 1, '2025-11-28 09:52:31'),
(5, 22, 10, 5, 5, 'Màn hình đẹp, màu sắc chuẩn, 165Hz mượt lắm', NULL, 1, '2025-11-28 09:52:31'),
(6, 1, 11, 1, 4, 'Sản phẩm ổn, giao hàng nhanh', NULL, 0, '2025-11-28 09:52:31'),
(7, 5, 12, 2, 5, 'Laptop gaming giá rẻ chất lượng tốt', NULL, 0, '2025-11-28 09:52:31'),
(8, 3, 6, 6, 5, 'Laptop siêu mỏng nhẹ, pin tốt, màn hình sắc nét. Rất hài lòng!', NULL, 1, '2024-11-22 08:00:00'),
(9, 26, 7, 7, 4, 'Bàn phím tốt, nhưng giá hơi cao. Chất lượng build tốt.', NULL, 1, '2024-11-21 11:00:00'),
(10, 9, 8, 8, 5, 'CPU mạnh, chạy mượt, giá hợp lý. Đáng mua!', NULL, 1, '2024-11-22 13:00:00'),
(11, 14, 9, 9, 4, 'RAM tốt, RGB đẹp. Nhưng giá hơi cao so với thị trường.', NULL, 1, '2024-11-23 09:00:00'),
(12, 22, 10, 10, 5, 'Màn hình gaming tuyệt vời! 165Hz mượt mà, màu sắc chuẩn. Rất đáng tiền!', NULL, 1, '2024-11-24 12:00:00'),
(13, 15, 11, 11, 5, 'SSD nhanh, giá tốt. Cài Windows boot nhanh lắm!', NULL, 1, '2024-11-25 05:00:00'),
(14, 16, 12, 12, 4, 'SSD Gen4 nhanh, nhưng giá cao. Phù hợp cho người cần hiệu năng cao.', NULL, 1, '2024-11-26 07:00:00'),
(15, 17, 13, 13, 5, 'SSD tốt, giá hợp lý. Đáng mua hơn Samsung 980 PRO.', NULL, 1, '2024-11-27 10:00:00'),
(16, 10, 14, 14, 5, 'CPU Intel i7 mạnh mẽ, xử lý đa nhiệm tốt. Rất hài lòng!', NULL, 1, '2024-11-28 04:00:00'),
(17, 13, 15, 15, 4, 'RAM tốt, giá ổn. Nhưng không có RGB như G.Skill.', NULL, 1, '2024-11-29 06:00:00'),
(18, 26, 6, 16, 5, 'Bàn phím wireless tốt, pin lâu. Rất tiện lợi!', NULL, 1, '2024-11-30 03:00:00'),
(19, 18, 7, 17, 5, 'VGA RTX 3060 mạnh, chơi game mượt. Giá hợp lý!', NULL, 1, '2024-12-01 08:00:00'),
(20, 17, 8, 18, 4, 'SSD tốt, nhưng không nhanh bằng Samsung 980 PRO.', NULL, 1, '2024-12-02 05:00:00'),
(21, 14, 9, 19, 5, 'RAM RGB đẹp, hiệu năng tốt. Rất hài lòng!', NULL, 1, '2024-12-03 09:00:00'),
(22, 22, 10, 20, 5, 'Màn hình gaming tuyệt vời lần 2! Đã mua thêm 1 cái nữa.', NULL, 1, '2024-12-04 04:00:00'),
(23, 1, 6, 1, 4, 'Laptop tốt, nhưng pin không được lâu như quảng cáo.', NULL, 1, '2024-11-05 03:00:00'),
(24, 5, 7, 2, 5, 'Laptop gaming giá rẻ chất lượng tốt. Chơi game mượt!', NULL, 1, '2024-11-02 02:00:00'),
(25, 7, 8, 3, 5, 'Laptop gaming cực mạnh! RTX 3060 chơi game AAA mượt mà.', NULL, 1, '2024-11-05 05:00:00'),
(26, 4, 9, 4, 3, 'Laptop tạm được, nhưng RAM 4GB hơi ít. Nên nâng cấp lên 8GB.', NULL, 1, '2024-11-08 07:00:00'),
(27, 23, 11, 11, 5, 'Chuột gaming tốt, giá rẻ. RGB đẹp!', NULL, 1, '2024-11-25 06:00:00'),
(28, 24, 12, 12, 4, 'Chuột Razer nhẹ, nhưng giá cao. Chất lượng tốt.', NULL, 1, '2024-11-26 08:00:00'),
(29, 25, 13, 13, 4, 'Bàn phím cơ tốt, nhưng switch hơi ồn.', NULL, 1, '2024-11-27 11:00:00'),
(30, 28, 14, 14, 5, 'Bàn phím Corsair tuyệt vời! Cherry MX Red mượt mà.', NULL, 1, '2024-11-28 05:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL COMMENT 'admin, staff, customer',
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `created_at`) VALUES
(1, 'admin', 'Quản trị viên hệ thống', '2025-11-28 09:52:30'),
(2, 'staff', 'Nhân viên bán hàng', '2025-11-28 09:52:30'),
(3, 'customer', 'Khách hàng', '2025-11-28 09:52:30');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `staff_shifts`
--

CREATE TABLE `staff_shifts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `shift_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `stock_movements`
--

CREATE TABLE `stock_movements` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `type` enum('in','out','transfer','return') NOT NULL,
  `quantity` int(11) NOT NULL,
  `reference_type` varchar(50) DEFAULT NULL COMMENT 'order, purchase, return',
  `reference_id` int(11) DEFAULT NULL COMMENT 'ID của đơn hàng hoặc phiếu nhập',
  `notes` text DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `stock_movements`
--

INSERT INTO `stock_movements` (`id`, `product_id`, `store_id`, `type`, `quantity`, `reference_type`, `reference_id`, `notes`, `created_by`, `created_at`) VALUES
(1, 1, 1, 'in', 10, 'purchase', 1, 'Nhập hàng từ supplier ABC', 1, '2024-11-03 07:00:00'),
(2, 2, 1, 'in', 5, 'purchase', 1, 'Nhập hàng từ supplier ABC', 1, '2024-11-03 07:00:00'),
(3, 9, 1, 'in', 20, 'purchase', 2, 'Nhập CPU từ supplier XYZ', 1, '2024-11-07 03:00:00'),
(4, 13, 1, 'in', 30, 'purchase', 2, 'Nhập RAM từ supplier XYZ', 1, '2024-11-07 03:00:00'),
(5, 15, 1, 'in', 25, 'purchase', 2, 'Nhập SSD từ supplier XYZ', 1, '2024-11-07 03:00:00'),
(6, 20, 2, 'in', 15, 'purchase', 3, 'Nhập màn hình từ supplier DEF', 1, '2024-11-12 08:00:00'),
(7, 22, 2, 'in', 10, 'purchase', 3, 'Nhập màn hình gaming từ supplier DEF', 1, '2024-11-12 08:00:00'),
(8, 23, 2, 'in', 50, 'purchase', 4, 'Nhập chuột từ supplier GHI', 1, '2024-11-17 02:00:00'),
(9, 25, 2, 'in', 20, 'purchase', 4, 'Nhập bàn phím từ supplier GHI', 1, '2024-11-17 02:00:00'),
(10, 4, 3, 'in', 15, 'purchase', 5, 'Nhập laptop từ supplier ABC', 1, '2024-11-22 06:00:00'),
(11, 8, 3, 'in', 10, 'purchase', 5, 'Nhập laptop từ supplier ABC', 1, '2024-11-22 06:00:00'),
(12, 11, 3, 'in', 15, 'purchase', 6, 'Nhập CPU từ supplier XYZ', 1, '2024-11-27 04:00:00'),
(13, 18, 3, 'in', 8, 'purchase', 6, 'Nhập VGA từ supplier XYZ', 1, '2024-11-27 04:00:00'),
(14, 1, 1, 'out', 2, 'order', 1, 'Xuất kho cho đơn hàng ORD-20241101-001', 1, '2024-10-31 20:30:00'),
(15, 2, 1, 'out', 1, 'order', 6, 'Xuất kho cho đơn hàng ORD-20241120-006', 1, '2024-11-20 03:30:00'),
(16, 9, 1, 'out', 1, 'order', 8, 'Xuất kho cho đơn hàng ORD-20241122-008', 1, '2024-11-22 02:15:00'),
(17, 22, 1, 'out', 1, 'order', 10, 'Xuất kho cho đơn hàng ORD-20241124-010', 1, '2024-11-24 08:15:00'),
(18, 15, 2, 'out', 1, 'order', 11, 'Xuất kho cho đơn hàng ORD-20241125-011', 1, '2024-11-25 01:30:00'),
(19, 16, 2, 'out', 1, 'order', 12, 'Xuất kho cho đơn hàng ORD-20241126-012', 1, '2024-11-26 06:30:00'),
(20, 18, 1, 'out', 1, 'order', 17, 'Xuất kho cho đơn hàng ORD-20241201-017', 1, '2024-12-01 07:30:00'),
(21, 22, 1, 'out', 1, 'order', 20, 'Xuất kho cho đơn hàng ORD-20241204-020', 1, '2024-12-04 03:30:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `stores`
--

CREATE TABLE `stores` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `city` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `google_maps_url` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `stores`
--

INSERT INTO `stores` (`id`, `name`, `address`, `city`, `phone`, `email`, `google_maps_url`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Techzone Quận 1', '123 Nguyễn Huệ, Phường Bến Nghé', 'Hồ Chí Minh', '02838252525', 'q1@techzone.vn', 'https://maps.google.com/?q=10.7769,106.7009', 1, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(2, 'Techzone Quận 3', '456 Võ Văn Tần, Phường 5', 'Hồ Chí Minh', '02839305050', 'q3@techzone.vn', 'https://maps.google.com/?q=10.7781,106.6919', 1, '2025-11-28 09:52:31', '2025-11-28 09:52:31'),
(3, 'Techzone Hà Nội', '789 Hoàng Quốc Việt, Cầu Giấy', 'Hà Nội', '02438365656', 'hn@techzone.vn', 'https://maps.google.com/?q=21.0368,105.7955', 1, '2025-11-28 09:52:31', '2025-11-28 09:52:31');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `avatar_url` varchar(500) DEFAULT NULL,
  `role_id` int(11) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_verified` tinyint(1) DEFAULT 0,
  `store_id` int(11) DEFAULT NULL COMMENT 'Chi nhánh làm việc (nếu là nhân viên)',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_login` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `phone`, `avatar_url`, `role_id`, `is_active`, `is_verified`, `store_id`, `created_at`, `updated_at`, `last_login`) VALUES
(1, 'admin@techzone.vn', '$2b$10$5tZlV.nbUqVKkXRMFiXbwuTChNkC1G/1mcnDNzBi41/NnFIYkUtDe', 'Nguyễn Văn Admin', '0901234567', NULL, 1, 1, 1, NULL, '2025-11-28 09:52:31', '2025-12-15 10:48:47', '2025-12-15 10:48:47'),
(2, 'staff1@techzone.vn', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Trần Thị Hoa', '0902345678', NULL, 2, 0, 1, 1, '2025-11-28 09:52:31', '2025-12-12 20:02:35', NULL),
(3, 'staff2@techzone.vn', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Lê Văn Nam', '0903456789', NULL, 2, 1, 1, 2, '2025-11-28 09:52:31', '2025-11-28 09:52:31', NULL),
(4, 'staff3@techzone.vn', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Phạm Thị Lan', '0904567890', NULL, 2, 1, 1, 3, '2025-11-28 09:52:31', '2025-11-28 09:52:31', NULL),
(5, 'staff4@techzone.vn', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Hoàng Văn Minh', '0905678901', NULL, 2, 1, 1, 1, '2025-11-28 09:52:31', '2025-11-28 09:52:31', NULL),
(6, 'customer1@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Nguyễn Thị Hương', '0906789012', NULL, 3, 1, 1, NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31', NULL),
(7, 'customer2@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Trần Văn Đức', '0907890123', NULL, 3, 1, 1, NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31', NULL),
(8, 'customer3@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Lê Thị Mai', '0908901234', NULL, 3, 1, 1, NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31', NULL),
(9, 'customer4@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Phạm Văn Tùng', '0909012345', NULL, 3, 1, 1, NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31', NULL),
(10, 'customer5@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Vũ Thị Ngọc', '0900123456', NULL, 3, 1, 1, NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31', NULL),
(11, 'customer6@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Đặng Văn Hải', '0911234567', NULL, 3, 1, 1, NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31', NULL),
(12, 'customer7@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Bùi Thị Thảo', '0912345678', NULL, 3, 1, 1, NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31', NULL),
(13, 'customer8@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Võ Văn Khoa', '0913456789', NULL, 3, 1, 1, NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31', NULL),
(14, 'customer9@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Đinh Thị Yến', '0914567890', NULL, 3, 1, 1, NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31', NULL),
(15, 'customer10@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Ngô Văn Long', '0915678901', NULL, 3, 1, 1, NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31', NULL),
(16, 'customer11@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Phan Thị Hoa', '0916789012', NULL, 3, 0, 1, NULL, '2025-11-28 09:52:31', '2025-12-04 10:26:51', NULL),
(17, 'customer12@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Lý Văn Tân', '0917890123', NULL, 3, 1, 1, NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31', NULL),
(18, 'customer13@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Trương Thị Lan', '0918901234', NULL, 3, 1, 1, NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31', NULL),
(19, 'customer14@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Đỗ Văn Hùng', '0919012345', NULL, 3, 1, 1, NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31', NULL),
(20, 'customer15@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Mai Thị Phương', '0920123456', NULL, 3, 1, 1, NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31', NULL),
(21, 'customer16@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Hồ Văn Tuấn', '0921234567', NULL, 3, 1, 1, NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31', NULL),
(22, 'customer17@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Chu Thị Nhung', '0922345678', NULL, 3, 1, 1, NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31', NULL),
(23, 'customer18@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Dương Văn Sơn', '0923456789', NULL, 3, 1, 1, NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31', NULL),
(24, 'customer19@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Tô Thị Kim', '0924567890', NULL, 3, 1, 1, NULL, '2025-11-28 09:52:31', '2025-11-28 09:52:31', NULL),
(25, 'customer20@gmail.com', '$2b$10$rGfJvxKZ7Q3N9XL5yJ0zEO5J.mwxQZ3zJ0zEO5J.mwxQZ3zJ0zEO5J', 'Lưu Văn Đạt', '0925678901', NULL, 3, 0, 1, NULL, '2025-11-28 09:52:31', '2025-12-04 10:26:32', NULL),
(26, 'nguyenthuytrang18122312@gmail.com', '$2b$10$EC2xHSNXSANLeUDLsPMwKO9lNnXNJwMyuT4/EjXVHA/6Cz6B2xb4e', 'Nguyễn Trang', '0845887428', NULL, 3, 1, 1, NULL, '2025-12-04 05:36:42', '2025-12-13 13:32:47', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_login_logs`
--

CREATE TABLE `user_login_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `login_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `user_login_logs`
--

INSERT INTO `user_login_logs` (`id`, `user_id`, `ip_address`, `user_agent`, `login_at`) VALUES
(1, 1, '127.0.0.1', 'axios/1.13.2', '2025-12-02 14:56:45'),
(2, 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-02 15:01:03'),
(3, 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-02 15:02:43'),
(4, 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-02 16:29:36'),
(5, 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-02 18:13:58'),
(6, 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 05:19:19'),
(7, 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0', '2025-12-12 19:57:32'),
(8, 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0', '2025-12-13 13:33:42'),
(9, 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0', '2025-12-15 10:48:47');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vouchers`
--

CREATE TABLE `vouchers` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `discount_type` enum('percent','fixed') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `min_purchase` decimal(15,2) DEFAULT 0.00,
  `max_discount` decimal(15,2) DEFAULT NULL,
  `usage_limit` int(11) DEFAULT 1 COMMENT 'Số lần sử dụng tối đa',
  `used_count` int(11) DEFAULT 0,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `vouchers`
--

INSERT INTO `vouchers` (`id`, `code`, `name`, `description`, `discount_type`, `discount_value`, `min_purchase`, `max_discount`, `usage_limit`, `used_count`, `start_date`, `end_date`, `is_active`, `created_at`) VALUES
(1, 'WELCOME2024', 'Chào mừng khách hàng mới', 'Ưu đãi chào mừng khách mới', 'percent', 5.00, 5000000.00, NULL, 100, 0, '2024-11-01 00:00:00', '2024-12-31 00:00:00', 1, '2025-11-28 09:52:31'),
(2, 'BLACKFRIDAY', 'Black Friday Sale', 'Giảm giá sự kiện Black Friday', 'fixed', 1000000.00, 20000000.00, NULL, 50, 0, '2024-11-20 00:00:00', '2024-11-30 00:00:00', 1, '2025-11-28 09:52:31'),
(3, 'FREESHIP', 'Miễn phí vận chuyển', 'Miễn phí ship cho đơn đủ điều kiện', 'fixed', 50000.00, 2000000.00, NULL, 200, 0, '2024-11-01 00:00:00', '2024-12-31 00:00:00', 1, '2025-11-28 09:52:31');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `voucher_usage`
--

CREATE TABLE `voucher_usage` (
  `id` int(11) NOT NULL,
  `voucher_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `discount_amount` decimal(15,2) NOT NULL,
  `used_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Chỉ mục cho bảng `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_cart` (`user_id`);

--
-- Chỉ mục cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_cart_product` (`cart_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Chỉ mục cho bảng `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `idx_classification` (`classification`);

--
-- Chỉ mục cho bảng `daily_stats`
--
ALTER TABLE `daily_stats`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_date_store` (`date`,`store_id`),
  ADD KEY `store_id` (`store_id`);

--
-- Chỉ mục cho bảng `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_product_store` (`product_id`,`store_id`),
  ADD KEY `store_id` (`store_id`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD KEY `store_id` (`store_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_customer` (`customer_id`),
  ADD KEY `idx_created` (`created_at`),
  ADD KEY `idx_order_number` (`order_number`);

--
-- Chỉ mục cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `otp_codes`
--
ALTER TABLE `otp_codes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_email_type` (`email`,`type`),
  ADD KEY `idx_expires` (`expires_at`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_category` (`category_id`),
  ADD KEY `idx_brand` (`brand_id`),
  ADD KEY `idx_price` (`selling_price`),
  ADD KEY `idx_featured` (`is_featured`);
ALTER TABLE `products` ADD FULLTEXT KEY `ft_name_desc` (`name`,`description`);

--
-- Chỉ mục cho bảng `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `promotions`
--
ALTER TABLE `promotions`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `promotion_products`
--
ALTER TABLE `promotion_products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_promotion_product` (`promotion_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `store_id` (`store_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Chỉ mục cho bảng `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchase_order_id` (`purchase_order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `returns`
--
ALTER TABLE `returns`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `return_number` (`return_number`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Chỉ mục cho bảng `return_items`
--
ALTER TABLE `return_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `return_id` (`return_id`),
  ADD KEY `order_item_id` (`order_item_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `idx_product` (`product_id`),
  ADD KEY `idx_rating` (`rating`);

--
-- Chỉ mục cho bảng `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Chỉ mục cho bảng `staff_shifts`
--
ALTER TABLE `staff_shifts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `store_id` (`store_id`),
  ADD KEY `idx_staff_date` (`user_id`,`shift_date`);

--
-- Chỉ mục cho bảng `stock_movements`
--
ALTER TABLE `stock_movements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_product` (`product_id`),
  ADD KEY `idx_store` (`store_id`),
  ADD KEY `idx_type` (`type`);

--
-- Chỉ mục cho bảng `stores`
--
ALTER TABLE `stores`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role_id`);

--
-- Chỉ mục cho bảng `user_login_logs`
--
ALTER TABLE `user_login_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_login_time` (`login_at`);

--
-- Chỉ mục cho bảng `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Chỉ mục cho bảng `voucher_usage`
--
ALTER TABLE `voucher_usage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `voucher_id` (`voucher_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `carts`
--
ALTER TABLE `carts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT cho bảng `daily_stats`
--
ALTER TABLE `daily_stats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT cho bảng `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT cho bảng `otp_codes`
--
ALTER TABLE `otp_codes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT cho bảng `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- AUTO_INCREMENT cho bảng `promotions`
--
ALTER TABLE `promotions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `promotion_products`
--
ALTER TABLE `promotion_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `purchase_orders`
--
ALTER TABLE `purchase_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `returns`
--
ALTER TABLE `returns`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `return_items`
--
ALTER TABLE `return_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT cho bảng `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `staff_shifts`
--
ALTER TABLE `staff_shifts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `stock_movements`
--
ALTER TABLE `stock_movements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT cho bảng `stores`
--
ALTER TABLE `stores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT cho bảng `user_login_logs`
--
ALTER TABLE `user_login_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `voucher_usage`
--
ALTER TABLE `voucher_usage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `daily_stats`
--
ALTER TABLE `daily_stats`
  ADD CONSTRAINT `daily_stats_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`);

--
-- Các ràng buộc cho bảng `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inventory_ibfk_2` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`);

--
-- Các ràng buộc cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Các ràng buộc cho bảng `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`);

--
-- Các ràng buộc cho bảng `promotion_products`
--
ALTER TABLE `promotion_products`
  ADD CONSTRAINT `promotion_products_ibfk_1` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `promotion_products_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
--
-- Cơ sở dữ liệu: `test`
--
CREATE DATABASE IF NOT EXISTS `test` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `test`;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
