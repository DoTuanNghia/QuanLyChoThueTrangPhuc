package com.quanlichothuetrangphuc.tratrangphuc.service;

import com.quanlichothuetrangphuc.tratrangphuc.model.KhachHang;
import java.util.List;

public interface KhachHangService {
    List<KhachHang> timTheoTen(String ten);
    List<KhachHang> timTatCa();
    KhachHang layTheoId(int id);
}
