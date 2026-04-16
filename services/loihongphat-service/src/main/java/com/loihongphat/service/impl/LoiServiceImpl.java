package com.loihongphat.service.impl;

import com.loihongphat.dto.LoiDTO;
import com.loihongphat.model.Loi;
import com.loihongphat.repository.LoiRepository;
import com.loihongphat.service.LoiService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LoiServiceImpl implements LoiService {

    private final LoiRepository loiRepository;

    @Override
    public List<LoiDTO> layTatCa() {
        return loiRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public LoiDTO layTheoId(int id) {
        Loi loi = loiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lỗi với id=" + id));
        return toDTO(loi);
    }

    @Override
    public LoiDTO them(LoiDTO dto) {
        Loi loi = new Loi();
        loi.setTenLoi(dto.getTenLoi());
        loi.setMucPhat(dto.getMucPhat());
        loi.setMoTa(dto.getMoTa());
        return toDTO(loiRepository.save(loi));
    }

    @Override
    public LoiDTO sua(int id, LoiDTO dto) {
        Loi loi = loiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lỗi với id=" + id));
        loi.setTenLoi(dto.getTenLoi());
        loi.setMucPhat(dto.getMucPhat());
        loi.setMoTa(dto.getMoTa());
        return toDTO(loiRepository.save(loi));
    }

    @Override
    public void xoa(int id) {
        if (!loiRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy lỗi với id=" + id);
        }
        loiRepository.deleteById(id);
    }

    private LoiDTO toDTO(Loi loi) {
        return new LoiDTO(loi.getId(), loi.getTenLoi(), loi.getMucPhat(), loi.getMoTa());
    }
}
