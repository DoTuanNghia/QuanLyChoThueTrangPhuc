package com.quanlichothuetrangphuc.tratrangphuc.service.impl;

import com.quanlichothuetrangphuc.tratrangphuc.dto.HoaDonThongKeDTO;
import com.quanlichothuetrangphuc.tratrangphuc.dto.ThongKeDoanhThuDTO;
import com.quanlichothuetrangphuc.tratrangphuc.model.ChiTietTra;
import com.quanlichothuetrangphuc.tratrangphuc.model.PhieuTra;
import com.quanlichothuetrangphuc.tratrangphuc.repository.PhieuTraRepository;
import com.quanlichothuetrangphuc.tratrangphuc.service.DoanhThuService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoanhThuServiceImpl implements DoanhThuService {

    private final PhieuTraRepository phieuTraRepository;
    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    @Override
    public List<ThongKeDoanhThuDTO> thongKeTheoThang() {
        return phieuTraRepository.thongKeTheoThang().stream().map(row -> {
            int nam = toInt(row[0]);
            int thang = toInt(row[1]);
            float tong = toFloat(row[2]);
            int soHoaDon = toInt(row[3]);
            String ten = "Tháng " + thang + "/" + nam;
            return new ThongKeDoanhThuDTO(ten, nam, thang, tong, soHoaDon);
        }).collect(Collectors.toList());
    }

    @Override
    public List<ThongKeDoanhThuDTO> thongKeTheoQuy() {
        return phieuTraRepository.thongKeTheoQuy().stream().map(row -> {
            int nam = toInt(row[0]);
            int quy = toInt(row[1]);
            float tong = toFloat(row[2]);
            int soHoaDon = toInt(row[3]);
            String ten = "Quý " + quy + "/" + nam;
            return new ThongKeDoanhThuDTO(ten, nam, quy, tong, soHoaDon);
        }).collect(Collectors.toList());
    }

    @Override
    public List<ThongKeDoanhThuDTO> thongKeTheoNam() {
        return phieuTraRepository.thongKeTheoNam().stream().map(row -> {
            int nam = toInt(row[0]);
            float tong = toFloat(row[1]);
            int soHoaDon = toInt(row[2]);
            String ten = "Năm " + nam;
            return new ThongKeDoanhThuDTO(ten, nam, nam, tong, soHoaDon);
        }).collect(Collectors.toList());
    }

    @Override
    public List<HoaDonThongKeDTO> chiTietTheoThang(int nam, int thang) {
        return toHoaDonList(phieuTraRepository.findByThang(nam, thang));
    }

    @Override
    public List<HoaDonThongKeDTO> chiTietTheoQuy(int nam, int quy) {
        return toHoaDonList(phieuTraRepository.findByQuy(nam, quy));
    }

    @Override
    public List<HoaDonThongKeDTO> chiTietTheoNam(int nam) {
        return toHoaDonList(phieuTraRepository.findByNam(nam));
    }

    private List<HoaDonThongKeDTO> toHoaDonList(List<PhieuTra> phieuTraList) {
        return phieuTraList.stream().map(pt -> {
            int tongSoTrangPhuc = 0;
            float tongTien = 0;
            for (ChiTietTra ctt : pt.getChiTietTraList()) {
                tongSoTrangPhuc += ctt.getSoLuong();
                tongTien += ctt.getThanhTien();
            }
            String tenKH = (pt.getPhieuThue() != null && pt.getPhieuThue().getKhachHang() != null)
                    ? pt.getPhieuThue().getKhachHang().getTen() : "Không rõ";
            String ngayMuon = (pt.getPhieuThue() != null && pt.getPhieuThue().getNgayLap() != null)
                    ? pt.getPhieuThue().getNgayLap().format(FMT) : "";
            return new HoaDonThongKeDTO(pt.getId(), tenKH, ngayMuon, tongSoTrangPhuc, tongTien);
        }).collect(Collectors.toList());
    }

    // Helper: chuyển Number/Object từ JPQL sang int
    private int toInt(Object o) {
        if (o instanceof Number) return ((Number) o).intValue();
        return 0;
    }

    // Helper: chuyển Number/Object từ JPQL sang float
    private float toFloat(Object o) {
        if (o instanceof Number) return ((Number) o).floatValue();
        return 0f;
    }
}
