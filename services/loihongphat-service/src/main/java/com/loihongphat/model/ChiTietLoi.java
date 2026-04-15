package com.loihongphat.model;

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

    @Column(name = "tong_loi")
    private int tongLoi;

    @Column(name = "tien_phat")
    private float tienPhat;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "loi_id")
    private Loi loi;

    // Cross-service reference to ChiTietTra in tratrangphuc-service
    @Column(name = "chi_tiet_tra_id")
    private Integer chiTietTraId;
}
