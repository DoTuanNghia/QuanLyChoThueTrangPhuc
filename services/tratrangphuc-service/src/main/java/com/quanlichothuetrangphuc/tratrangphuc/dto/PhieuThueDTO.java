package com.quanlichothuetrangphuc.tratrangphuc.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhieuThueDTO {
    private int id;
    private float tienCoc;
    private float tongTien;
    private String ngayLap;  
    private String loai;    
    private String status;
    private String tenKhachHang;
    private String soDienThoaiKH;
    private String diaChiKH;
    private int khachHangId;
    // Keep for backward compat
    private String taiSanDamBao;
    private String moTaTaiSan;
    // Danh sách tài sản đảm bảo (có thể nhiều)
    private List<TaiSanDamBaoDTO> danhSachTaiSan = new ArrayList<>();
    private List<ChiTietThueDTO> danhSachChuaTra;
}
