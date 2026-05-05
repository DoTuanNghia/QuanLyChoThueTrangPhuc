package com.quanlichothuetrangphuc.tratrangphuc.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HoaDonChiTietDTO {
    private String tenTrangPhuc;
    private int soLuong;
    private float donGia;
    private String ngayThue;          
    private long soNgayThue;
    private float tienThue;
    private float tienPhat;           
    private List<ChiTietLoiViewDTO> danhSachLoi;  
    private float tongCong;          
}
