package com.quanlichothuetrangphuc.tratrangphuc.service.impl;

import com.quanlichothuetrangphuc.tratrangphuc.model.KhachHang;
import com.quanlichothuetrangphuc.tratrangphuc.repository.KhachHangRepository;
import com.quanlichothuetrangphuc.tratrangphuc.service.KhachHangService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class KhachHangServiceImpl implements KhachHangService {

    private final KhachHangRepository khachHangRepository;

    @Override
    public List<KhachHang> timTheoTen(String ten) {
        return khachHangRepository.findKhachHangCoDoThueTheoTen(ten);
    }

    @Override
    public List<KhachHang> timTatCa() {
        return khachHangRepository.findKhachHangCoDoThue();
    }

    @Override
    public KhachHang layTheoId(int id) {
        return khachHangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng id=" + id));
    }
}
