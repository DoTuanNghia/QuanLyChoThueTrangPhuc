package com.tratrangphuc.service;

import com.tratrangphuc.model.KhachHang;
import com.tratrangphuc.repository.KhachHangRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class KhachHangService {

    private final KhachHangRepository khachHangRepository;

    public List<KhachHang> timTheoTen(String ten) {
        return khachHangRepository.findKhachHangCoDoThueTheoTen(ten);
    }

    public List<KhachHang> timTatCa() {
        return khachHangRepository.findKhachHangCoDoThue();
    }

    public KhachHang layTheoId(int id) {
        return khachHangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng id=" + id));
    }
}
