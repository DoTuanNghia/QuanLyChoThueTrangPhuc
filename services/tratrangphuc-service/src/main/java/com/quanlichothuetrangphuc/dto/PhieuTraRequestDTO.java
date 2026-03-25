package com.quanlichothuetrangphuc.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhieuTraRequestDTO {
    private int phieuThueId;
    private int nhanVienId;
    private List<ChiTietTraRequestDTO> danhSachTra;
}
