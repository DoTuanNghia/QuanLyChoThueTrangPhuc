package com.tratrangphuc.repository;

import com.tratrangphuc.model.PhieuThue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhieuThueRepository extends JpaRepository<PhieuThue, Integer> {

    // Lấy tất cả phiếu thuê của KH, có ít nhất 1 chi tiết thuê chưa trả
    @Query("SELECT DISTINCT pt FROM PhieuThue pt " +
           "JOIN pt.chiTietThueList ctt " +
           "WHERE pt.khachHang.id = :khachHangId AND ctt.daTra = false")
    List<PhieuThue> findChuaTraByKhachHangId(@Param("khachHangId") int khachHangId);
}
