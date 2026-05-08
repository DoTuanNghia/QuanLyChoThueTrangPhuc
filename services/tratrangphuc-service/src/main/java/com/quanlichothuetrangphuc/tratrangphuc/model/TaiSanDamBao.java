package com.quanlichothuetrangphuc.tratrangphuc.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Tài sản đảm bảo: mỗi phiếu thuê có thể có nhiều tài sản đảm bảo.
 * VD: CCCD, thẻ sinh viên, bằng lái xe, v.v.
 */
@Entity
@Table(name = "tai_san_dam_bao")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaiSanDamBao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    /**
     * Loại tài sản: CCCD, THE_SINH_VIEN, BANG_LAI_XE, CHUNG_MINH_THU, KHAC
     */
    @Column(name = "loai", length = 100, nullable = false)
    private String loai;

    /**
     * Mô tả chi tiết: số CCCD, mã thẻ SV, số bằng lái...
     */
    @Column(name = "mo_ta", length = 500)
    private String moTa;

    /**
     * Đã được trả lại cho khách hàng chưa
     */
    @Column(name = "da_tra")
    private boolean daTra = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phieu_thue_id", nullable = false)
    @JsonBackReference
    private PhieuThue phieuThue;
}
