package com.quanlichothuetrangphuc.tratrangphuc.repository;

import com.quanlichothuetrangphuc.tratrangphuc.model.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KhachHangRepository extends JpaRepository<KhachHang, Integer> {
    List<KhachHang> findByTenContainingIgnoreCase(String ten);

    @Query("SELECT DISTINCT pt.khachHang FROM PhieuThue pt WHERE pt.status <> 'DA_TRA' OR pt.status IS NULL")
    List<KhachHang> findKhachHangCoDoThue();

    @Query("SELECT DISTINCT pt.khachHang FROM PhieuThue pt WHERE (pt.status <> 'DA_TRA' OR pt.status IS NULL) AND LOWER(pt.khachHang.ten) LIKE LOWER(CONCAT('%', :ten, '%'))")
    List<KhachHang> findKhachHangCoDoThueTheoTen(@Param("ten") String ten);
}
