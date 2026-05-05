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

    
    private List<HoaDonChiTietDTO> danhSachChiTiet;

    
    private float tongTienThue;    
    private float tongTienPhat;    
    private float tongThanhToan;   
    private float soTienConLai;    
}
