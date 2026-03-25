package com.quanlichothuetrangphuc.controller;

import com.quanlichothuetrangphuc.dto.*;
import com.quanlichothuetrangphuc.model.Loi;
import com.quanlichothuetrangphuc.model.NhanVien;
import com.quanlichothuetrangphuc.service.KhachHangService;
import com.quanlichothuetrangphuc.service.PhieuThueService;
import com.quanlichothuetrangphuc.service.PhieuTraService;
import com.quanlichothuetrangphuc.repository.LoiRepository;
import com.quanlichothuetrangphuc.repository.NhanVienRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/tra-trang-phuc")
@RequiredArgsConstructor
public class TraTrangPhucController {

    private final KhachHangService khachHangService;
    private final PhieuThueService phieuThueService;
    private final PhieuTraService phieuTraService;
    private final LoiRepository loiRepository;
    private final NhanVienRepository nhanVienRepository;

    @GetMapping
    public String trangChu() {
        return "timKiemKH";
    }

    @GetMapping("/tim-kiem")
    public String timKiem(@RequestParam(name = "ten", required = false) String ten, Model model) {
        if (ten != null)
            ten = ten.trim();

        if (ten == null || ten.isEmpty()) {
            model.addAttribute("tuKhoa", "Tất cả khách hàng");
            model.addAttribute("danhSachKH", khachHangService.timTatCa());
        } else {
            model.addAttribute("tuKhoa", ten);
            model.addAttribute("danhSachKH", khachHangService.timTheoTen(ten));
        }

        return "danhSachKH";
    }

    @GetMapping("/trang-phuc-dang-muon/{khachHangId}")
    public String danhSachTrangPhucThue(@PathVariable int khachHangId, Model model) {
        var phieuThueList = phieuThueService.layDanhSachChuaTraTheoKH(khachHangId);

        if (phieuThueList.isEmpty()) {
            model.addAttribute("thongBao", "Khách hàng không có trang phục nào đang mượn.");
            return "thongBao";
        }

        List<Loi> danhSachLoi = loiRepository.findAll();
        List<NhanVien> danhSachNV = nhanVienRepository.findAll();

        model.addAttribute("phieuThueList", phieuThueList);
        model.addAttribute("khachHangId", khachHangId);
        model.addAttribute("tenKhachHang", phieuThueList.get(0).getTenKhachHang());
        model.addAttribute("danhSachLoi", danhSachLoi);
        model.addAttribute("danhSachNV", danhSachNV);
        return "danhSachTrangPhucThue";
    }

    @PostMapping("/preview-hoa-don")
    public String previewHoaDon(@ModelAttribute PhieuTraFormDTO formDTO, Model model) {
        PhieuTraRequestDTO request = formDTO.toRequestDTO();
        HoaDonTraDTO hoaDon = phieuTraService.preview(request);

        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            String requestJson = mapper.writeValueAsString(request);
            model.addAttribute("requestJson", requestJson);
        } catch (Exception e) {
            model.addAttribute("requestJson", "{}");
        }

        model.addAttribute("hoaDon", hoaDon);
        return "hoaDonTra";
    }

    @PostMapping("/xac-nhan")
    public String xacNhanTra(@RequestParam("requestJson") String requestJson,
            RedirectAttributes redirectAttributes) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            PhieuTraRequestDTO request = mapper.readValue(requestJson, PhieuTraRequestDTO.class);
            var phieuTra = phieuTraService.xacNhanTra(request);
            redirectAttributes.addFlashAttribute("thongBao",
                    "Xác nhận trả thành công! Mã phiếu trả: #" + phieuTra.getId());
            redirectAttributes.addFlashAttribute("loai", "success");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("thongBao",
                    "Lỗi khi xác nhận trả: " + e.getMessage());
            redirectAttributes.addFlashAttribute("loai", "error");
        }
        return "redirect:/tra-trang-phuc/ket-qua";
    }

    @GetMapping("/ket-qua")
    public String ketQua(Model model) {
        return "thongBao";
    }
}
