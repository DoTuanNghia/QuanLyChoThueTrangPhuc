package com.quanlichothuetrangphuc.tratrangphuc.repository;

import com.quanlichothuetrangphuc.tratrangphuc.model.PhieuTra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhieuTraRepository extends JpaRepository<PhieuTra, Integer> {

    // Thống kê doanh thu theo tháng: [year, month, tongTien, soHoaDon]
    @Query("SELECT YEAR(pt.ngayLap), MONTH(pt.ngayLap), " +
           "SUM(ctt.thanhTien), COUNT(DISTINCT pt.id) " +
           "FROM PhieuTra pt " +
           "JOIN pt.chiTietTraList ctt " +
           "GROUP BY YEAR(pt.ngayLap), MONTH(pt.ngayLap) " +
           "ORDER BY YEAR(pt.ngayLap) DESC, MONTH(pt.ngayLap) DESC")
    List<Object[]> thongKeTheoThang();

    // Thống kê doanh thu theo quý: [year, quarter, tongTien, soHoaDon]
    @Query("SELECT YEAR(pt.ngayLap), FUNCTION('QUARTER', pt.ngayLap), " +
           "SUM(ctt.thanhTien), COUNT(DISTINCT pt.id) " +
           "FROM PhieuTra pt " +
           "JOIN pt.chiTietTraList ctt " +
           "GROUP BY YEAR(pt.ngayLap), FUNCTION('QUARTER', pt.ngayLap) " +
           "ORDER BY YEAR(pt.ngayLap) DESC, FUNCTION('QUARTER', pt.ngayLap) DESC")
    List<Object[]> thongKeTheoQuy();

    // Thống kê doanh thu theo năm: [year, tongTien, soHoaDon]
    @Query("SELECT YEAR(pt.ngayLap), SUM(ctt.thanhTien), COUNT(DISTINCT pt.id) " +
           "FROM PhieuTra pt " +
           "JOIN pt.chiTietTraList ctt " +
           "GROUP BY YEAR(pt.ngayLap) " +
           "ORDER BY YEAR(pt.ngayLap) DESC")
    List<Object[]> thongKeTheoNam();

    // Lấy danh sách phiếu trả trong 1 tháng cụ thể
    @Query("SELECT pt FROM PhieuTra pt WHERE YEAR(pt.ngayLap) = :nam AND MONTH(pt.ngayLap) = :thang")
    List<PhieuTra> findByThang(@Param("nam") int nam, @Param("thang") int thang);

    // Lấy danh sách phiếu trả trong 1 quý cụ thể
    @Query("SELECT pt FROM PhieuTra pt WHERE YEAR(pt.ngayLap) = :nam AND FUNCTION('QUARTER', pt.ngayLap) = :quy")
    List<PhieuTra> findByQuy(@Param("nam") int nam, @Param("quy") int quy);

    // Lấy danh sách phiếu trả trong 1 năm cụ thể
    @Query("SELECT pt FROM PhieuTra pt WHERE YEAR(pt.ngayLap) = :nam")
    List<PhieuTra> findByNam(@Param("nam") int nam);
}

