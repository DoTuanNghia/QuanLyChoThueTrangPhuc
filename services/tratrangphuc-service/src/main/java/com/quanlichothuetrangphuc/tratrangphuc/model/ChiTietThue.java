package com.quanlichothuetrangphuc.tratrangphuc.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "chi_tiet_thue")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietThue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "so_luong")
    private int soLuong;

    @Column(name = "thanh_tien")
    private float thanhTien;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "trang_phuc_id")
    private TrangPhuc trangPhuc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phieu_thue_id")
    @JsonBackReference
    private PhieuThue phieuThue;
}
