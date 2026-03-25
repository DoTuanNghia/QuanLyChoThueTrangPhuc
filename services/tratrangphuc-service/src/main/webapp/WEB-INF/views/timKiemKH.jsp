<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trả Trang Phục - Tìm Khách Hàng</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body>
<div class="page-wrapper">
    <header class="top-header">
        <div class="header-content">
            <span class="logo-text">Quản Lý Trả Trang Phục</span>
            <nav class="breadcrumb">
                <span>Trả Trang Phục</span>
                <span class="sep">&gt;</span>
                <span class="active">Tìm Khách Hàng</span>
            </nav>
        </div>
    </header>

    <main class="main-content">
        <div class="card search-card">
            <div class="card-header">
                <h1 class="card-title">
                    Tìm Kiếm Khách Hàng
                </h1>
            </div>
            <div class="card-body">
                <form action="${pageContext.request.contextPath}/tra-trang-phuc/tim-kiem" method="get">
                    <div class="input-group">
                        <label for="ten" class="input-label">Tên Khách Hàng</label>
                        <div class="input-wrapper">
                            <input type="text" id="ten" name="ten" class="input-field"
                                   placeholder="Nhập tên khách hàng..." />
                            <button type="submit" class="btn btn-primary">Tìm Kiếm</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </main>
</div>
</body>
</html>
