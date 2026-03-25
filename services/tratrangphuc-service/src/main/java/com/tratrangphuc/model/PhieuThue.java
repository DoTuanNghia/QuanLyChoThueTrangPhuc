package com.tratrangphuc.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "phieu_thue")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhieuThue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "tien_coc")
    private float tienCoc;

    @Column(name = "tong_tien")
    private float tongTien;

    @Column(name = "ngay_lap", nullable = false)
    private LocalDate ngayLap;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nhan_vien_id")
    private NhanVien nhanVien;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "khach_hang_id")
    private KhachHang khachHang;

    @OneToMany(mappedBy = "phieuThue", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<ChiTietThue> chiTietThueList;
}
