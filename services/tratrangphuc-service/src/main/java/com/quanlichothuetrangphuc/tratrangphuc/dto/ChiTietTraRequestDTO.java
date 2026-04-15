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
    private int trangPhucId;              // ID trang phuc can tra
    private int soLuongTra;               // So luong tra lan nay
    private List<LoiPhatRequest> danhSachLoi = new ArrayList<>();  // Nhieu loi dong thoi
}
