package com.loihongphat.controller;

import com.loihongphat.dto.LoiDTO;
import com.loihongphat.service.LoiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/loi")
@RequiredArgsConstructor
public class LoiController {

    private final LoiService loiService;

    @GetMapping
    public ResponseEntity<List<LoiDTO>> layTatCa() {
        return ResponseEntity.ok(loiService.layTatCa());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoiDTO> layTheoId(@PathVariable int id) {
        return ResponseEntity.ok(loiService.layTheoId(id));
    }

    @PostMapping
    public ResponseEntity<LoiDTO> them(@Valid @RequestBody LoiDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(loiService.them(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LoiDTO> sua(@PathVariable int id, @Valid @RequestBody LoiDTO dto) {
        return ResponseEntity.ok(loiService.sua(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> xoa(@PathVariable int id) {
        loiService.xoa(id);
        return ResponseEntity.ok(Map.of("message", "Xóa thành công"));
    }
}
