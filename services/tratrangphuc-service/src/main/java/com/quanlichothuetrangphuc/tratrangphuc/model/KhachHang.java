package com.quanlichothuetrangphuc.tratrangphuc.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "khach_hang")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class KhachHang extends ThanhVien {

    @Column(nullable = false, length = 255)
    private String ten;

    @Column(name = "dia_chi", length = 255)
    private String diaChi;

    @Column(name = "so_dien_thoai", length = 255)
    private String soDienThoai;
}
