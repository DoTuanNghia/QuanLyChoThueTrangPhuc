-- =============================================
-- DỮ LIỆU MẪU cho traTrangPhuc service
-- =============================================
USE costume_rental;

-- 1. Thành viên (base) cho Nhân viên
INSERT INTO thanh_vien (username, password, role) VALUES
('nguyenvanan', '123456', 'NHAN_VIEN'),
('tranthibinh', '123456', 'NHAN_VIEN');

-- 2. Nhân viên
INSERT INTO nhan_vien (id, position) VALUES
(1, 'Nhân viên bán hàng'),
(2, 'Nhân viên kho');

-- 3. Thành viên (base) cho Khách hàng
INSERT INTO thanh_vien (username, password, role) VALUES
('nguyenthilan', '123456', 'KHACH_HANG'),
('nguyenvanhung', '123456', 'KHACH_HANG'),
('phamthimai', '123456', 'KHACH_HANG'),
('lehoangnam', '123456', 'KHACH_HANG'),
('tranhoangbach', '123456', 'KHACH_HANG'),
('lethidiem', '123456', 'KHACH_HANG'),
('phanvankhanh', '123456', 'KHACH_HANG'),
('vutuanh', '123456', 'KHACH_HANG'),
('hoquanghieu', '123456', 'KHACH_HANG'),
('dangthuthao', '123456', 'KHACH_HANG'),
('buitantruong', '123456', 'KHACH_HANG'),
('lamchikhanh', '123456', 'KHACH_HANG');

-- 4. Khách hàng
INSERT INTO khach_hang (id, ten, dia_chi, so_dien_thoai) VALUES
(3, 'Nguyễn Thị Lan', '12 Trần Phú, TP.HCM', '0909111222'),
(4, 'Nguyễn Văn Hùng', '89 Võ Thị Sáu, Đà Nẵng', '0909333444'),
(5, 'Phạm Thị Mai', '34 Lý Thường Kiệt, Huế', '0909555666'),
(6, 'Lê Hoàng Nam', '56 Đinh Tiên Hoàng, TP.HCM', '0909777888'),
(7, 'Trần Hoàng Bách', '120 Bạch Đằng, Hà Nội', '0981112233'),
(8, 'Lê Thị Diễm', '45 Hùng Vương, Đà Nẵng', '0982223344'),
(9, 'Phan Văn Khánh', '88 Trương Định, TP.HCM', '0983334455'),
(10, 'Vũ Tú Anh', '12 Nguyễn Trãi, Cần Thơ', '0984445566'),
(11, 'Hồ Quang Hiếu', '34 Lê Duẩn, Hải Phòng', '0985556677'),
(12, 'Đặng Thu Thảo', '56 Nguyễn Viết Xuân, Nam Định', '0986667788'),
(13, 'Bùi Tấn Trường', '78 Tôn Đức Thắng, An Giang', '0987778899'),
(14, 'Lâm Chi Khanh', '90 Trần Hưng Đạo, Vũng Tàu', '0988889900');

-- 5. Trang phục
INSERT INTO trang_phuc (ten, don_gia, so_luong) VALUES
('Áo dài cô dâu đỏ', 150000, 50),
('Vest chú rể đen', 120000, 40),
('Áo dài truyền thống xanh', 100000, 60),
('Váy công chúa tím', 180000, 30),
('Áo dài tím hoa văn', 130000, 50),
('Bộ vest xám bạc', 110000, 40),
('Áo dài ngũ thân đen', 150000, 100),
('Áo Bà Ba nam nâu', 80000, 150),
('Áo Bà Ba nữ lụa vàng', 90000, 150),
('Váy dạ hội đuôi cá bạc', 250000, 40),
('Váy dạ hội xẻ đùi đỏ', 220000, 30),
('Sườn xám đỏ rồng vàng', 140000, 80),
('Áo Tấc lụa xanh', 160000, 50),
('Đồ âu phục trắng', 130000, 100),
('Áo yếm lụa đào', 70000, 200),
('Trang phục múa lân', 300000, 20);

-- 6. Phiếu thuê
INSERT INTO phieu_thue (tien_coc, tong_tien, ngay_lap, loai, status, nhan_vien_id, khach_hang_id) VALUES
(500000, 430000, '2026-03-15', 'OFFLINE', 'DANG_THUE', 1, 3),
(300000, 230000, '2026-03-20', 'OFFLINE', 'DANG_THUE', 1, 4),
(400000, 260000, '2026-03-22', 'ONLINE', 'DANG_THUE', 2, 5),
(2000000, 2300000, '2026-03-23', 'OFFLINE', 'DANG_THUE', 1, 7),
(3000000, 5600000, '2026-03-21', 'ONLINE', 'DANG_THUE', 2, 8),
(5000000, 7000000, '2026-03-19', 'OFFLINE', 'DANG_THUE', 1, 9),
(2000000, 3100000, '2026-03-24', 'ONLINE', 'DANG_THUE', 2, 10),
(5000000, 6000000, '2026-03-15', 'OFFLINE', 'DANG_THUE', 1, 11),
(2000000, 6300000, '2026-03-25', 'ONLINE', 'DANG_THUE', 2, 12),
(1000000, 1300000, '2026-03-25', 'OFFLINE', 'DANG_THUE', 1, 8),
(3000000, 3600000, '2026-03-10', 'OFFLINE', 'DANG_THUE', 1, 13);

-- 7. Chi tiết thuê
-- Phiếu 1
INSERT INTO chi_tiet_thue (so_luong, thanh_tien, trang_phuc_id, phieu_thue_id) VALUES
(15, 2250000, 1, 1),
(10, 1000000, 3, 1),
(1, 180000, 4, 1);
-- Phiếu 2
INSERT INTO chi_tiet_thue (so_luong, thanh_tien, trang_phuc_id, phieu_thue_id) VALUES
(1, 120000, 2, 2),
(1, 110000, 6, 2);
-- Phiếu 3
INSERT INTO chi_tiet_thue (so_luong, thanh_tien, trang_phuc_id, phieu_thue_id) VALUES
(1, 130000, 5, 3),
(1, 130000, 5, 3);
-- Phiếu 4
INSERT INTO chi_tiet_thue (so_luong, thanh_tien, trang_phuc_id, phieu_thue_id) VALUES
(10, 1500000, 7, 4),
(10, 800000, 8, 4);
-- Phiếu 5
INSERT INTO chi_tiet_thue (so_luong, thanh_tien, trang_phuc_id, phieu_thue_id) VALUES
(20, 2800000, 12, 5),
(10, 1400000, 12, 5);
-- Phiếu 6
INSERT INTO chi_tiet_thue (so_luong, thanh_tien, trang_phuc_id, phieu_thue_id) VALUES
(20, 5000000, 10, 6),
(10, 2000000, 11, 6);
-- Phiếu 7
INSERT INTO chi_tiet_thue (so_luong, thanh_tien, trang_phuc_id, phieu_thue_id) VALUES
(10, 1500000, 1, 7),
(10, 1600000, 13, 7);
-- Phiếu 8
INSERT INTO chi_tiet_thue (so_luong, thanh_tien, trang_phuc_id, phieu_thue_id) VALUES
(20, 6000000, 16, 8);
-- Phiếu 9
INSERT INTO chi_tiet_thue (so_luong, thanh_tien, trang_phuc_id, phieu_thue_id) VALUES
(30, 2100000, 15, 9);
-- Phiếu 10
INSERT INTO chi_tiet_thue (so_luong, thanh_tien, trang_phuc_id, phieu_thue_id) VALUES
(10, 1300000, 14, 10);
-- Phiếu 11
INSERT INTO chi_tiet_thue (so_luong, thanh_tien, trang_phuc_id, phieu_thue_id) VALUES
(30, 3600000, 2, 11);
