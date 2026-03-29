-- =============================================
-- MIGRATION: Tach bang loi sang loihongphat_db
-- Chay lenh nay tren costume_rental de giai phong FK
-- =============================================
USE costume_rental;

-- 1. Them cac cot moi vao chi_tiet_loi (neu chua co)
ALTER TABLE chi_tiet_loi
    ADD COLUMN IF NOT EXISTS ten_loi VARCHAR(100) DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS muc_phat FLOAT DEFAULT 0;

-- 2. Xoa rang buoc FK tu chi_tiet_loi -> loi
-- (Tim ten constraint: SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE
--  WHERE TABLE_NAME='chi_tiet_loi' AND REFERENCED_TABLE_NAME='loi')
-- Thay 'chi_tiet_loi_ibfk_2' bang ten FK thuc te trong he thong cua ban:
-- ALTER TABLE chi_tiet_loi DROP FOREIGN KEY chi_tiet_loi_ibfk_2;

-- 3. (Tuy chon) Xoa bang loi khoi costume_rental sau khi da chuyen sang loihongphat_db
-- DROP TABLE IF EXISTS loi;

-- =============================================
-- GHI CHU:
-- - Sau migration, bang loi chi ton tai trong loihongphat_db
-- - tratrangphuc-service luu loiId (int) + tenLoi (string) truc tiep
--   trong bang chi_tiet_loi de hien thi ma khong can join
-- =============================================
