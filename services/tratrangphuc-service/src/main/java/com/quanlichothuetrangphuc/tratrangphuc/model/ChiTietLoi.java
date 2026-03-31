package com.quanlichothuetrangphuc.tratrangphuc.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "chi_tiet_loi")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietLoi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // Luu loiId tu loihongphat-service (khong phai FK noi DB)
    @Column(name = "loi_id")
    private int loiId;

    // Luu ten loi de hien thi (denormalized, tranh goi FeignClient khi doc lai)
    @Column(name = "ten_loi", length = 100)
    private String tenLoi;

    // Muc phat tai thoi diem ghi nhan
    @Column(name = "muc_phat")
    private float mucPhat;

    @Column(name = "tong_loi")
    private int tongLoi;       // so luong loi nay

    @Column(name = "tien_phat")
    private float tienPhat;    // = mucPhat * tongLoi

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chi_tiet_tra_id")
    @JsonBackReference
    private ChiTietTra chiTietTra;
}
