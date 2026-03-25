<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kết Quả Thanh Toán</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css?v=1.1">
</head>
<body>
<div class="page-wrapper">
    <header class="top-header">
        <div class="header-content">
            <span class="logo-text">Quản Lý Trả Trang Phục</span>
        </div>
    </header>

    <main class="main-content center-content" style="padding-top: 40px; padding-bottom: 60px;">
        <div class="card result-card ${loai == 'success' ? 'invoice-result-card' : ''}">
            <c:choose>
                <c:when test="${loai == 'success'}">
                    <!-- Animation Checkmark -->
                    <div class="success-animation">
                        <div class="checkmark-circle">
                            <div class="checkmark-stem"></div>
                            <div class="checkmark-kick"></div>
                        </div>
                    </div>
                    
                    <h2 class="result-title success-text" style="font-size: 24px; margin-bottom: 6px;">Thanh Toán Thành Công!</h2>
                    <p class="result-message" style="margin-bottom: 30px;">${thongBao}</p>
                    
                    <!-- INVOICE RECEIPT -->
                    <c:if test="${not empty hoaDon}">
                        <div class="invoice-receipt">
                            <div class="receipt-header text-center">
                                <h3>HÓA ĐƠN TRẢ TRANG PHỤC</h3>
                                <p class="text-muted">Ngày: ${hoaDon.ngayTra}</p>
                            </div>
                            
                            <div class="receipt-info text-left">
                                <p><span>Khách hàng:</span> <strong>${hoaDon.tenKhachHang}</strong></p>
                                <p><span>Điện thoại:</span> ${hoaDon.soDienThoaiKH}</p>
                                <p><span>Nhân viên:</span> ${hoaDon.tenNhanVien}</p>
                            </div>
                            
                            <table class="receipt-table">
                                <thead>
                                    <tr>
                                        <th class="text-left">Dịch vụ</th>
                                        <th class="text-right">SL</th>
                                        <th class="text-right">T.Tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <c:forEach var="ct" items="${hoaDon.danhSachChiTiet}">
                                        <tr>
                                            <td class="text-left py-2">
                                                <strong>${ct.tenTrangPhuc}</strong><br>
                                                <small class="text-muted">Thuê ${ct.soNgayThue} ngày</small>
                                                <c:if test="${ct.tienPhat > 0}">
                                                    <br><small class="text-red">Phạt: <fmt:formatNumber value="${ct.tienPhat}" pattern="#,###" />đ <c:if test="${not empty ct.tenLoi}">(${ct.tenLoi})</c:if></small>
                                                </c:if>
                                            </td>
                                            <td class="text-right align-top py-2">${ct.soLuong}</td>
                                            <td class="text-right align-top py-2"><strong><fmt:formatNumber value="${ct.tongCong}" pattern="#,###" />đ</strong></td>
                                        </tr>
                                    </c:forEach>
                                </tbody>
                            </table>
                            
                            <div class="receipt-summary">
                                <div class="summary-row">
                                    <span>Tổng tiền thuê:</span>
                                    <span><fmt:formatNumber value="${hoaDon.tongTienThue}" pattern="#,###" />đ</span>
                                </div>
                                <c:if test="${hoaDon.tongTienPhat > 0}">
                                    <div class="summary-row text-red">
                                        <span>Phạt hư hỏng/quá hạn:</span>
                                        <span><fmt:formatNumber value="${hoaDon.tongTienPhat}" pattern="#,###" />đ</span>
                                    </div>
                                </c:if>
                                <div class="summary-row total-row">
                                    <span>Tổng Thanh Toán:</span>
                                    <span class="text-blue total-amount-large"><fmt:formatNumber value="${hoaDon.tongThanhToan}" pattern="#,###" />đ</span>
                                </div>
                            </div>
                            
                            <div class="receipt-footer text-center">
                                <p>Cảm ơn quý khách đã sử dụng dịch vụ!</p>
                            </div>
                        </div>
                    </c:if>
                </c:when>
                <c:when test="${loai == 'error'}">
                    <div class="error-circle">!</div>
                    <h2 class="result-title error-text">Có Lỗi Xảy Ra</h2>
                    <p class="result-message">${thongBao}</p>
                </c:when>
                <c:otherwise>
                    <h2 class="result-title">Thông Báo</h2>
                    <p class="result-message">
                        <c:choose>
                            <c:when test="${not empty thongBao}">${thongBao}</c:when>
                            <c:otherwise>Thao tác đã được thực hiện.</c:otherwise>
                        </c:choose>
                    </p>
                </c:otherwise>
            </c:choose>

            <div class="action-bar" style="margin-top: 30px;">
                 <a href="${pageContext.request.contextPath}/tra-trang-phuc" class="btn btn-primary btn-large" style="width: 100%; border-radius: 6px; padding: 12px;">
                    Hoàn Tất & Về Trang Chủ
                </a>
                <c:if test="${loai == 'success'}">
                    <button type="button" class="btn btn-outline" style="width: 100%; margin-top: 10px; border-radius: 6px; padding: 12px;" onclick="window.print()">
                        In Hóa Đơn
                    </button>
                </c:if>
            </div>
        </div>
    </main>
</div>
</body>
</html>
