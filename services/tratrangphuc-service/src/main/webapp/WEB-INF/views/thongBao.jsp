<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kết Quả</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body>
<div class="page-wrapper">
    <header class="top-header">
        <div class="header-content">
            <span class="logo-text">Quản Lý Trả Trang Phục</span>
        </div>
    </header>

    <main class="main-content center-content">
        <div class="card result-card">
            <c:choose>
                <c:when test="${loai == 'success'}">
                    <h2 class="result-title success-text">Thành Công</h2>
                </c:when>
                <c:when test="${loai == 'error'}">
                    <h2 class="result-title error-text">Có Lỗi Xảy Ra</h2>
                </c:when>
                <c:otherwise>
                    <h2 class="result-title">Thông Báo</h2>
                </c:otherwise>
            </c:choose>

            <p class="result-message">
                <c:choose>
                    <c:when test="${not empty thongBao}">${thongBao}</c:when>
                    <c:otherwise>Thao tác đã được thực hiện.</c:otherwise>
                </c:choose>
            </p>

            <div class="action-bar">
                <a href="${pageContext.request.contextPath}/tra-trang-phuc" class="btn btn-primary btn-large">
                    Trả Trang Phục Tiếp Theo
                </a>
            </div>
        </div>
    </main>
</div>
</body>
</html>
