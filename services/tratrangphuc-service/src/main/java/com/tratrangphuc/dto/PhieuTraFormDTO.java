package com.tratrangphuc.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;


@Data
@NoArgsConstructor
public class PhieuTraFormDTO {
    private int phieuThueId;
    private int nhanVienId;

    // Danh sach cac chi tiet duoc tich chon tra
    private List<Integer> chiTietThueIds = new ArrayList<>();
    private List<Integer> soLuongTras    = new ArrayList<>();
    private List<Float>   tienPhats      = new ArrayList<>();
    private List<Integer> loiIds         = new ArrayList<>();
    private List<Integer> soLois         = new ArrayList<>();

    /**
     * Chuyen sang PhieuTraRequestDTO de truyen vao Service.
     */
    public PhieuTraRequestDTO toRequestDTO() {
        List<ChiTietTraRequestDTO> danhSachTra = new ArrayList<>();
        for (int i = 0; i < chiTietThueIds.size(); i++) {
            ChiTietTraRequestDTO item = new ChiTietTraRequestDTO();
            item.setChiTietThueId(chiTietThueIds.get(i));
            item.setSoLuongTra(i < soLuongTras.size() && soLuongTras.get(i) != null ? soLuongTras.get(i) : 1);
            item.setTienPhat(i < tienPhats.size() && tienPhats.get(i) != null ? tienPhats.get(i) : 0f);
            item.setLoiId(i < loiIds.size() && loiIds.get(i) != null ? loiIds.get(i) : 0);
            item.setSoLoi(i < soLois.size() && soLois.get(i) != null ? soLois.get(i) : 0);
            danhSachTra.add(item);
        }
        PhieuTraRequestDTO req = new PhieuTraRequestDTO();
        req.setPhieuThueId(phieuThueId);
        req.setNhanVienId(nhanVienId);
        req.setDanhSachTra(danhSachTra);
        return req;
    }
}
