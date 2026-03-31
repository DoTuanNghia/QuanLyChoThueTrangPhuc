package com.quanlichothuetrangphuc.tratrangphuc.service;

import com.quanlichothuetrangphuc.tratrangphuc.client.LoiClient;
import com.quanlichothuetrangphuc.tratrangphuc.dto.*;
import com.quanlichothuetrangphuc.tratrangphuc.model.*;
import com.quanlichothuetrangphuc.tratrangphuc.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PhieuTraService {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final PhieuTraRepository phieuTraRepository;
    private final PhieuThueRepository phieuThueRepository;
    private final ChiTietThueRepository chiTietThueRepository;
    private final NhanVienRepository nhanVienRepository;
    private final LoiClient loiClient;

    /** Preview hoa don - chua luu DB */
    public HoaDonTraDTO preview(PhieuTraRequestDTO request) {
        PhieuThue phieuThue = phieuThueRepository.findById(request.getPhieuThueId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu thuê"));
        NhanVien nhanVien = nhanVienRepository.findById(request.getNhanVienId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));

        LocalDate homNay = LocalDate.now();
        HoaDonTraDTO hoadon = new HoaDonTraDTO();
        hoadon.setTenKhachHang(phieuThue.getKhachHang().getTen());
        hoadon.setSoDienThoaiKH(phieuThue.getKhachHang().getSoDienThoai());
        hoadon.setDiaChiKH(phieuThue.getKhachHang().getDiaChi());
        hoadon.setPhieuThueId(phieuThue.getId());
        hoadon.setNgayThue(phieuThue.getNgayLap().format(FMT));
        hoadon.setTienCoc(phieuThue.getTienCoc());
        hoadon.setNgayTra(homNay.format(FMT));
        hoadon.setTenNhanVien(nhanVien.getTen());

        List<HoaDonChiTietDTO> chiTietList = new ArrayList<>();
        float tongTienThue = 0, tongTienPhat = 0;

        for (ChiTietTraRequestDTO req : request.getDanhSachTra()) {
            ChiTietThue ctt = chiTietThueRepository.findById(req.getChiTietThueId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy chi tiết thuê id=" + req.getChiTietThueId()));

            long soNgay = ChronoUnit.DAYS.between(phieuThue.getNgayLap(), homNay);
            if (soNgay < 1) soNgay = 1;

            float tienThue = ctt.getTrangPhuc().getDonGia() * soNgay * req.getSoLuongTra();

            // Tinh tong tien phat tu nhieu loi
            List<ChiTietLoiViewDTO> loiViews = new ArrayList<>();
            float tienPhatItem = 0;
            for (LoiPhatRequest loiReq : req.getDanhSachLoi()) {
                LoiDTO loi = loiClient.layLoiTheoId(loiReq.getLoiId());
                float phat = loi.getMucPhat() * loiReq.getSoLuong();
                tienPhatItem += phat;
                loiViews.add(new ChiTietLoiViewDTO(loi.getTenLoi(), loi.getMucPhat(), loiReq.getSoLuong(), phat));
            }

            HoaDonChiTietDTO chiTiet = new HoaDonChiTietDTO();
            chiTiet.setTenTrangPhuc(ctt.getTrangPhuc().getTen());
            chiTiet.setSoLuong(req.getSoLuongTra());
            chiTiet.setDonGia(ctt.getTrangPhuc().getDonGia());
            chiTiet.setNgayThue(phieuThue.getNgayLap().format(FMT));
            chiTiet.setSoNgayThue(soNgay);
            chiTiet.setTienThue(tienThue);
            chiTiet.setTienPhat(tienPhatItem);
            chiTiet.setDanhSachLoi(loiViews);
            chiTiet.setTongCong(tienThue + tienPhatItem);

            tongTienThue += tienThue;
            tongTienPhat += tienPhatItem;
            chiTietList.add(chiTiet);
        }

        hoadon.setDanhSachChiTiet(chiTietList);
        hoadon.setTongTienThue(tongTienThue);
        hoadon.setTongTienPhat(tongTienPhat);
        hoadon.setTongThanhToan(tongTienThue + tongTienPhat);
        return hoadon;
    }

    /** Luu phieu tra vao CSDL */
    @Transactional
    public PhieuTra xacNhanTra(PhieuTraRequestDTO request) {
        PhieuThue phieuThue = phieuThueRepository.findById(request.getPhieuThueId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu thuê"));
        NhanVien nhanVien = nhanVienRepository.findById(request.getNhanVienId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));

        LocalDate homNay = LocalDate.now();
        PhieuTra phieuTra = new PhieuTra();
        phieuTra.setNgayLap(homNay);
        phieuTra.setNhanVien(nhanVien);
        phieuTra.setPhieuThue(phieuThue);

        List<ChiTietTra> chiTietTraList = new ArrayList<>();
        float tongPhat = 0;

        for (ChiTietTraRequestDTO req : request.getDanhSachTra()) {
            ChiTietThue ctt = chiTietThueRepository.findById(req.getChiTietThueId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy chi tiết thuê"));

            ChiTietTra chiTietTra = new ChiTietTra();
            chiTietTra.setSoLuong(req.getSoLuongTra());
            chiTietTra.setChiTietThue(ctt);
            chiTietTra.setPhieuTra(phieuTra);

            // Tinh tien phat tu nhieu loi, goi Feign de lay mucPhat
            List<ChiTietLoi> loiList = new ArrayList<>();
            float tienPhatItem = 0;
            for (LoiPhatRequest loiReq : req.getDanhSachLoi()) {
                LoiDTO loiDTO = loiClient.layLoiTheoId(loiReq.getLoiId());
                float phat = loiDTO.getMucPhat() * loiReq.getSoLuong();
                tienPhatItem += phat;

                ChiTietLoi chiTietLoi = new ChiTietLoi();
                chiTietLoi.setLoiId(loiReq.getLoiId());
                chiTietLoi.setTenLoi(loiDTO.getTenLoi());
                chiTietLoi.setMucPhat(loiDTO.getMucPhat());
                chiTietLoi.setTongLoi(loiReq.getSoLuong());
                chiTietLoi.setTienPhat(phat);
                chiTietLoi.setChiTietTra(chiTietTra);
                loiList.add(chiTietLoi);
            }

            chiTietTra.setTienPhat(tienPhatItem);
            chiTietTra.setChiTietLoiList(loiList);
            tongPhat += tienPhatItem;
            chiTietTraList.add(chiTietTra);

            // Cap nhat trang thai da tra
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
