package com.quanlichothuetrangphuc.tratrangphuc.service.impl;

import com.quanlichothuetrangphuc.tratrangphuc.model.TrangPhuc;
import com.quanlichothuetrangphuc.tratrangphuc.repository.TrangPhucRepository;
import com.quanlichothuetrangphuc.tratrangphuc.service.TrangPhucService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TrangPhucServiceImpl implements TrangPhucService {

    private final TrangPhucRepository trangPhucRepository;

    @Override
    public List<TrangPhuc> layTatCa() {
        return trangPhucRepository.findAll();
    }

    @Override
    public List<TrangPhuc> timTheoTen(String ten) {
        return trangPhucRepository.findByTenContainingIgnoreCase(ten);
    }

    @Override
    public TrangPhuc layTheoId(int id) {
        return trangPhucRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy trang phục id=" + id));
    }
}
