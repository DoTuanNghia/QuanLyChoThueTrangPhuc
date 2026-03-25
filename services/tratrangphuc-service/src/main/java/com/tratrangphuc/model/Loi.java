package com.tratrangphuc.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "loi")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Loi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "ten_loi", nullable = false, length = 100)
    private String tenLoi;

    @Column(name = "muc_phat")
    private float mucPhat;

    @Column(name = "mo_ta", length = 300)
    private String moTa;
}
