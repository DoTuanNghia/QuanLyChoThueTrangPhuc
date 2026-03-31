package com.quanlichothuetrangphuc.tratrangphuc.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietTraRequestDTO {
    private int chiTietThueId;          // ID chi tiet thue can tra
    private int soLuongTra;             // So luong tra lan nay
    private List<LoiPhatRequest> danhSachLoi = new ArrayList<>();  // Nhieu loi dong thoi
}
