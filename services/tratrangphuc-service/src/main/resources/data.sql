-- =============================================
-- DỮ LIỆU MẪU
-- =============================================
USE costume_rental;

-- Nhân viên
INSERT INTO nhan_vien (ten, ngay_sinh, dia_chi, so_dien_thoai) VALUES
('Nguyễn Văn An', '1995-03-10', '123 Nguyễn Huệ, TP.HCM', '0901234567'),
('Trần Thị Bình', '1998-07-22', '45 Lê Lợi, Hà Nội', '0912345678');

-- Khách hàng
INSERT INTO khach_hang (ten, dia_chi, so_dien_thoai) VALUES
('Nguyễn Thị Lan', '12 Trần Phú, TP.HCM', '0909111222'),
('Nguyễn Văn Hùng', '89 Võ Thị Sáu, Đà Nẵng', '0909333444'),
('Phạm Thị Mai', '34 Lý Thường Kiệt, Huế', '0909555666'),
('Lê Hoàng Nam', '56 Đinh Tiên Hoàng, TP.HCM', '0909777888');

-- Trang phục
INSERT INTO trang_phuc (ten, don_gia, so_luong, so_luong_thue) VALUES
('Áo dài cô dâu đỏ', 150000, 50, 0),
('Vest chú rể đen', 120000, 40, 0),
('Áo dài truyền thống xanh', 100000, 60, 0),
('Váy công chúa tím', 180000, 30, 0),
('Áo dài tím hoa văn', 130000, 50, 0),
('Bộ vest xám bạc', 110000, 40, 0);

-- Lỗi trang phục
INSERT INTO loi (ten_loi, muc_phat, mo_ta) VALUES
('Rách nhẹ', 50000, 'Vải bị rách nhỏ'),
('Rách nặng', 200000, 'Vải bị rách lớn'),
('Mất nút', 30000, 'Thiếu nút áo'),
('Bẩn không rửa được', 150000, 'Vết bẩn cứng đã qua giặt vẫn còn'),
('Thiếu phụ kiện', 80000, 'Mất thắt lưng, cài áo...');

-- Phiếu thuê 1 (KH Nguyễn Thị Lan - ngày 15/3/2026)
INSERT INTO phieu_thue (tien_coc, tong_tien, ngay_lap, nhan_vien_id, khach_hang_id) VALUES
(500000, 430000, '2026-03-15', 1, 1);

-- Chi tiết thuê của phiếu 1
INSERT INTO chi_tiet_thue (so_luong, thanh_tien, trang_phuc_id, phieu_thue_id, da_tra) VALUES
(15, 2250000, 1, 1, 0),  -- Áo dài cô dâu đỏ (Số lượng lớn)
(10, 1000000, 3, 1, 0),  -- Áo dài truyền thống xanh (Số lượng lớn)
(1, 180000, 4, 1, 0);  -- Váy công chúa tím

-- Phiếu thuê 2 (KH Nguyễn Văn Hùng - ngày 20/3/2026)
INSERT INTO phieu_thue (tien_coc, tong_tien, ngay_lap, nhan_vien_id, khach_hang_id) VALUES
(300000, 230000, '2026-03-20', 1, 2);

-- Chi tiết thuê của phiếu 2
INSERT INTO chi_tiet_thue (so_luong, thanh_tien, trang_phuc_id, phieu_thue_id, da_tra) VALUES
(1, 120000, 2, 2, 0),  -- Vest chú rể đen
(1, 110000, 6, 2, 0);  -- Bộ vest xám bạc

-- Phiếu thuê 3 (KH Phạm Thị Mai - ngày 22/3/2026)
INSERT INTO phieu_thue (tien_coc, tong_tien, ngay_lap, nhan_vien_id, khach_hang_id) VALUES
(400000, 260000, '2026-03-22', 2, 3);

-- Chi tiết thuê của phiếu 3
INSERT INTO chi_tiet_thue (so_luong, thanh_tien, trang_phuc_id, phieu_thue_id, da_tra) VALUES
(1, 130000, 5, 3, 0),  -- Áo dài tím hoa văn
(1, 130000, 5, 3, 0);  -- Thêm 1 cái nữa cùng loại

-- KHÁCH HÀNG MỚI (Từ ID 5 đến 14)
INSERT INTO khach_hang (ten, dia_chi, so_dien_thoai) VALUES
('Trần Hoàng Bách', '120 Bạch Đằng, Hà Nội', '0981112233'),
('Lê Thị Diễm', '45 Hùng Vương, Đà Nẵng', '0982223344'),
('Phan Văn Khánh', '88 Trương Định, TP.HCM', '0983334455'),
('Vũ Tú Anh', '12 Nguyễn Trãi, Cần Thơ', '0984445566'),
('Hồ Quang Hiếu', '34 Lê Duẩn, Hải Phòng', '0985556677'),
('Đặng Thu Thảo', '56 Nguyễn Viết Xuân, Nam Định', '0986667788'),
('Bùi Tấn Trường', '78 Tôn Đức Thắng, An Giang', '0987778899'),
('Lâm Chi Khanh', '90 Trần Hưng Đạo, Vũng Tàu', '0988889900'),
('Nguyễn Đình Thi', '102 Phan Bội Châu, Nghệ An', '0989990011'),
('Trịnh Trọng Cường', '14 Lý Thái Tổ, Bắc Ninh', '0980001122');

-- TRANG PHỤC MỚI (Từ ID 7 đến 16)
INSERT INTO trang_phuc (ten, don_gia, so_luong, so_luong_thue) VALUES
('Áo dài ngũ thân đen', 150000, 100, 0),
('Áo Bà Ba nam nâu', 80000, 150, 0),
('Áo Bà Ba nữ lụa vàng', 90000, 150, 0),
('Váy dạ hội đuôi cá bạc', 250000, 40, 0),
('Váy dạ hội xẻ đùi đỏ', 220000, 30, 0),
('Sườn xám đỏ rồng vàng', 140000, 80, 0),
('Áo Tấc lụa xanh', 160000, 50, 0),
('Đồ âu phục trắng', 130000, 100, 0),
('Áo yếm lụa đào', 70000, 200, 0),
('Trang phục múa lân', 300000, 20, 0);

-- PHIẾU THUÊ MỚI (Từ ID 4 đến 11) VÀ CHI TIẾT THUÊ
-- Phiếu 4: KH Bách (ID 5) - thuê từ 23/3/2026
INSERT INTO phieu_thue (tien_coc, tong_tien, ngay_lap, nhan_vien_id, khach_hang_id) VALUES
(2000000, 2300000, '2026-03-23', 1, 5);
INSERT INTO chi_tiet_thue (so_luong, thanh_tien, trang_phuc_id, phieu_thue_id, da_tra) VALUES
(10, 1500000, 7, 4, 0),  -- Thuê 10 bộ Áo dài ngũ thân
(10, 800000, 8, 4, 0);   -- Thuê 10 bộ Áo bà ba nam

-- Phiếu 5: KH Diễm (ID 6) - thuê từ 21/3/2026
INSERT INTO phieu_thue (tien_coc, tong_tien, ngay_lap, nhan_vien_id, khach_hang_id) VALUES
(3000000, 5600000, '2026-03-21', 2, 6);
INSERT INTO chi_tiet_thue (so_luong, thanh_tien, trang_phuc_id, phieu_thue_id, da_tra) VALUES
(20, 2800000, 12, 5, 0), -- Thuê 20 Sườn xám
(10, 1400000, 12, 5, 0); 

-- Phiếu 6: KH Khánh (ID 7) - thuê từ 19/3/2026 (Đã quá hạn lâu)
INSERT INTO phieu_thue (tien_coc, tong_tien, ngay_lap, nhan_vien_id, khach_hang_id) VALUES
(5000000, 7000000, '2026-03-19', 1, 7);
INSERT INTO chi_tiet_thue (so_luong, thanh_tien, trang_phuc_id, phieu_thue_id, da_tra) VALUES
(20, 5000000, 10, 6, 0), -- Thuê 20 Váy dạ hội đuôi cá
(10, 2000000, 11, 6, 0);

-- Phiếu 7: KH Tú Anh (ID 8) - thuê từ 24/3/2026
INSERT INTO phieu_thue (tien_coc, tong_tien, ngay_lap, nhan_vien_id, khach_hang_id) VALUES
(2000000, 3100000, '2026-03-24', 2, 8);
INSERT INTO chi_tiet_thue (so_luong, thanh_tien, trang_phuc_id, phieu_thue_id, da_tra) VALUES
(10, 1500000, 1, 7, 0),
(10, 1600000, 13, 7, 0);

-- Phiếu 8: KH Hiếu (ID 9) - thuê từ 15/3/2026
INSERT INTO phieu_thue (tien_coc, tong_tien, ngay_lap, nhan_vien_id, khach_hang_id) VALUES
(5000000, 6000000, '2026-03-15', 1, 9);
INSERT INTO chi_tiet_thue (so_luong, thanh_tien, trang_phuc_id, phieu_thue_id, da_tra) VALUES
(20, 6000000, 16, 8, 0); -- Thuê 20 Trang phục múa lân

-- Phiếu 9: KH Thảo (ID 10) - thuê từ 25/3/2026 (Mới hôm nay)
INSERT INTO phieu_thue (tien_coc, tong_tien, ngay_lap, nhan_vien_id, khach_hang_id) VALUES
(2000000, 6300000, '2026-03-25', 2, 10);
INSERT INTO chi_tiet_thue (so_luong, thanh_tien, trang_phuc_id, phieu_thue_id, da_tra) VALUES
(30, 2100000, 15, 9, 0);

-- Phiếu 10: Khách Diễm (ID 6) lại thuê thêm phiếu khác
INSERT INTO phieu_thue (tien_coc, tong_tien, ngay_lap, nhan_vien_id, khach_hang_id) VALUES
(1000000, 1300000, '2026-03-25', 1, 6);
INSERT INTO chi_tiet_thue (so_luong, thanh_tien, trang_phuc_id, phieu_thue_id, da_tra) VALUES
(10, 1300000, 14, 10, 0);

-- Phiếu 11: KH Trường (ID 11) - thuê từ 10/3/2026
INSERT INTO phieu_thue (tien_coc, tong_tien, ngay_lap, nhan_vien_id, khach_hang_id) VALUES
(3000000, 3600000, '2026-03-10', 1, 11);
INSERT INTO chi_tiet_thue (so_luong, thanh_tien, trang_phuc_id, phieu_thue_id, da_tra) VALUES
(30, 3600000, 2, 11, 0);
