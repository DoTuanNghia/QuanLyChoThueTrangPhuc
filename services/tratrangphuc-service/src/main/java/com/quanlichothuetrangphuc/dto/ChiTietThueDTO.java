package com.quanlichothuetrangphuc.dto;

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
    private float donGia;            // giá/ngày
    private String ngayThue;         // "dd/MM/yyyy"
    private float thanhTien;
    private long soNgayThue;         // số ngày tính đến hôm nay
    private float tienThueDenNay;    // = donGia * soNgayThue
    private boolean daTra;
}
