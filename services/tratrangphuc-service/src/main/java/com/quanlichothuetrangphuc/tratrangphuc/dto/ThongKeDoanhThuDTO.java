package com.quanlichothuetrangphuc.tratrangphuc.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Một dòng trong bảng thống kê doanh thu (tháng / quý / năm)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThongKeDoanhThuDTO {
    private String tenPeriod;    // "Tháng 1/2025" | "Quý 1/2025" | "Năm 2025"
    private int nam;
    private int period;          // tháng (1-12) | quý (1-4) | năm (same as nam)
    private float tongDoanhThu;
    private int soHoaDon;
}
