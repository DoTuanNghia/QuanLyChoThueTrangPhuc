-- =============================================
-- SCHEMA: loihongphat_db
-- =============================================
CREATE DATABASE IF NOT EXISTS loihongphat_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE loihongphat_db;

CREATE TABLE IF NOT EXISTS loi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten_loi VARCHAR(100) NOT NULL,
    muc_phat FLOAT DEFAULT 0,
    mo_ta VARCHAR(300)
) ENGINE=InnoDB;

-- Dữ liệu mẫu
INSERT INTO loi (ten_loi, muc_phat, mo_ta) VALUES
('Rách nhẹ', 50000, 'Vải bị rách nhỏ'),
('Rách nặng', 200000, 'Vải bị rách lớn'),
('Mất nút', 30000, 'Thiếu nút áo'),
('Bẩn không rửa được', 150000, 'Vết bẩn cứng đã qua giặt vẫn còn'),
('Thiếu phụ kiện', 80000, 'Mất thắt lưng, cài áo...');
