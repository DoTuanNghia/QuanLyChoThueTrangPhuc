package com.quanlichothuetrangphuc.tratrangphuc.client;

import com.quanlichothuetrangphuc.tratrangphuc.dto.LoiDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@FeignClient(name = "LOIHONGPHAT-SERVICE")
public interface LoiClient {

    @GetMapping("/api/loi/{id}")
    LoiDTO layLoiTheoId(@PathVariable("id") int id);

    @PostMapping("/api/chi-tiet-loi")
    Map<String, Object> themChiTietLoi(@RequestBody Map<String, Object> chiTietLoi);
}
