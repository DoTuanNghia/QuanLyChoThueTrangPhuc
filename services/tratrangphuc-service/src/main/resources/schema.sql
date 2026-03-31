-- =============================================
-- SCHEMA: costume_rental (quan_ly_cho_thue_trang_phuc)
-- =============================================
CREATE DATABASE IF NOT EXISTS costume_rental CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE costume_rental;

-- Bảng Khách Hàng
CREATE TABLE IF NOT EXISTS khach_hang (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten VARCHAR(100) NOT NULL,
    dia_chi VARCHAR(200),
    so_dien_thoai VARCHAR(20)
) ENGINE=InnoDB;

-- Bảng Nhân Viên
CREATE TABLE IF NOT EXISTS nhan_vien (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten VARCHAR(100) NOT NULL,
    ngay_sinh DATE,
    dia_chi VARCHAR(200),
    so_dien_thoai VARCHAR(20)
) ENGINE=InnoDB;

-- Bảng Trang Phục
CREATE TABLE IF NOT EXISTS trang_phuc (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten VARCHAR(200) NOT NULL,
    don_gia FLOAT NOT NULL DEFAULT 0,
    so_luong INT NOT NULL DEFAULT 0,
    so_luong_thue INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- Bảng Phiếu Thuê
CREATE TABLE IF NOT EXISTS phieu_thue (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tien_coc FLOAT DEFAULT 0,
    tong_tien FLOAT DEFAULT 0,
    ngay_lap DATE NOT NULL,
    nhan_vien_id INT,
    khach_hang_id INT,
    FOREIGN KEY (nhan_vien_id) REFERENCES nhan_vien(id),
    FOREIGN KEY (khach_hang_id) REFERENCES khach_hang(id)
) ENGINE=InnoDB;

-- Bảng Chi Tiết Thuê
CREATE TABLE IF NOT EXISTS chi_tiet_thue (
    id INT AUTO_INCREMENT PRIMARY KEY,
    so_luong INT NOT NULL DEFAULT 1,
    so_luong_da_tra INT NOT NULL DEFAULT 0,
    thanh_tien FLOAT DEFAULT 0,
    trang_phuc_id INT,
    phieu_thue_id INT,
    da_tra TINYINT(1) NOT NULL DEFAULT 0,
    FOREIGN KEY (trang_phuc_id) REFERENCES trang_phuc(id),
    FOREIGN KEY (phieu_thue_id) REFERENCES phieu_thue(id)
) ENGINE=InnoDB;


-- Bảng Phiếu Trả
CREATE TABLE IF NOT EXISTS phieu_tra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tien_phat FLOAT DEFAULT 0,
    ngay_lap DATE NOT NULL,
    nhan_vien_id INT,
    phieu_thue_id INT,
    FOREIGN KEY (nhan_vien_id) REFERENCES nhan_vien(id),
    FOREIGN KEY (phieu_thue_id) REFERENCES phieu_thue(id)
) ENGINE=InnoDB;

-- Bảng Chi Tiết Trả
CREATE TABLE IF NOT EXISTS chi_tiet_tra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    so_luong INT NOT NULL DEFAULT 1,
    tinh_trang VARCHAR(200),
    tien_phat FLOAT DEFAULT 0,
    chi_tiet_thue_id INT,
    phieu_tra_id INT,
    FOREIGN KEY (chi_tiet_thue_id) REFERENCES chi_tiet_thue(id),
    FOREIGN KEY (phieu_tra_id) REFERENCES phieu_tra(id)
) ENGINE=InnoDB;

-- Bảng Chi Tiết Lỗi (Không FK tới bảng loi của DB này)
CREATE TABLE IF NOT EXISTS chi_tiet_loi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    loi_id INT,
    ten_loi VARCHAR(100),
    muc_phat FLOAT DEFAULT 0,
    tong_loi INT DEFAULT 0,
    tien_phat FLOAT DEFAULT 0,
    chi_tiet_tra_id INT,
    FOREIGN KEY (chi_tiet_tra_id) REFERENCES chi_tiet_tra(id)
) ENGINE=InnoDB;

-- ---------------------------------------------
-- DỮ LIỆU MẪU KHỞI TẠO
-- ---------------------------------------------

-- 1. Nhân viên
INSERT INTO nhan_vien (ten, ngay_sinh, dia_chi, so_dien_thoai) VALUES
('Nguyễn Văn An', '1995-03-10', '123 Nguyễn Huệ, TP.HCM', '0901234567'),
('Trần Thị Bình', '1998-07-22', '45 Lê Lợi, Hà Nội', '0912345678');

-- 2. Khách hàng
INSERT INTO khach_hang (ten, dia_chi, so_dien_thoai) VALUES
('Nguyễn Thị Lan', '12 Trần Phú, TP.HCM', '0909111222'),
('Nguyễn Văn Hùng', '89 Võ Thị Sáu, Đà Nẵng', '0909333444'),
('Phạm Thị Mai', '34 Lý Thường Kiệt, Huế', '0909555666');

-- 3. Trang phục
INSERT INTO trang_phuc (ten, don_gia, so_luong, so_luong_thue) VALUES
('Áo dài cô dâu đỏ', 150000, 50, 0),
('Vest chú rể đen', 120000, 40, 0),
('Váy công chúa tím', 180000, 30, 0),
('Áo Tấc lụa xanh', 160000, 50, 0);

-- 4. Phiếu thuê
INSERT INTO phieu_thue (tien_coc, tong_tien, ngay_lap, nhan_vien_id, khach_hang_id) VALUES
(500000, 500000, '2026-03-15', 1, 1),
(300000, 120000, '2026-03-20', 1, 2);

-- 5. Chi tiết thuê
INSERT INTO chi_tiet_thue (so_luong, thanh_tien, trang_phuc_id, phieu_thue_id, da_tra) VALUES
(2, 300000, 1, 1, 1),
(1, 120000, 2, 2, 0);

-- 6. Phiếu trả (Lịch sử trả đồ)
INSERT INTO phieu_tra (tien_phat, ngay_lap, nhan_vien_id, phieu_thue_id) VALUES
(50000, '2026-03-20', 1, 1);

-- 7. Chi tiết trả
INSERT INTO chi_tiet_tra (so_luong, tinh_trang, tien_phat, chi_tiet_thue_id, phieu_tra_id) VALUES
(2, 'Có 1 cái bị rách nhẹ', 50000, 1, 1);

-- 8. Chi tiết lỗi (Lưu snapshot từ loihongphat-service)
INSERT INTO chi_tiet_loi (loi_id, ten_loi, muc_phat, tong_loi, tien_phat, chi_tiet_tra_id) VALUES
(1, 'Rách nhẹ', 50000, 1, 50000, 1);
