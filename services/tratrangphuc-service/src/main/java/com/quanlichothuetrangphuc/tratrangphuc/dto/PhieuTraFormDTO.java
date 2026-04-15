package com.quanlichothuetrangphuc.tratrangphuc.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
public class PhieuTraFormDTO {
    private int phieuThueId;
    private int nhanVienId;

    // Danh sach cac trang phuc duoc tich chon tra
    private List<Integer> trangPhucIds = new ArrayList<>();
    private List<Integer> soLuongTras = new ArrayList<>();
    private List<Integer> loiIds = new ArrayList<>();
    private List<Integer> soLois = new ArrayList<>();

    /**
     * Chuyen sang PhieuTraRequestDTO de truyen vao Service.
     */
    public PhieuTraRequestDTO toRequestDTO() {
        List<ChiTietTraRequestDTO> danhSachTra = new ArrayList<>();
        for (int i = 0; i < trangPhucIds.size(); i++) {
            ChiTietTraRequestDTO item = new ChiTietTraRequestDTO();
            item.setTrangPhucId(trangPhucIds.get(i));
            item.setSoLuongTra(i < soLuongTras.size() && soLuongTras.get(i) != null ? soLuongTras.get(i) : 1);
            
            int loiId = i < loiIds.size() && loiIds.get(i) != null ? loiIds.get(i) : 0;
            int soLoi = i < soLois.size() && soLois.get(i) != null ? soLois.get(i) : 0;
            if (loiId > 0 && soLoi > 0) {
                LoiPhatRequest loiPhatRequest = new LoiPhatRequest(loiId, soLoi);
                List<LoiPhatRequest> dsLoi = new ArrayList<>();
                dsLoi.add(loiPhatRequest);
                item.setDanhSachLoi(dsLoi);
            }
            danhSachTra.add(item);
        }
        PhieuTraRequestDTO req = new PhieuTraRequestDTO();
        req.setPhieuThueId(phieuThueId);
        req.setNhanVienId(nhanVienId);
        req.setDanhSachTra(danhSachTra);
        return req;
    }
}
