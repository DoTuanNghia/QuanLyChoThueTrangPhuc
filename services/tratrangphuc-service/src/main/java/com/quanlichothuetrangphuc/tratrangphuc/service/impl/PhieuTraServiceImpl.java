package com.quanlichothuetrangphuc.tratrangphuc.service.impl;

import com.quanlichothuetrangphuc.tratrangphuc.client.LoiClient;
import com.quanlichothuetrangphuc.tratrangphuc.dto.*;
import com.quanlichothuetrangphuc.tratrangphuc.model.*;
import com.quanlichothuetrangphuc.tratrangphuc.repository.*;
import com.quanlichothuetrangphuc.tratrangphuc.service.PhieuTraService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PhieuTraServiceImpl implements PhieuTraService {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final PhieuTraRepository phieuTraRepository;
    private final PhieuThueRepository phieuThueRepository;
    private final TrangPhucRepository trangPhucRepository;
    private final NhanVienRepository nhanVienRepository;
    private final LoiClient loiClient;

    /** Preview hoa don - chua luu DB */
    @Override
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
        hoadon.setTenNhanVien(nhanVien.getUsername());

        List<HoaDonChiTietDTO> chiTietList = new ArrayList<>();
        float tongTienThue = 0, tongTienPhat = 0;

        for (ChiTietTraRequestDTO req : request.getDanhSachTra()) {
            TrangPhuc trangPhuc = trangPhucRepository.findById(req.getTrangPhucId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy trang phục id=" + req.getTrangPhucId()));

            long soNgay = ChronoUnit.DAYS.between(phieuThue.getNgayLap(), homNay);
            if (soNgay < 1) soNgay = 1;

            float tienThue = trangPhuc.getDonGia() * soNgay * req.getSoLuongTra();

            // Tinh tong tien phat tu nhieu loi
            List<ChiTietLoiViewDTO> loiViews = new ArrayList<>();
            float tienPhatItem = 0;
            for (LoiPhatRequest loiReq : req.getDanhSachLoi()) {
                LoiDTO loi = loiClient.layLoiTheoId(loiReq.getLoiId());
                if (loi == null) {
                    throw new RuntimeException("Không tìm thấy thông tin mức phạt cho lỗi ID=" + loiReq.getLoiId());
                }
                float phat = loi.getMucPhat() * loiReq.getSoLuong();
                tienPhatItem += phat;

                ChiTietLoiViewDTO view = new ChiTietLoiViewDTO();
                view.setTenLoi(loi.getTenLoi());
                view.setMucPhat(loi.getMucPhat());
                view.setTongLoi(loiReq.getSoLuong());
                view.setTienPhat(phat);
                view.setLoiId(loiReq.getLoiId());
                loiViews.add(view);
            }

            HoaDonChiTietDTO chiTiet = new HoaDonChiTietDTO();
            chiTiet.setTenTrangPhuc(trangPhuc.getTen());
            chiTiet.setSoLuong(req.getSoLuongTra());
            chiTiet.setDonGia(trangPhuc.getDonGia());
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
        hoadon.setSoTienConLai((tongTienThue + tongTienPhat) - phieuThue.getTienCoc());
        return hoadon;
    }

    /** Luu phieu tra vao CSDL */
    @Override
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
            TrangPhuc trangPhuc = trangPhucRepository.findById(req.getTrangPhucId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy trang phục"));

            long soNgay = ChronoUnit.DAYS.between(phieuThue.getNgayLap(), homNay);
            if (soNgay < 1) soNgay = 1;

            float thanhTien = trangPhuc.getDonGia() * soNgay * req.getSoLuongTra();

            ChiTietTra chiTietTra = new ChiTietTra();
            chiTietTra.setSoLuong(req.getSoLuongTra());
            chiTietTra.setThanhTien(thanhTien);
            chiTietTra.setTrangPhuc(trangPhuc);
            chiTietTra.setPhieuTra(phieuTra);

            chiTietTraList.add(chiTietTra);

            // Tinh tien phat tu nhieu loi
            float tienPhatItem = 0;
            for (LoiPhatRequest loiReq : req.getDanhSachLoi()) {
                LoiDTO loiDTO = loiClient.layLoiTheoId(loiReq.getLoiId());
                if (loiDTO == null) {
                    throw new RuntimeException("Không tìm thấy thông tin mức phạt cho lỗi ID=" + loiReq.getLoiId());
                }
                float phat = loiDTO.getMucPhat() * loiReq.getSoLuong();
                tienPhatItem += phat;
            }
            tongPhat += tienPhatItem;

            // Cập nhật lại số lượng trong ChiTietThue (hỗ trợ trả một phần)
            for (ChiTietThue ctt : phieuThue.getChiTietThueList()) {
                if (ctt.getTrangPhuc().getId() == req.getTrangPhucId() && ctt.getSoLuong() > 0) {
                    ctt.setSoLuong(Math.max(0, ctt.getSoLuong() - req.getSoLuongTra()));
                    break;
                }
            }

            // Hoàn lại kho cho Trang Phuc
            trangPhuc.setSoLuong(trangPhuc.getSoLuong() + req.getSoLuongTra());
            trangPhucRepository.save(trangPhuc);
        }

        phieuTra.setTienPhat(tongPhat);
        phieuTra.setChiTietTraList(chiTietTraList);
        PhieuTra savedPhieuTra = phieuTraRepository.save(phieuTra);

        // Goi sang loihongphat-service de luu chi tiet loi
        for (int i = 0; i < request.getDanhSachTra().size(); i++) {
            ChiTietTraRequestDTO req = request.getDanhSachTra().get(i);
            ChiTietTra savedCTT = savedPhieuTra.getChiTietTraList().get(i);

            for (LoiPhatRequest loiReq : req.getDanhSachLoi()) {
                Map<String, Object> chiTietLoiData = new HashMap<>();
                chiTietLoiData.put("loiId", loiReq.getLoiId());
                chiTietLoiData.put("tongLoi", loiReq.getSoLuong());
                chiTietLoiData.put("chiTietTraId", savedCTT.getId());
                try {
                    loiClient.themChiTietLoi(chiTietLoiData);
                } catch (Exception e) {
                    // Log but don't fail the transaction
                    System.err.println("Warning: Không thể lưu chi tiết lỗi sang loihongphat-service: " + e.getMessage());
                }
            }
        }

        // Cap nhat status phieu thue
        boolean traHet = true;
        for (ChiTietThue ctt : phieuThue.getChiTietThueList()) {
            if (ctt.getSoLuong() > 0) {
                traHet = false;
                break;
            }
        }
        
        if (traHet) {
            phieuThue.setStatus("DA_TRA");
        }
        
        // Trừ đi tiền cọc đã áp dụng cho lần trả này để các lần trả sau không bị trừ lặp
        phieuThue.setTienCoc(0);
        
        phieuThueRepository.save(phieuThue);

        return savedPhieuTra;
    }
}
