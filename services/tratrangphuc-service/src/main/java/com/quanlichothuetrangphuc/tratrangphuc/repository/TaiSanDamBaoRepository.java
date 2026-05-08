package com.quanlichothuetrangphuc.tratrangphuc.repository;

import com.quanlichothuetrangphuc.tratrangphuc.model.TaiSanDamBao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaiSanDamBaoRepository extends JpaRepository<TaiSanDamBao, Integer> {
    List<TaiSanDamBao> findByPhieuThueId(int phieuThueId);
    List<TaiSanDamBao> findByPhieuThueIdAndDaTra(int phieuThueId, boolean daTra);
}
