package com.quanlichothuetrangphuc.repository;

import com.quanlichothuetrangphuc.model.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KhachHangRepository extends JpaRepository<KhachHang, Integer> {
    List<KhachHang> findByTenContainingIgnoreCase(String ten);

    @Query("SELECT DISTINCT pt.khachHang FROM PhieuThue pt JOIN pt.chiTietThueList ctt WHERE ctt.daTra = false")
    List<KhachHang> findKhachHangCoDoThue();

    @Query("SELECT DISTINCT pt.khachHang FROM PhieuThue pt JOIN pt.chiTietThueList ctt WHERE ctt.daTra = false AND LOWER(pt.khachHang.ten) LIKE LOWER(CONCAT('%', :ten, '%'))")
    List<KhachHang> findKhachHangCoDoThueTheoTen(@Param("ten") String ten);
}
