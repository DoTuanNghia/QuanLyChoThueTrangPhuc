package com.quanlichothuetrangphuc.tratrangphuc.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhieuThueListDTO {
    private int id;
    private String ngayLap;        // "dd/MM/yyyy"
    private float tienCoc;
    private float tongTien;
    private String loai;           // ONLINE, OFFLINE
    private String status;
    private String tenKhachHang;
    private String soDienThoaiKH;
}
