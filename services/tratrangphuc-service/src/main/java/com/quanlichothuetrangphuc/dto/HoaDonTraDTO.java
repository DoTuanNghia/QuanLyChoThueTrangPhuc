package com.quanlichothuetrangphuc.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HoaDonTraDTO {
    // Thông tin khách hàng
    private String tenKhachHang;
    private String soDienThoaiKH;
    private String diaChiKH;

    // Thông tin phiếu thuê gốc
    private int phieuThueId;
    private String ngayThue;   // "dd/MM/yyyy"
    private float tienCoc;

    // Ngày trả
    private String ngayTra;    // "dd/MM/yyyy"

    // Nhân viên
    private String tenNhanVien;

    // Danh sách chi tiết trả
    private List<HoaDonChiTietDTO> danhSachChiTiet;

    // Tổng tiền
    private float tongTienThue;    // tổng tiền thuê các TP trả
    private float tongTienPhat;    // tổng tiền phạt
    private float tongThanhToan;   // = tongTienThue + tongTienPhat
}
