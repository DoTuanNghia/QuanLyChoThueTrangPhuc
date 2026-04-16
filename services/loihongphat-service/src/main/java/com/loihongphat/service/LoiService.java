package com.loihongphat.service;

import com.loihongphat.dto.LoiDTO;

import java.util.List;

public interface LoiService {
    List<LoiDTO> layTatCa();
    LoiDTO layTheoId(int id);
    LoiDTO them(LoiDTO dto);
    LoiDTO sua(int id, LoiDTO dto);
    void xoa(int id);
}
