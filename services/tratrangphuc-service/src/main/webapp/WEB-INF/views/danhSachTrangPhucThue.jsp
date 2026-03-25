<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trang Phục Đang Mượn - Chọn Trả</title>
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
                <a href="javascript:history.back()">Chọn KH</a>
                <span class="sep">&gt;</span>
                <span class="active">Trang Phục Đang Mượn</span>
            </nav>
        </div>
    </header>

    <main class="main-content">
        <div class="card">
            <div class="card-header">
                <h1 class="card-title">
                    Chọn Trang Phục Muốn Trả
                </h1>
                <p class="card-subtitle">
                    Khách hàng: <strong>${tenKhachHang}</strong>
                    — Tích chọn các trang phục đem trả, nhập số lượng trả và tiền phạt nếu có
                </p>
            </div>

            <div class="card-body">
                <form action="${pageContext.request.contextPath}/tra-trang-phuc/preview-hoa-don"
                      method="post" id="formTra">

                    <!-- Fix cứng nhân viên id = 1 -->
                    <input type="hidden" name="nhanVienId" id="nhanVienId" value="1" />

                    <c:forEach var="pt" items="${phieuThueList}">
                        <div class="phieu-thue-block">
                            <div class="phieu-thue-header">
                                <span>Phiếu Thuê #${pt.id}</span>
                                <span>Ngày thuê: ${pt.ngayLap}</span>
                                <span>Tiền cọc: <fmt:formatNumber value="${pt.tienCoc}" type="number" groupingUsed="true"/> đ</span>
                            </div>

                            <div class="table-wrapper">
                                <table class="data-table">
                                    <thead>
                                        <tr>
                                            <th>Trả</th>
                                            <th>Tên Trang Phục</th>
                                            <th>Đơn Giá (đ)</th>
                                            <th>Ngày Thuê</th>
                                            <th>Số Ngày</th>
                                            <th>Tiền Thuê (đ)</th>
                                            <th>SL Trả</th>
                                            <th>Loại Lỗi</th>
                                            <th>Tiền Phạt (đ)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <c:forEach var="ctt" items="${pt.danhSachChuaTra}">
                                            <tr class="item-row" id="row-${ctt.id}">
                                                <!-- Checkbox chọn trả -->
                                                <td class="text-center">
                                                    <input type="checkbox"
                                                           class="tra-checkbox"
                                                           id="chk-${ctt.id}"
                                                           data-row="row-${ctt.id}"
                                                           onchange="toggleRow(this)" />
                                                </td>

                                                <!-- Hidden fields (chỉ submit khi được tích) -->
                                                <input type="hidden" name="chiTietThueIds" value="${ctt.id}" class="hidden-ctt-id" disabled />
                                                <input type="hidden" name="soLuongTras"    value="${ctt.soLuong}" class="hidden-sl-tra" disabled />
                                                <input type="hidden" name="tienPhats"      value="0" class="hidden-tien-phat" disabled />
                                                <input type="hidden" name="loiIds"         value="0" class="hidden-loi-id" disabled />
                                                <input type="hidden" name="soLois"         value="0" class="hidden-so-loi" disabled />

                                                <td>${ctt.tenTrangPhuc} (Đã thuê: ${ctt.soLuong})</td>
                                                <td class="text-right">
                                                    <fmt:formatNumber value="${ctt.donGia}" type="number" groupingUsed="true"/>
                                                </td>
                                                <td class="text-center">${ctt.ngayThue}</td>
                                                <td class="text-center">${ctt.soNgayThue}</td>
                                                <td class="text-right">
                                                    <fmt:formatNumber value="${ctt.tienThueDenNay}" type="number" groupingUsed="true"/>
                                                </td>

                                                <!-- SL Trả -->
                                                <td class="text-center">
                                                    <input type="number"
                                                           class="input-field input-small sl-tra-input"
                                                           value="${ctt.soLuong}"
                                                           min="1" max="${ctt.soLuong}" step="1"
                                                           disabled
                                                           onchange="capNhatSLTra(this)"
                                                           style="width:60px;" />
                                                </td>

                                                <!-- Loại lỗi -->
                                                <td>
                                                    <select class="select-field select-small loi-select"
                                                            disabled
                                                            onchange="capNhatLoi(this)">
                                                        <option value="0">Không có</option>
                                                        <c:forEach var="loi" items="${danhSachLoi}">
                                                            <option value="${loi.id}" data-phat="${loi.mucPhat}">
                                                                ${loi.tenLoi}
                                                            </option>
                                                        </c:forEach>
                                                    </select>
                                                </td>

                                                <!-- Tiền phạt -->
                                                <td>
                                                    <input type="number"
                                                           class="input-field input-small tien-phat-input"
                                                           value="0" min="0" step="1000"
                                                           disabled
                                                           onchange="capNhatTienPhat(this)"
                                                           style="width:90px;" />
                                                </td>
                                            </tr>
                                        </c:forEach>
                                    </tbody>
                                </table>
                            </div>

                            <input type="hidden" name="phieuThueId" value="${pt.id}" />
                        </div>
                    </c:forEach>

                    <div class="action-bar">
                        <a href="javascript:history.back()" class="btn btn-outline">Quay lại</a>
                        <button type="button" class="btn btn-primary btn-large" onclick="submitForm()">
                            Thanh Toán
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </main>
</div>

<script>
function toggleRow(checkbox) {
    const row = document.getElementById(checkbox.dataset.row);
    const hiddenInputs = row.querySelectorAll('.hidden-ctt-id, .hidden-sl-tra, .hidden-tien-phat, .hidden-loi-id, .hidden-so-loi');
    const visibleInputs = row.querySelectorAll('.sl-tra-input, .loi-select, .tien-phat-input');

    if (checkbox.checked) {
        row.classList.add('selected');
        hiddenInputs.forEach(i => i.disabled = false);
        visibleInputs.forEach(i => i.disabled = false);
    } else {
        row.classList.remove('selected');
        hiddenInputs.forEach(i => i.disabled = true);
        visibleInputs.forEach(i => i.disabled = true);
    }
}

function capNhatSLTra(input) {
    const row = input.closest('tr');
    const hidden = row.querySelector('.hidden-sl-tra');
    if (hidden) hidden.value = input.value || input.max;
}

function capNhatLoi(select) {
    const row = select.closest('tr');
    const hiddenLoiId  = row.querySelector('.hidden-loi-id');
    const hiddenSoLoi  = row.querySelector('.hidden-so-loi');
    const tienPhatInput= row.querySelector('.tien-phat-input');
    const hiddenTienPhat = row.querySelector('.hidden-tien-phat');

    if (hiddenLoiId) hiddenLoiId.value = select.value;

    if (select.value !== '0') {
        const mucPhat = parseFloat(select.options[select.selectedIndex].dataset.phat) || 0;
        if (tienPhatInput) { tienPhatInput.value = mucPhat; }
        if (hiddenTienPhat) hiddenTienPhat.value = mucPhat;
        if (hiddenSoLoi) hiddenSoLoi.value = 1;
    } else {
        if (tienPhatInput) tienPhatInput.value = 0;
        if (hiddenTienPhat) hiddenTienPhat.value = 0;
        if (hiddenSoLoi) hiddenSoLoi.value = 0;
    }
}

function capNhatTienPhat(input) {
    const row = input.closest('tr');
    const hiddenTienPhat = row.querySelector('.hidden-tien-phat');
    if (hiddenTienPhat) hiddenTienPhat.value = input.value || 0;
}

function submitForm() {
    const checked = document.querySelectorAll('.tra-checkbox:checked');
    if (checked.length === 0) {
        alert('Vui lòng tích chọn ít nhất một trang phục để trả!');
        return;
    }
    document.getElementById('formTra').submit();
}
</script>
</body>
</html>
