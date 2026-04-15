package com.loihongphat.repository;

import com.loihongphat.model.ChiTietLoi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChiTietLoiRepository extends JpaRepository<ChiTietLoi, Integer> {
    List<ChiTietLoi> findByChiTietTraId(Integer chiTietTraId);
}
