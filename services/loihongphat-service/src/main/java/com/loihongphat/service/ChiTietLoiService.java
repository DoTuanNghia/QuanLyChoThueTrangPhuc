package com.loihongphat.service;

import com.loihongphat.dto.ChiTietLoiDTO;
import com.loihongphat.model.ChiTietLoi;
import com.loihongphat.model.Loi;
import com.loihongphat.repository.ChiTietLoiRepository;
import com.loihongphat.repository.LoiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChiTietLoiService {

    private final ChiTietLoiRepository chiTietLoiRepository;
    private final LoiRepository loiRepository;

    public List<ChiTietLoiDTO> layTatCa() {
        return chiTietLoiRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ChiTietLoiDTO layTheoId(int id) {
        ChiTietLoi ctl = chiTietLoiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chi tiết lỗi id=" + id));
        return toDTO(ctl);
    }

    public List<ChiTietLoiDTO> layTheoChiTietTraId(int chiTietTraId) {
        return chiTietLoiRepository.findByChiTietTraId(chiTietTraId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ChiTietLoiDTO them(ChiTietLoiDTO dto) {
        Loi loi = loiRepository.findById(dto.getLoiId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lỗi id=" + dto.getLoiId()));

        ChiTietLoi ctl = new ChiTietLoi();
        ctl.setTongLoi(dto.getTongLoi());
        ctl.setTienPhat(loi.getMucPhat() * dto.getTongLoi());
        ctl.setLoi(loi);
        ctl.setChiTietTraId(dto.getChiTietTraId());
        return toDTO(chiTietLoiRepository.save(ctl));
    }

    public void xoa(int id) {
        if (!chiTietLoiRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy chi tiết lỗi id=" + id);
        }
        chiTietLoiRepository.deleteById(id);
    }

    private ChiTietLoiDTO toDTO(ChiTietLoi ctl) {
        ChiTietLoiDTO dto = new ChiTietLoiDTO();
        dto.setId(ctl.getId());
        dto.setTongLoi(ctl.getTongLoi());
        dto.setTienPhat(ctl.getTienPhat());
        dto.setLoiId(ctl.getLoi().getId());
        dto.setTenLoi(ctl.getLoi().getTenLoi());
        dto.setMucPhat(ctl.getLoi().getMucPhat());
        dto.setChiTietTraId(ctl.getChiTietTraId());
        return dto;
    }
}
