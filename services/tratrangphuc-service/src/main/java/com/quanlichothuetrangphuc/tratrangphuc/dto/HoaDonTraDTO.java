package com.quanlichothuetrangphuc.tratrangphuc.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HoaDonTraDTO {

    private String tenKhachHang;
    private String soDienThoaiKH;
    private String diaChiKH;

    
    private int phieuThueId;
    private String ngayThue;   
    private float tienCoc;


    private String ngayTra;   

    
    private String tenNhanVien;

    // Tài sản đảm bảo
    private String taiSanDamBao;   // Loại tài sản: THE_SINH_VIEN, CCCD, BANG_LAI_XE...
    private String moTaTaiSan;     // Mô tả chi tiết

    // Trạng thái hoàn trả
    private boolean daTraTienCoc;
    private float tienCocDaTra;
    private boolean daTraTaiSan;
    private String taiSanDaTra;

    
    private List<HoaDonChiTietDTO> danhSachChiTiet;

    
    private float tongTienThue;    
    private float tongTienPhat;    
    private float tongThanhToan;   
    private float soTienConLai;    
}
