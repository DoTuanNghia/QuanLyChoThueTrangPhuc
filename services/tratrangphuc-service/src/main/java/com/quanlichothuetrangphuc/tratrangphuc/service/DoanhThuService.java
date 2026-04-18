package com.quanlichothuetrangphuc.tratrangphuc.service;

import com.quanlichothuetrangphuc.tratrangphuc.dto.HoaDonThongKeDTO;
import com.quanlichothuetrangphuc.tratrangphuc.dto.ThongKeDoanhThuDTO;

import java.util.List;

public interface DoanhThuService {
    List<ThongKeDoanhThuDTO> thongKeTheoThang();
    List<ThongKeDoanhThuDTO> thongKeTheoQuy();
    List<ThongKeDoanhThuDTO> thongKeTheoNam();

    List<HoaDonThongKeDTO> chiTietTheoThang(int nam, int thang);
    List<HoaDonThongKeDTO> chiTietTheoQuy(int nam, int quy);
    List<HoaDonThongKeDTO> chiTietTheoNam(int nam);
}
