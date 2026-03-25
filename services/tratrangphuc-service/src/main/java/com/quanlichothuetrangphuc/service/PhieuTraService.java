package com.quanlichothuetrangphuc.service;

import com.quanlichothuetrangphuc.dto.*;
import com.quanlichothuetrangphuc.model.*;
import com.quanlichothuetrangphuc.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PhieuTraService {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final PhieuTraRepository phieuTraRepository;
    private final PhieuThueRepository phieuThueRepository;
    private final ChiTietThueRepository chiTietThueRepository;
    private final LoiRepository loiRepository;
    private final NhanVienRepository nhanVienRepository;

    /** Preview hóa đơn - chưa lưu DB */
    public HoaDonTraDTO preview(PhieuTraRequestDTO request) {
        PhieuThue phieuThue = phieuThueRepository.findById(request.getPhieuThueId())
                .orElseThrow(() -> new RuntimeException("Khong tim thay phieu thue"));

        NhanVien nhanVien = nhanVienRepository.findById(request.getNhanVienId())
                .orElseThrow(() -> new RuntimeException("Khong tim thay nhan vien"));

        LocalDate homNay = LocalDate.now();
        HoaDonTraDTO hoadon = new HoaDonTraDTO();
        hoadon.setTenKhachHang(phieuThue.getKhachHang().getTen());
        hoadon.setSoDienThoaiKH(phieuThue.getKhachHang().getSoDienThoai());
        hoadon.setDiaChiKH(phieuThue.getKhachHang().getDiaChi());
        hoadon.setPhieuThueId(phieuThue.getId());
        hoadon.setNgayThue(phieuThue.getNgayLap().format(FMT));   // String
        hoadon.setTienCoc(phieuThue.getTienCoc());
        hoadon.setNgayTra(homNay.format(FMT));                    // String
        hoadon.setTenNhanVien(nhanVien.getTen());

        List<HoaDonChiTietDTO> chiTietList = new ArrayList<>();
        float tongTienThue = 0, tongTienPhat = 0;

        for (ChiTietTraRequestDTO req : request.getDanhSachTra()) {
            ChiTietThue ctt = chiTietThueRepository.findById(req.getChiTietThueId())
                    .orElseThrow(() -> new RuntimeException("Khong tim thay chi tiet thue id=" + req.getChiTietThueId()));

            long soNgay = ChronoUnit.DAYS.between(phieuThue.getNgayLap(), homNay);
            if (soNgay < 1) soNgay = 1;

            float tienThue = ctt.getTrangPhuc().getDonGia() * soNgay * req.getSoLuongTra();
            String tenLoi = null;
            if (req.getLoiId() > 0) {
                Optional<Loi> loiOpt = loiRepository.findById(req.getLoiId());
                tenLoi = loiOpt.map(Loi::getTenLoi).orElse(null);
            }

            HoaDonChiTietDTO chiTiet = new HoaDonChiTietDTO();
            chiTiet.setTenTrangPhuc(ctt.getTrangPhuc().getTen());
            chiTiet.setSoLuong(req.getSoLuongTra());
            chiTiet.setDonGia(ctt.getTrangPhuc().getDonGia());
            chiTiet.setNgayThue(phieuThue.getNgayLap().format(FMT)); // String
            chiTiet.setSoNgayThue(soNgay);
            chiTiet.setTienThue(tienThue);
            chiTiet.setTienPhat(req.getTienPhat());
            chiTiet.setTenLoi(tenLoi);
            chiTiet.setTongCong(tienThue + req.getTienPhat());

            tongTienThue += tienThue;
            tongTienPhat += req.getTienPhat();
            chiTietList.add(chiTiet);
        }

        hoadon.setDanhSachChiTiet(chiTietList);
        hoadon.setTongTienThue(tongTienThue);
        hoadon.setTongTienPhat(tongTienPhat);
        hoadon.setTongThanhToan(tongTienThue + tongTienPhat);
        return hoadon;
    }

    /** Lưu phiếu trả vào CSDL */
    @Transactional
    public PhieuTra xacNhanTra(PhieuTraRequestDTO request) {
        PhieuThue phieuThue = phieuThueRepository.findById(request.getPhieuThueId())
                .orElseThrow(() -> new RuntimeException("Khong tim thay phieu thue"));

        NhanVien nhanVien = nhanVienRepository.findById(request.getNhanVienId())
                .orElseThrow(() -> new RuntimeException("Khong tim thay nhan vien"));

        LocalDate homNay = LocalDate.now();
        PhieuTra phieuTra = new PhieuTra();
        phieuTra.setNgayLap(homNay);
        phieuTra.setNhanVien(nhanVien);
        phieuTra.setPhieuThue(phieuThue);

        List<ChiTietTra> chiTietTraList = new ArrayList<>();
        float tongPhat = 0;

        for (ChiTietTraRequestDTO req : request.getDanhSachTra()) {
            ChiTietThue ctt = chiTietThueRepository.findById(req.getChiTietThueId())
                    .orElseThrow(() -> new RuntimeException("Khong tim thay chi tiet thue"));

            ChiTietTra chiTietTra = new ChiTietTra();
            chiTietTra.setSoLuong(req.getSoLuongTra());
            chiTietTra.setTienPhat(req.getTienPhat());
            chiTietTra.setChiTietThue(ctt);
            chiTietTra.setPhieuTra(phieuTra);

            List<ChiTietLoi> loiList = new ArrayList<>();
            if (req.getLoiId() > 0 && req.getSoLoi() > 0) {
                loiRepository.findById(req.getLoiId()).ifPresent(loi -> {
                    ChiTietLoi chiTietLoi = new ChiTietLoi();
                    chiTietLoi.setLoi(loi);
                    chiTietLoi.setTongLoi(req.getSoLoi());
                    chiTietLoi.setTienPhat(loi.getMucPhat() * req.getSoLoi());
                    chiTietLoi.setChiTietTra(chiTietTra);
                    loiList.add(chiTietLoi);
                });
            }
            chiTietTra.setChiTietLoiList(loiList);
            tongPhat += req.getTienPhat();
            chiTietTraList.add(chiTietTra);

            ctt.setSoLuongDaTra(ctt.getSoLuongDaTra() + req.getSoLuongTra());
            if (ctt.getSoLuongDaTra() >= ctt.getSoLuong()) {
                ctt.setDaTra(true);
            }
            chiTietThueRepository.save(ctt);
        }

        phieuTra.setTienPhat(tongPhat);
        phieuTra.setChiTietTraList(chiTietTraList);
        return phieuTraRepository.save(phieuTra);
    }
}
