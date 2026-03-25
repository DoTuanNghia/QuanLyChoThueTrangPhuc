<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hóa Đơn Trả Trang Phục</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body>
<div class="page-wrapper">
    <header class="top-header">
        <div class="header-content">
            <span class="logo-text">Quản Lý Trả Trang Phục</span>
            <nav class="breadcrumb">
                <a href="${pageContext.request.contextPath}/tra-trang-phuc">Tìm KH</a>
                <span class="sep">&gt;</span>
                <span>Chọn KH</span>
                <span class="sep">&gt;</span>
                <span>Chọn Trang Phục</span>
                <span class="sep">&gt;</span>
                <span class="active">Hóa Đơn</span>
            </nav>
        </div>
    </header>

    <main class="main-content">
        <div class="card invoice-card">
            <div class="card-header">
                <h1 class="card-title">
                    Xác Nhận Hóa Đơn Trả Trang Phục
                </h1>
                <p class="card-subtitle">Kiểm tra thông tin trước khi xác nhận thanh toán</p>
            </div>

            <div class="card-body">

                <!-- Thông tin khách hàng & phiếu -->
                <div class="info-grid">
                    <div class="info-section">
                        <h3 class="section-title">Thông Tin Khách Hàng</h3>
                        <table class="info-table">
                            <tr><td class="info-label">Tên KH:</td><td><strong>${hoaDon.tenKhachHang}</strong></td></tr>
                            <tr><td class="info-label">Điện thoại:</td><td>${hoaDon.soDienThoaiKH}</td></tr>
                            <tr><td class="info-label">Địa chỉ:</td><td>${hoaDon.diaChiKH}</td></tr>
                        </table>
                    </div>
                    <div class="info-section">
                        <h3 class="section-title">Thông Tin Phiếu</h3>
                        <table class="info-table">
                            <tr><td class="info-label">Phiếu thuê #:</td><td><strong>${hoaDon.phieuThueId}</strong></td></tr>
                            <tr><td class="info-label">Ngày thuê:</td><td>${hoaDon.ngayThue}</td></tr>
                            <tr><td class="info-label">Ngày trả:</td><td><strong>${hoaDon.ngayTra}</strong></td></tr>
                            <tr><td class="info-label">Nhân viên:</td><td>${hoaDon.tenNhanVien}</td></tr>
                            <tr><td class="info-label">Tiền cọc:</td><td>
                                <fmt:formatNumber value="${hoaDon.tienCoc}" type="number" groupingUsed="true"/> đ
                            </td></tr>
                        </table>
                    </div>
                </div>

                <!-- Bảng chi tiết trả -->
                <h3 class="section-title mt-2">Danh Sách Trang Phục Trả</h3>
                <div class="table-wrapper">
                    <table class="data-table invoice-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tên Trang Phục</th>
                                <th>SL Trả</th>
                                <th>Đơn Giá (đ)</th>
                                <th>Ngày Thuê</th>
                                <th>Số Ngày</th>
                                <th>Tiền Thuê (đ)</th>
                                <th>Loại Lỗi</th>
                                <th>Tiền Phạt (đ)</th>
                                <th>Tổng Cộng (đ)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <c:forEach var="ct" items="${hoaDon.danhSachChiTiet}" varStatus="st">
                                <tr>
                                    <td class="text-center">${st.index + 1}</td>
                                    <td><strong>${ct.tenTrangPhuc}</strong></td>
                                    <td class="text-center">${ct.soLuong}</td>
                                    <td class="text-right">
                                        <fmt:formatNumber value="${ct.donGia}" type="number" groupingUsed="true"/>
                                    </td>
                                    <td class="text-center">${ct.ngayThue}</td>
                                    <td class="text-center">${ct.soNgayThue}</td>
                                    <td class="text-right text-blue">
                                        <fmt:formatNumber value="${ct.tienThue}" type="number" groupingUsed="true"/>
                                    </td>
                                    <td>
                                        <c:choose>
                                            <c:when test="${not empty ct.tenLoi}">
                                                <span class="badge badge-warn">${ct.tenLoi}</span>
                                            </c:when>
                                            <c:otherwise>—</c:otherwise>
                                        </c:choose>
                                    </td>
                                    <td class="text-right text-red">
                                        <c:choose>
                                            <c:when test="${ct.tienPhat > 0}">
                                                <fmt:formatNumber value="${ct.tienPhat}" type="number" groupingUsed="true"/>
                                            </c:when>
                                            <c:otherwise>—</c:otherwise>
                                        </c:choose>
                                    </td>
                                    <td class="text-right text-bold">
                                        <fmt:formatNumber value="${ct.tongCong}" type="number" groupingUsed="true"/>
                                    </td>
                                </tr>
                            </c:forEach>
                        </tbody>
                        <tfoot>
                            <tr class="subtotal-row">
                                <td colspan="5" class="text-right">Tổng tiền thuê:</td>
                                <td class="text-right text-bold text-blue">
                                    <fmt:formatNumber value="${hoaDon.tongTienThue}" type="number" groupingUsed="true"/> đ
                                </td>
                                <td colspan="2" class="text-right">Tổng tiền phạt:</td>
                                <td class="text-right text-bold text-red">
                                    <fmt:formatNumber value="${hoaDon.tongTienPhat}" type="number" groupingUsed="true"/> đ
                                </td>
                                <td></td>
                            </tr>
                            <tr class="total-row">
                                <td colspan="9" class="text-right">
                                    TỔNG SỐ TIỀN PHẢI TRẢ:
                                </td>
                                <td class="text-right total-amount">
                                    <fmt:formatNumber value="${hoaDon.tongThanhToan}" type="number" groupingUsed="true"/> đ
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <!-- Form xác nhận -->
                <form action="${pageContext.request.contextPath}/tra-trang-phuc/xac-nhan" method="post" id="formXacNhan">
                    <textarea name="requestJson" style="display:none;"><c:out value="${requestJson}"/></textarea>

                    <div class="action-bar">
                        <button type="button" class="btn btn-outline" onclick="window.history.back()">
                            Quay lại chỉnh sửa
                        </button>
                        <button type="submit" class="btn btn-success btn-large"
                                onclick="return confirm('Xác nhận thanh toán và lưu phiếu trả?')">
                            Xác Nhận Thanh Toán
                        </button>
                    </div>
                </form>

            </div>
        </div>
    </main>
</div>
</body>
</html>
