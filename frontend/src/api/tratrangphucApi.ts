import axiosInstance from './axiosInstance';
import { KhachHang, NhanVien, PhieuThue, PhieuTraRequest, HoaDonTra } from '../types';

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
};
