package com.quanlichothuetrangphuc.tratrangphuc.service;

import com.quanlichothuetrangphuc.tratrangphuc.model.TrangPhuc;
import java.util.List;

public interface TrangPhucService {
    List<TrangPhuc> layTatCa();
    List<TrangPhuc> timTheoTen(String ten);
    TrangPhuc layTheoId(int id);
}
