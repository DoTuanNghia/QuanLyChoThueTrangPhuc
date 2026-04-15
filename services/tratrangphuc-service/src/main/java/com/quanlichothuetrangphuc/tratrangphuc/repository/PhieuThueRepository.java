package com.quanlichothuetrangphuc.tratrangphuc.repository;

import com.quanlichothuetrangphuc.tratrangphuc.model.PhieuThue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhieuThueRepository extends JpaRepository<PhieuThue, Integer> {

    // Lấy tất cả phiếu thuê của KH chưa trả hết (status chưa DA_TRA)
    @Query("SELECT pt FROM PhieuThue pt WHERE pt.khachHang.id = :khachHangId AND (pt.status <> 'DA_TRA' OR pt.status IS NULL)")
    List<PhieuThue> findChuaTraByKhachHangId(@Param("khachHangId") int khachHangId);
}
