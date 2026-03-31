package com.quanlichothuetrangphuc.tratrangphuc.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoiPhatRequest {
    private int loiId;     // ID lay tu loihongphat-service
    private int soLuong;   // So luong loi nay tren trang phuc
}
