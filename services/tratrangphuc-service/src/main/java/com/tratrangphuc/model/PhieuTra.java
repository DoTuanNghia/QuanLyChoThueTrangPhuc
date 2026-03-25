package com.tratrangphuc.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "phieu_tra")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhieuTra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "tien_phat")
    private float tienPhat;

    @Column(name = "ngay_lap", nullable = false)
    private LocalDate ngayLap;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "nhan_vien_id")
    private NhanVien nhanVien;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "phieu_thue_id")
    private PhieuThue phieuThue;

    @OneToMany(mappedBy = "phieuTra", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<ChiTietTra> chiTietTraList;
}
