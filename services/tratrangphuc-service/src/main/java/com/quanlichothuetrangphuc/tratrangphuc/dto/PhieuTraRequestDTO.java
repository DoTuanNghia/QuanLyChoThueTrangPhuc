package com.quanlichothuetrangphuc.tratrangphuc.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhieuTraRequestDTO {
    private int phieuThueId;
    private int nhanVienId;
    private List<ChiTietTraRequestDTO> danhSachTra;
    /** Danh sách ID tài sản đảm bảo mà KH trả lại trong lần này */
    private List<Integer> danhSachTaiSanTraId = new ArrayList<>();
}

