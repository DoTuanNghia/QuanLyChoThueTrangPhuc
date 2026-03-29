import axiosInstance from './axiosInstance';
import { Loi } from '../types';

export const loiApi = {
  layTatCa: () =>
    axiosInstance.get<Loi[]>('/api/loi').then((r) => r.data),

  layTheoId: (id: number) =>
    axiosInstance.get<Loi>(`/api/loi/${id}`).then((r) => r.data),

  them: (dto: Omit<Loi, 'id'>) =>
    axiosInstance.post<Loi>('/api/loi', dto).then((r) => r.data),

  sua: (id: number, dto: Omit<Loi, 'id'>) =>
    axiosInstance.put<Loi>(`/api/loi/${id}`, dto).then((r) => r.data),

  xoa: (id: number) =>
    axiosInstance.delete(`/api/loi/${id}`).then((r) => r.data),
};
