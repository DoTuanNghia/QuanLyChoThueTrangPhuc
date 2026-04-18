package com.quanlichothuetrangphuc.tratrangphuc.controller;

import com.quanlichothuetrangphuc.tratrangphuc.dto.*;
import com.quanlichothuetrangphuc.tratrangphuc.model.KhachHang;
import com.quanlichothuetrangphuc.tratrangphuc.model.NhanVien;
import com.quanlichothuetrangphuc.tratrangphuc.model.TrangPhuc;
import com.quanlichothuetrangphuc.tratrangphuc.service.DoanhThuService;
import com.quanlichothuetrangphuc.tratrangphuc.service.KhachHangService;
import com.quanlichothuetrangphuc.tratrangphuc.service.PhieuThueService;
import com.quanlichothuetrangphuc.tratrangphuc.service.PhieuTraService;
import com.quanlichothuetrangphuc.tratrangphuc.service.TrangPhucService;
import com.quanlichothuetrangphuc.tratrangphuc.repository.NhanVienRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TraTrangPhucController {

    private final KhachHangService khachHangService;
    private final PhieuThueService phieuThueService;
    private final PhieuTraService phieuTraService;
    private final TrangPhucService trangPhucService;
    private final NhanVienRepository nhanVienRepository;
    private final DoanhThuService doanhThuService;

    // =========== KHACH HANG ===========

    @GetMapping("/khach-hang")
    public ResponseEntity<List<KhachHang>> timKiemKhachHang(
            @RequestParam(name = "ten", required = false) String ten) {
        if (ten == null || ten.trim().isEmpty()) {
            return ResponseEntity.ok(khachHangService.timTatCa());
        }
        return ResponseEntity.ok(khachHangService.timTheoTen(ten.trim()));
    }

    @GetMapping("/khach-hang/{id}/phieu-thue")
    public ResponseEntity<?> phieuThueChuaTra(@PathVariable int id) {
        var list = phieuThueService.layDanhSachChuaTraTheoKH(id);
        if (list.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "Khách hàng không có trang phục nào đang mượn."));
        }
        return ResponseEntity.ok(list);
    }

    // =========== NHAN VIEN ===========

    @GetMapping("/nhan-vien")
    public ResponseEntity<List<NhanVien>> layNhanVien() {
        return ResponseEntity.ok(nhanVienRepository.findAll());
    }

    // =========== TRANG PHUC ===========

    @GetMapping("/trang-phuc")
    public ResponseEntity<List<TrangPhuc>> layTatCaTrangPhuc() {
        return ResponseEntity.ok(trangPhucService.layTatCa());
    }

    // =========== PHIEU THUE ===========

    @GetMapping("/phieu-thue")
    public ResponseEntity<?> layTatCaPhieuThue() {
        return ResponseEntity.ok(phieuThueService.layTatCaDTO());
    }

    // =========== TRA TRANG PHUC ===========

    @PostMapping("/tra/preview")
    public ResponseEntity<HoaDonTraDTO> previewHoaDon(@RequestBody PhieuTraRequestDTO request) {
        HoaDonTraDTO hoaDon = phieuTraService.preview(request);
        return ResponseEntity.ok(hoaDon);
    }

    @PostMapping("/tra/xac-nhan")
    public ResponseEntity<Map<String, Object>> xacNhanTra(@RequestBody PhieuTraRequestDTO request) {
        try {
            var phieuTra = phieuTraService.xacNhanTra(request);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Xác nhận trả thành công! Mã phiếu trả: #" + phieuTra.getId(),
                    "phieuTraId", phieuTra.getId()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Lỗi khi xác nhận trả: " + (e.getMessage() != null ? e.getMessage() : "Lỗi không xác định")
            ));
        }
    }

    @GetMapping("/tra/{id}/chi-tiet")
    public ResponseEntity<?> chiTietHoaDon(@PathVariable int id) {
        try {
            HoaDonTraDTO hoaDon = phieuTraService.layChiTietHoaDon(id);
            return ResponseEntity.ok(hoaDon);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // =========== THONG KE DOANH THU ===========

    @GetMapping("/thong-ke/thang")
    public ResponseEntity<List<ThongKeDoanhThuDTO>> thongKeTheoThang() {
        return ResponseEntity.ok(doanhThuService.thongKeTheoThang());
    }

    @GetMapping("/thong-ke/quy")
    public ResponseEntity<List<ThongKeDoanhThuDTO>> thongKeTheoQuy() {
        return ResponseEntity.ok(doanhThuService.thongKeTheoQuy());
    }

    @GetMapping("/thong-ke/nam")
    public ResponseEntity<List<ThongKeDoanhThuDTO>> thongKeTheoNam() {
        return ResponseEntity.ok(doanhThuService.thongKeTheoNam());
    }

    @GetMapping("/thong-ke/chi-tiet/thang")
    public ResponseEntity<List<HoaDonThongKeDTO>> chiTietTheoThang(
            @RequestParam int nam, @RequestParam int thang) {
        return ResponseEntity.ok(doanhThuService.chiTietTheoThang(nam, thang));
    }

    @GetMapping("/thong-ke/chi-tiet/quy")
    public ResponseEntity<List<HoaDonThongKeDTO>> chiTietTheoQuy(
            @RequestParam int nam, @RequestParam int quy) {
        return ResponseEntity.ok(doanhThuService.chiTietTheoQuy(nam, quy));
    }

    @GetMapping("/thong-ke/chi-tiet/nam")
    public ResponseEntity<List<HoaDonThongKeDTO>> chiTietTheoNam(@RequestParam int nam) {
        return ResponseEntity.ok(doanhThuService.chiTietTheoNam(nam));
    }
}
