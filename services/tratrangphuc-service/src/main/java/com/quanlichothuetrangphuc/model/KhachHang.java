package com.quanlichothuetrangphuc.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "khach_hang")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KhachHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, length = 100)
    private String ten;

    @Column(name = "dia_chi", length = 200)
    private String diaChi;

    @Column(name = "so_dien_thoai", length = 20)
    private String soDienThoai;
}
