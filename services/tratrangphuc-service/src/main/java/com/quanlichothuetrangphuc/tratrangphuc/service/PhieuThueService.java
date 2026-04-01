package com.quanlichothuetrangphuc.tratrangphuc.service;

import com.quanlichothuetrangphuc.tratrangphuc.dto.ChiTietThueDTO;
import com.quanlichothuetrangphuc.tratrangphuc.dto.PhieuThueDTO;
import com.quanlichothuetrangphuc.tratrangphuc.dto.PhieuThueListDTO;
import com.quanlichothuetrangphuc.tratrangphuc.model.ChiTietThue;
import com.quanlichothuetrangphuc.tratrangphuc.model.PhieuThue;
import com.quanlichothuetrangphuc.tratrangphuc.repository.PhieuThueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PhieuThueService {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final PhieuThueRepository phieuThueRepository;

    public List<PhieuThueDTO> layDanhSachChuaTraTheoKH(int khachHangId) {
        List<PhieuThue> phieuThues = phieuThueRepository.findChuaTraByKhachHangId(khachHangId);
        List<PhieuThueDTO> result = new ArrayList<>();
        LocalDate homNay = LocalDate.now();

        for (PhieuThue pt : phieuThues) {
            PhieuThueDTO dto = new PhieuThueDTO();
            dto.setId(pt.getId());
            dto.setTienCoc(pt.getTienCoc());
            dto.setTongTien(pt.getTongTien());
            dto.setNgayLap(pt.getNgayLap().format(FMT));          // String "dd/MM/yyyy"
            dto.setKhachHangId(pt.getKhachHang().getId());
            dto.setTenKhachHang(pt.getKhachHang().getTen());
            dto.setSoDienThoaiKH(pt.getKhachHang().getSoDienThoai());
            dto.setDiaChiKH(pt.getKhachHang().getDiaChi());

            List<ChiTietThueDTO> cttDtos = new ArrayList<>();
            for (ChiTietThue ctt : pt.getChiTietThueList()) {
                int remaining = ctt.getSoLuong() - ctt.getSoLuongDaTra();
                if (!ctt.isDaTra() && remaining > 0) {
                    ChiTietThueDTO cttDto = new ChiTietThueDTO();
                    cttDto.setId(ctt.getId());
                    cttDto.setSoLuong(remaining); // hien thi so luong con lai
                    cttDto.setTenTrangPhuc(ctt.getTrangPhuc().getTen());
                    cttDto.setDonGia(ctt.getTrangPhuc().getDonGia());
                    cttDto.setNgayThue(pt.getNgayLap().format(FMT)); // String "dd/MM/yyyy"
                    cttDto.setThanhTien(ctt.getThanhTien());

                    long soNgay = ChronoUnit.DAYS.between(pt.getNgayLap(), homNay);
                    if (soNgay < 1) soNgay = 1;
                    cttDto.setSoNgayThue(soNgay);
                    cttDto.setTienThueDenNay(ctt.getTrangPhuc().getDonGia() * soNgay * remaining);
                    cttDto.setDaTra(false);
                    cttDtos.add(cttDto);
                }
            }
            dto.setDanhSachChuaTra(cttDtos);
            result.add(dto);
        }
        return result;
    }

    public List<PhieuThueListDTO> layTatCaDTO() {
        List<PhieuThue> phieuThues = phieuThueRepository.findAll();
        List<PhieuThueListDTO> result = new ArrayList<>();

        for (PhieuThue pt : phieuThues) {
            PhieuThueListDTO dto = new PhieuThueListDTO();
            dto.setId(pt.getId());
            dto.setNgayLap(pt.getNgayLap().format(FMT));
            dto.setTienCoc(pt.getTienCoc());
            dto.setTongTien(pt.getTongTien());
            dto.setTenKhachHang(pt.getKhachHang() != null ? pt.getKhachHang().getTen() : "");
            dto.setSoDienThoaiKH(pt.getKhachHang() != null ? pt.getKhachHang().getSoDienThoai() : "");
            result.add(dto);
        }

        return result;
    }

    public List<PhieuThue> layTatCa() {
        return phieuThueRepository.findAll();
    }

    public PhieuThue layTheoId(int id) {
        return phieuThueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay phieu thue id=" + id));
    }
}

