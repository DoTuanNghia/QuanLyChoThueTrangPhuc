package com.quanlichothuetrangphuc.tratrangphuc.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Thông tin 1 hóa đơn (phiếu thue) trong chi tiết thống kê
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HoaDonThongKeDTO {
    private int phieuTraId;
    private String tenKhachHang;
    private String ngayMuon;      // ngayLap của phieuThue
    private int tongSoTrangPhuc;  // tổng soLuong các chiTietTra
    private float tongTienHoaDon; // tổng thanhTien các chiTietTra
}
