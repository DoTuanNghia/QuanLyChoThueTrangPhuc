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
    private String ngayThue;          // "dd/MM/yyyy"
    private long soNgayThue;
    private float tienThue;
    private float tienPhat;           // tong tien phat cho item nay
    private List<ChiTietLoiViewDTO> danhSachLoi;  // breakdown theo tung loi
    private float tongCong;           // tienThue + tienPhat
}
