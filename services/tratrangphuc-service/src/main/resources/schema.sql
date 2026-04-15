-- =============================================
-- SCHEMA: costume_rental (traTrangPhuc service)
-- =============================================
CREATE DATABASE IF NOT EXISTS costume_rental CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE costume_rental;

-- Bảng Thành Viên (tblThanhVien)
CREATE TABLE IF NOT EXISTS thanh_vien (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255)
) ENGINE=InnoDB;

-- Bảng Nhân Viên (tblNhanVien) - kế thừa ThanhVien
CREATE TABLE IF NOT EXISTS nhan_vien (
    id INT PRIMARY KEY,
    position VARCHAR(255),
    FOREIGN KEY (id) REFERENCES thanh_vien(id)
) ENGINE=InnoDB;

-- Bảng Khách Hàng (tblKhachHang) - kế thừa ThanhVien
CREATE TABLE IF NOT EXISTS khach_hang (
    id INT PRIMARY KEY,
    ten VARCHAR(255) NOT NULL,
    dia_chi VARCHAR(255),
    so_dien_thoai VARCHAR(255),
    FOREIGN KEY (id) REFERENCES thanh_vien(id)
) ENGINE=InnoDB;

-- Bảng Trang Phục (tblTrangPhuc)
CREATE TABLE IF NOT EXISTS trang_phuc (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten VARCHAR(255) NOT NULL,
    don_gia FLOAT(10) NOT NULL DEFAULT 0,
    so_luong INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- Bảng Phiếu Thuê (tblPhieuThue)
CREATE TABLE IF NOT EXISTS phieu_thue (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tien_coc FLOAT(10) DEFAULT 0,
    tong_tien FLOAT(10) DEFAULT 0,
    ngay_lap DATE NOT NULL,
    loai VARCHAR(255),
    status VARCHAR(255),
    nhan_vien_id INT,
    khach_hang_id INT,
    FOREIGN KEY (nhan_vien_id) REFERENCES nhan_vien(id),
    FOREIGN KEY (khach_hang_id) REFERENCES khach_hang(id)
) ENGINE=InnoDB;

-- Bảng Chi Tiết Thuê (tblChiTietThue)
CREATE TABLE IF NOT EXISTS chi_tiet_thue (
    id INT AUTO_INCREMENT PRIMARY KEY,
    so_luong INT NOT NULL DEFAULT 1,
    thanh_tien FLOAT(10) DEFAULT 0,
    trang_phuc_id INT,
    phieu_thue_id INT,
    FOREIGN KEY (trang_phuc_id) REFERENCES trang_phuc(id),
    FOREIGN KEY (phieu_thue_id) REFERENCES phieu_thue(id)
) ENGINE=InnoDB;

-- Bảng Phiếu Trả (tblPhieuTra)
CREATE TABLE IF NOT EXISTS phieu_tra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tien_phat FLOAT(10) DEFAULT 0,
    ngay_lap DATE NOT NULL,
    nhan_vien_id INT,
    phieu_thue_id INT,
    FOREIGN KEY (nhan_vien_id) REFERENCES nhan_vien(id),
    FOREIGN KEY (phieu_thue_id) REFERENCES phieu_thue(id)
) ENGINE=InnoDB;

-- Bảng Chi Tiết Trả (tblChiTietTra)
CREATE TABLE IF NOT EXISTS chi_tiet_tra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    so_luong INT NOT NULL DEFAULT 1,
    thanh_tien FLOAT(10) DEFAULT 0,
    trang_phuc_id INT,
    phieu_tra_id INT,
    FOREIGN KEY (trang_phuc_id) REFERENCES trang_phuc(id),
    FOREIGN KEY (phieu_tra_id) REFERENCES phieu_tra(id)
) ENGINE=InnoDB;

-- Bảng Thống Kê Doanh Thu (tblTKDoanhThu)
CREATE TABLE IF NOT EXISTS tk_doanh_thu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    loai_doanh_thu VARCHAR(255),
    tong_doanh_thu FLOAT(10) DEFAULT 0,
    so_hoa_don INT DEFAULT 0
) ENGINE=InnoDB;
