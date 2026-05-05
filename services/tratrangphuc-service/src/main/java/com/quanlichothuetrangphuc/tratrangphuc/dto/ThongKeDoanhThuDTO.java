package com.quanlichothuetrangphuc.tratrangphuc.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThongKeDoanhThuDTO {
    private String tenPeriod;    
    private int nam;
    private int period;        
    private float tongDoanhThu;
    private int soHoaDon;
}
