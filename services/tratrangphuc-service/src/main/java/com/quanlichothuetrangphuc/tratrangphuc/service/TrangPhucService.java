package com.quanlichothuetrangphuc.tratrangphuc.service;

import com.quanlichothuetrangphuc.tratrangphuc.model.TrangPhuc;
import com.quanlichothuetrangphuc.tratrangphuc.repository.TrangPhucRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TrangPhucService {

    private final TrangPhucRepository trangPhucRepository;

    public List<TrangPhuc> layTatCa() {
        return trangPhucRepository.findAll();
    }

    public List<TrangPhuc> timTheoTen(String ten) {
        return trangPhucRepository.findByTenContainingIgnoreCase(ten);
    }

    public TrangPhuc layTheoId(int id) {
        return trangPhucRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy trang phục id=" + id));
    }
}
