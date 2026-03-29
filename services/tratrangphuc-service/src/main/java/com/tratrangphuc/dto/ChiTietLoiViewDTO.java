package com.tratrangphuc.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietLoiViewDTO {
    private String tenLoi;
    private float mucPhat;
    private int soLuong;
    private float tienPhat;   // = mucPhat * soLuong
}
