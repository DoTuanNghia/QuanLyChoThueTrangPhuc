package com.tratrangphuc.client;

import com.tratrangphuc.dto.LoiDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "LOIHONGPHAT-SERVICE")
public interface LoiClient {

    @GetMapping("/api/loi")
    List<LoiDTO> layTatCaLoi();

    @GetMapping("/api/loi/{id}")
    LoiDTO layLoiTheoId(@PathVariable("id") int id);
}
