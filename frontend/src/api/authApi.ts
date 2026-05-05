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
  console.log('DEBUG: Sending login request with payload:', payload);
  try {
    const res = await axiosInstance.post<LoginResponse>('/api/thanh-vien/login', payload);
    console.log('DEBUG: Login response:', res.data);
    return res.data;
  } catch (error: any) {
    console.error('DEBUG: Login failed with error:', error.response ? error.response.data : error.message);
    throw error;
  }
};
