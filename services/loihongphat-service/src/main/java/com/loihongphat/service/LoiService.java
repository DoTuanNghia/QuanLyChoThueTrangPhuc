package com.loihongphat.service;

import com.loihongphat.dto.LoiDTO;
import com.loihongphat.model.Loi;
import com.loihongphat.repository.LoiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LoiService {

    private final LoiRepository loiRepository;

    public List<LoiDTO> layTatCa() {
        return loiRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public LoiDTO layTheoId(int id) {
        Loi loi = loiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lỗi với id=" + id));
        return toDTO(loi);
    }

    public LoiDTO them(LoiDTO dto) {
        Loi loi = new Loi();
        loi.setTenLoi(dto.getTenLoi());
        loi.setMucPhat(dto.getMucPhat());
        loi.setMoTa(dto.getMoTa());
        return toDTO(loiRepository.save(loi));
    }

    public LoiDTO sua(int id, LoiDTO dto) {
        Loi loi = loiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lỗi với id=" + id));
        loi.setTenLoi(dto.getTenLoi());
        loi.setMucPhat(dto.getMucPhat());
        loi.setMoTa(dto.getMoTa());
        return toDTO(loiRepository.save(loi));
    }

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
