import axiosInstance from './axiosInstance';
import { NhanVien } from '../types';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  nhanVien: NhanVien;
  message: string;
}

export const dangNhap = async (payload: LoginRequest): Promise<LoginResponse> => {
  const res = await axiosInstance.post<LoginResponse>('/api/thanh-vien/login', payload);
  return res.data;
};
