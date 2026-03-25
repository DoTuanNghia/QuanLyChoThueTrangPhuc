package com.tratrangphuc.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietTraRequestDTO {
    private int chiTietThueId;   // ID cua ChiTietThue can tra
    private int soLuongTra;      // So luong tra lan nay (co the < so luong thuê)
    private float tienPhat;      // Tien phat neu co loi (nhap truc tiep)
    private int loiId;           // ID loai loi (0 = khong co loi)
    private int soLoi;           // So luong loi
}
