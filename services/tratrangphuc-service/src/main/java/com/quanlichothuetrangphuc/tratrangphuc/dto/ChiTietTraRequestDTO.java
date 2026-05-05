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
    private int trangPhucId;              
    private int soLuongTra;              
    private List<LoiPhatRequest> danhSachLoi = new ArrayList<>();  
}
