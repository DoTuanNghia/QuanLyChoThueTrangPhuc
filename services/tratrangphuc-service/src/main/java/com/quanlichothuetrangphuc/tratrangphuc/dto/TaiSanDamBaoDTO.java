package com.quanlichothuetrangphuc.tratrangphuc.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * DTO đại diện cho một tài sản đảm bảo trong phiếu thuê.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaiSanDamBaoDTO {
    private int id;
    private String loai;        // CCCD, THE_SINH_VIEN, BANG_LAI_XE, CHUNG_MINH_THU, KHAC
    private String moTa;        // Mô tả chi tiết
    private boolean daTra;      // Đã trả lại cho KH chưa
    private int phieuThueId;
}
