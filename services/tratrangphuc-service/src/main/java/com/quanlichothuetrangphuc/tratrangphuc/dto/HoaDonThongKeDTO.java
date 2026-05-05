package com.quanlichothuetrangphuc.tratrangphuc.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class HoaDonThongKeDTO {
    private int phieuTraId;
    private String tenKhachHang;
    private String ngayMuon;      
    private int tongSoTrangPhuc;  
    private float tongTienHoaDon; 
}
