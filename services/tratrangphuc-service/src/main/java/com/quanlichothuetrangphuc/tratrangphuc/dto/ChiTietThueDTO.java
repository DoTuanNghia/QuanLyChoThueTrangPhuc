package com.quanlichothuetrangphuc.tratrangphuc.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietThueDTO {
    private int id;
    private int soLuong;
    private String tenTrangPhuc;
    private float donGia;            
    private String ngayThue;         
    private float thanhTien;
    private long soNgayThue;         
    private float tienThueDenNay;   
    private int trangPhucId;
}
