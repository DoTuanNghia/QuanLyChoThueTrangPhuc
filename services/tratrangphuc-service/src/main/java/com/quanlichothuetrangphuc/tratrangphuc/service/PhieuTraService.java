package com.quanlichothuetrangphuc.tratrangphuc.service;

import com.quanlichothuetrangphuc.tratrangphuc.dto.HoaDonTraDTO;
import com.quanlichothuetrangphuc.tratrangphuc.dto.PhieuTraRequestDTO;
import com.quanlichothuetrangphuc.tratrangphuc.model.PhieuTra;

public interface PhieuTraService {
    HoaDonTraDTO preview(PhieuTraRequestDTO request);
    PhieuTra xacNhanTra(PhieuTraRequestDTO request);
    HoaDonTraDTO layChiTietHoaDon(int phieuTraId);
}
