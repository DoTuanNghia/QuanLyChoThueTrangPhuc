-- =============================================
-- SCHEMA: loihongphat_db
-- =============================================
CREATE DATABASE IF NOT EXISTS loihongphat_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE loihongphat_db;

-- Bảng Lỗi (Source of Truth cho tất cả service)
CREATE TABLE IF NOT EXISTS loi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten_loi VARCHAR(100) NOT NULL,
    muc_phat FLOAT DEFAULT 0,
    mo_ta VARCHAR(300)
) ENGINE=InnoDB;

-- Dữ liệu mẫu khởi tạo
INSERT INTO loi (ten_loi, muc_phat, mo_ta) VALUES
('Rách nhẹ', 50000, 'Vải bị rách nhỏ, có thể sửa được'),
('Rách nặng', 200000, 'Vải bị rách lớn, khó phục hồi'),
('Mất nút', 30000, 'Thiếu nút áo hoặc phụ kiện đính kèm nhỏ'),
('Bẩn không rửa được', 150000, 'Vết bẩn cứng đã qua giặt tẩy vẫn còn'),
('Thiếu phụ kiện', 80000, 'Mất thắt lưng, cài áo, hoặc phụ kiện đi kèm bộ'),
('Cháy vải', 300000, 'Vết cháy do thuốc lá hoặc bàn là'),
('Hỏng khóa kéo', 40000, 'Khóa kéo bị kẹt hoặc gãy'),
('Phai màu', 120000, 'Trang phục bị phai màu do hóa chất hoặc giặt sai cách');
