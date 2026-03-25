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
    thanh_tien FLOAT DEFAULT 0,
    trang_phuc_id INT,
    phieu_thue_id INT,
    da_tra TINYINT(1) NOT NULL DEFAULT 0,
    FOREIGN KEY (trang_phuc_id) REFERENCES trang_phuc(id),
    FOREIGN KEY (phieu_thue_id) REFERENCES phieu_thue(id)
) ENGINE=InnoDB;

-- Bảng Lỗi (loại lỗi trang phục)
CREATE TABLE IF NOT EXISTS loi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten_loi VARCHAR(100) NOT NULL,
    muc_phat FLOAT DEFAULT 0,
    mo_ta VARCHAR(300)
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

-- Bảng Chi Tiết Lỗi
CREATE TABLE IF NOT EXISTS chi_tiet_loi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tong_loi INT DEFAULT 0,
    tien_phat FLOAT DEFAULT 0,
    chi_tiet_tra_id INT,
    loi_id INT,
    FOREIGN KEY (chi_tiet_tra_id) REFERENCES chi_tiet_tra(id),
    FOREIGN KEY (loi_id) REFERENCES loi(id)
) ENGINE=InnoDB;
