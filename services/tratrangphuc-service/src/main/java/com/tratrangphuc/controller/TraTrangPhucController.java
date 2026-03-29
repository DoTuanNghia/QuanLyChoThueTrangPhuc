package com.tratrangphuc.controller;

import com.tratrangphuc.client.LoiClient;
import com.tratrangphuc.dto.*;
import com.tratrangphuc.model.KhachHang;
import com.tratrangphuc.model.NhanVien;
import com.tratrangphuc.service.KhachHangService;
import com.tratrangphuc.service.PhieuThueService;
import com.tratrangphuc.service.PhieuTraService;
import com.tratrangphuc.repository.NhanVienRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TraTrangPhucController {

    private final KhachHangService khachHangService;
    private final PhieuThueService phieuThueService;
    private final PhieuTraService phieuTraService;
    private final NhanVienRepository nhanVienRepository;
    private final LoiClient loiClient;

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

    // =========== LOI (proxy sang loihongphat-service) ===========

    @GetMapping("/loi")
    public ResponseEntity<List<LoiDTO>> layDanhSachLoi() {
        return ResponseEntity.ok(loiClient.layTatCaLoi());
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
            HoaDonTraDTO hoaDon = phieuTraService.preview(request);
            var phieuTra = phieuTraService.xacNhanTra(request);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Xác nhận trả thành công! Mã phiếu trả: #" + phieuTra.getId(),
                    "phieuTraId", phieuTra.getId(),
                    "hoaDon", hoaDon
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Lỗi khi xác nhận trả: " + e.getMessage()
            ));
        }
    }
}
