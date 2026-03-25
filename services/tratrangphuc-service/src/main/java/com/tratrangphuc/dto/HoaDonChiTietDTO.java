package com.tratrangphuc.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HoaDonChiTietDTO {
    private String tenTrangPhuc;
    private int soLuong;
    private float donGia;
    private String ngayThue;   // "dd/MM/yyyy"
    private long soNgayThue;
    private float tienThue;
    private float tienPhat;
    private String tenLoi;        // null nếu không có lỗi
    private float tongCong;       // = tienThue + tienPhat
}
