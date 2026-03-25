<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Danh Sách Khách Hàng</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body>
<div class="page-wrapper">
    <header class="top-header">
        <div class="header-content">
            <span class="logo-text">Quản Lý Trả Trang Phục</span>
            <nav class="breadcrumb">
                <a href="${pageContext.request.contextPath}/tra-trang-phuc">Tìm Khách Hàng</a>
                <span class="sep">&gt;</span>
                <span class="active">Danh Sách Kết Quả</span>
            </nav>
        </div>
    </header>

    <main class="main-content">
        <div class="card">
            <div class="card-header">
                <h1 class="card-title">
                    Chọn Khách Hàng
                </h1>
                <p class="card-subtitle">
                    Kết quả tìm kiếm: "<strong>${tuKhoa}</strong>"
                    — Tìm thấy <strong>${danhSachKH.size()}</strong> khách hàng
                </p>
            </div>
            <div class="card-body">

                <form action="${pageContext.request.contextPath}/tra-trang-phuc/tim-kiem" method="get" style="margin-bottom:16px;">
                    <div class="input-wrapper">
                        <input type="text" name="ten" class="input-field" value="${tuKhoa}" placeholder="Tìm lại..." />
                        <button type="submit" class="btn btn-outline">Tìm lại</button>
                    </div>
                </form>

                <c:choose>
                    <c:when test="${empty danhSachKH}">
                        <div class="empty-state">
                            <p>Không tìm thấy khách hàng nào với tên "<strong>${tuKhoa}</strong>".</p>
                            <br/>
                            <a href="${pageContext.request.contextPath}/tra-trang-phuc" class="btn btn-primary">Quay lại tìm kiếm</a>
                        </div>
                    </c:when>
                    <c:otherwise>
                        <div class="table-wrapper">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Tên Khách Hàng</th>
                                        <th>Số Điện Thoại</th>
                                        <th>Địa Chỉ</th>
                                        <th>Chọn</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <c:forEach var="kh" items="${danhSachKH}" varStatus="st">
                                        <tr>
                                            <td class="text-center">${st.index + 1}</td>
                                            <td class="customer-name">${kh.ten}</td>
                                            <td>${kh.soDienThoai}</td>
                                            <td>${kh.diaChi}</td>
                                            <td class="text-center">
                                                <a href="${pageContext.request.contextPath}/tra-trang-phuc/trang-phuc-dang-muon/${kh.id}"
                                                   class="btn btn-primary btn-sm">Chọn</a>
                                            </td>
                                        </tr>
                                    </c:forEach>
                                </tbody>
                            </table>
                        </div>
                    </c:otherwise>
                </c:choose>
            </div>
        </div>
    </main>
</div>
</body>
</html>
