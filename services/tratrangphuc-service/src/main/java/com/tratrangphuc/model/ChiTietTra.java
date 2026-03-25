package com.tratrangphuc.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Entity
@Table(name = "chi_tiet_tra")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietTra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "so_luong")
    private int soLuong;

    @Column(name = "tinh_trang", length = 200)
    private String tinhTrang;

    @Column(name = "tien_phat")
    private float tienPhat;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "chi_tiet_thue_id")
    private ChiTietThue chiTietThue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phieu_tra_id")
    private PhieuTra phieuTra;

    @OneToMany(mappedBy = "chiTietTra", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<ChiTietLoi> chiTietLoiList;
}
