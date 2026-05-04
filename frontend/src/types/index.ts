// Cac kieu du lieu dung chung trong app

export interface Loi {
  id: number;
  tenLoi: string;
  mucPhat: number;
  moTa?: string;
}

export interface KhachHang {
  id: number;
  ten: string;
  diaChi?: string;
  soDienThoai?: string;
}

export interface NhanVien {
  id: number;
  username: string;
  ngaySinh?: string;
  diaChi?: string;
  soDienThoai?: string;
}

export interface TrangPhuc {
  id: number;
  ten: string;
  donGia: number;
  soLuong: number;
  soLuongThue: number;
}

export interface ChiTietThue {
  id: number;
  soLuong: number;
  thanhTien: number;
  trangPhuc: TrangPhuc;
  trangPhucId: number;
}

export interface PhieuThue {
  id: number;
  tienCoc: number;
  tongTien: number;
  ngayLap: string;
  tenKhachHang: string;
  chiTietThueList: ChiTietThue[];
  danhSachChuaTra?: any[];
}

// Request DTOs
export interface LoiPhatRequest {
  loiId: number;
  soLuong: number;
}

export interface ChiTietTraRequest {
  trangPhucId: number;
  soLuongTra: number;
  danhSachLoi: LoiPhatRequest[];
}

export interface PhieuTraRequest {
  phieuThueId: number;
  nhanVienId: number;
  danhSachTra: ChiTietTraRequest[];
}

// Response DTOs
export interface ChiTietLoiView {
  tenLoi: string;
  loiId: number;
  mucPhat: number;
  tongLoi: number;
  soLuong: number;
  tienPhat: number;
}

export interface HoaDonChiTiet {
  tenTrangPhuc: string;
  soLuong: number;
  donGia: number;
  ngayThue: string;
  soNgayThue: number;
  tienThue: number;
  tienPhat: number;
  danhSachLoi: ChiTietLoiView[];
  tongCong: number;
}

export interface HoaDonTra {
  tenKhachHang: string;
  soDienThoaiKH: string;
  diaChiKH: string;
  phieuThueId: number;
  ngayThue: string;
  tienCoc: number;
  ngayTra: string;
  tenNhanVien: string;
  danhSachChiTiet: HoaDonChiTiet[];
  tongTienThue: number;
  tongTienPhat: number;
  tongThanhToan: number;
  soTienConLai: number; // dương: KH trả thêm, âm: trả lại KH
}

// Thong ke doanh thu
export interface ThongKeDoanhThu {
  tenPeriod: string;
  nam: number;
  period: number;
  tongDoanhThu: number;
  soHoaDon: number;
}

export interface HoaDonThongKe {
  phieuTraId: number;
  tenKhachHang: string;
  ngayMuon: string;
  tongSoTrangPhuc: number;
  tongTienHoaDon: number;
}

// Navigation param types
export type RootStackParamList = {
  Login: undefined;
  Home: { nhanVien: NhanVien };
  DanhSachLoi: undefined;
  ThemSuaLoi: { loi?: Loi };
  TimKiemKH: { nhanVien: NhanVien };
  DanhSachPhieuThue: { khachHang: KhachHang; nhanVien: NhanVien };
  ChonTra: { phieuThue: PhieuThue; khachHang: KhachHang; nhanVien: NhanVien };
  PreviewHoaDon: { request: PhieuTraRequest; hoaDon: HoaDonTra; nhanVien: NhanVien; isViewOnly?: boolean };
  KetQua: { success: boolean; message: string; phieuTraId?: number; nhanVien: NhanVien };
  ThongKeDoanhThu: undefined;
  DanhSachHoaDon: { 
    loai: 'thang' | 'quy' | 'nam'; 
    nam: number; 
    period: number; 
    tenPeriod: string;
    color?: string;
    bg?: string;
  };
  ChiTietHoaDon: { hoaDon: HoaDonTra };
};
