package com.loihongphat.controller;

import com.loihongphat.dto.ChiTietLoiDTO;
import com.loihongphat.service.ChiTietLoiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chi-tiet-loi")
@RequiredArgsConstructor
public class ChiTietLoiController {

    private final ChiTietLoiService chiTietLoiService;

    @GetMapping
    public ResponseEntity<List<ChiTietLoiDTO>> layTatCa() {
        return ResponseEntity.ok(chiTietLoiService.layTatCa());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChiTietLoiDTO> layTheoId(@PathVariable int id) {
        return ResponseEntity.ok(chiTietLoiService.layTheoId(id));
    }

    @GetMapping("/chi-tiet-tra/{chiTietTraId}")
    public ResponseEntity<List<ChiTietLoiDTO>> layTheoChiTietTraId(@PathVariable int chiTietTraId) {
        return ResponseEntity.ok(chiTietLoiService.layTheoChiTietTraId(chiTietTraId));
    }

    @PostMapping
    public ResponseEntity<ChiTietLoiDTO> them(@RequestBody ChiTietLoiDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(chiTietLoiService.them(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> xoa(@PathVariable int id) {
        chiTietLoiService.xoa(id);
        return ResponseEntity.ok(Map.of("message", "Xóa chi tiết lỗi thành công"));
    }
}
