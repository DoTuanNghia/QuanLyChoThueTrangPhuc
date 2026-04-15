package com.quanlichothuetrangphuc.tratrangphuc.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "tk_doanh_thu")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TKDoanhThu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "loai_doanh_thu", length = 255)
    private String loaiDoanhThu;

    @Column(name = "tong_doanh_thu")
    private float tongDoanhThu;

    @Column(name = "so_hoa_don")
    private int soHoaDon;
}
