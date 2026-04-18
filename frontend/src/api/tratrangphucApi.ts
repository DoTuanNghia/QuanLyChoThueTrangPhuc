import axiosInstance from './axiosInstance';
import { KhachHang, NhanVien, PhieuThue, PhieuTraRequest, HoaDonTra, ThongKeDoanhThu, HoaDonThongKe } from '../types';

export const tratrangphucApi = {
  timKiemKhachHang: (ten?: string) =>
    axiosInstance
      .get<KhachHang[]>('/api/khach-hang', { params: { ten } })
      .then((r) => r.data),

  layPhieuThueChuaTra: (khachHangId: number) =>
    axiosInstance
      .get<PhieuThue[]>(`/api/khach-hang/${khachHangId}/phieu-thue`)
      .then((r) => r.data),

  layNhanVien: () =>
    axiosInstance.get<NhanVien[]>('/api/nhan-vien').then((r) => r.data),

  preview: (request: PhieuTraRequest) =>
    axiosInstance.post<HoaDonTra>('/api/tra/preview', request).then((r) => r.data),

  xacNhanTra: (request: PhieuTraRequest) =>
    axiosInstance
      .post<{ success: boolean; message: string; phieuTraId?: number; hoaDon?: HoaDonTra }>(
        '/api/tra/xac-nhan',
        request
      )
      .then((r) => r.data),

  layChiTietHoaDon: (phieuTraId: number) =>
    axiosInstance.get<HoaDonTra>(`/api/tra/${phieuTraId}/chi-tiet`).then((r) => r.data),

  // ===== THONG KE DOANH THU =====
  thongKeTheoThang: () =>
    axiosInstance.get<ThongKeDoanhThu[]>('/api/thong-ke/thang').then((r) => r.data),

  thongKeTheoQuy: () =>
    axiosInstance.get<ThongKeDoanhThu[]>('/api/thong-ke/quy').then((r) => r.data),

  thongKeTheoNam: () =>
    axiosInstance.get<ThongKeDoanhThu[]>('/api/thong-ke/nam').then((r) => r.data),

  chiTietTheoThang: (nam: number, thang: number) =>
    axiosInstance
      .get<HoaDonThongKe[]>('/api/thong-ke/chi-tiet/thang', { params: { nam, thang } })
      .then((r) => r.data),

  chiTietTheoQuy: (nam: number, quy: number) =>
    axiosInstance
      .get<HoaDonThongKe[]>('/api/thong-ke/chi-tiet/quy', { params: { nam, quy } })
      .then((r) => r.data),

  chiTietTheoNam: (nam: number) =>
    axiosInstance
      .get<HoaDonThongKe[]>('/api/thong-ke/chi-tiet/nam', { params: { nam } })
      .then((r) => r.data),
};

