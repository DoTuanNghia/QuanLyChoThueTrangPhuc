package com.quanlichothuetrangphuc.tratrangphuc.service;

import com.quanlichothuetrangphuc.tratrangphuc.dto.PhieuThueDTO;
import com.quanlichothuetrangphuc.tratrangphuc.dto.PhieuThueListDTO;
import com.quanlichothuetrangphuc.tratrangphuc.model.PhieuThue;
import java.util.List;

public interface PhieuThueService {
    List<PhieuThueDTO> layDanhSachChuaTraTheoKH(int khachHangId);
    List<PhieuThueListDTO> layTatCaDTO();
    List<PhieuThue> layTatCa();
    PhieuThue layTheoId(int id);
}
