package com.quanlichothuetrangphuc.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhieuThueDTO {
    private int id;
    private float tienCoc;
    private float tongTien;
    private String ngayLap;   // "dd/MM/yyyy"
    private String tenKhachHang;
    private String soDienThoaiKH;
    private String diaChiKH;
    private int khachHangId;
    private List<ChiTietThueDTO> danhSachChuaTra;
}
