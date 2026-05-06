package com.quanlichothuetrangphuc.tratrangphuc.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
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

    @Column(name = "da_tra_tien_coc")
    private boolean daTraTienCoc;  // Đã hoàn trả tiền cọc cho KH chưa

    @Column(name = "tien_coc_da_tra")
    private float tienCocDaTra;  // Số tiền cọc đã trả lại

    @Column(name = "da_tra_tai_san")
    private boolean daTraTaiSan;  // Đã trả lại tài sản đảm bảo cho KH chưa

    @Column(name = "tai_san_da_tra", length = 500)
    private String taiSanDaTra;  // Mô tả tài sản đã trả (THE_SINH_VIEN, CCCD...)

    @OneToMany(mappedBy = "phieuTra", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<ChiTietTra> chiTietTraList;
}
