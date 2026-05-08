package com.quanlichothuetrangphuc.tratrangphuc.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
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

    // Tài sản đảm bảo - backward compat
    private String taiSanDamBao;
    private String moTaTaiSan;

    // Trạng thái hoàn trả cũ
    private boolean daTraTienCoc;
    private float tienCocDaTra;
    private boolean daTraTaiSan;
    private String taiSanDaTra;

    /** Tất cả tài sản đảm bảo của phiếu thuê */
    private List<TaiSanDamBaoDTO> danhSachTaiSan = new ArrayList<>();

    /** Danh sách tài sản đảm bảo sẽ được trả trong lần này (để hiển thị preview) */
    private List<TaiSanDamBaoDTO> danhSachTaiSanSeTra = new ArrayList<>();

    
    private List<HoaDonChiTietDTO> danhSachChiTiet;

    
    private float tongTienThue;    
    private float tongTienPhat;    
    private float tongThanhToan;   
    private float soTienConLai;    
}
