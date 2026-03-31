package com.quanlichothuetrangphuc.tratrangphuc.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "trang_phuc")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrangPhuc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, length = 200)
    private String ten;

    @Column(name = "don_gia")
    private float donGia;

    @Column(name = "so_luong")
    private int soLuong;

    @Column(name = "so_luong_thue")
    private int soLuongThue;
}
