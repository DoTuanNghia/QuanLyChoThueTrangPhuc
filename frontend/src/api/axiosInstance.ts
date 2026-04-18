import axios from 'axios';

// Goi truc tiep vao tratrangphuc-service :8081
// (Chua co API Gateway - truoc day la 8888)
// Doi voi Android Emulator: thay localhost -> 10.0.2.2
// Doi voi thiet bi that: thay localhost -> IP may tinh
const BASE_URL = 'http://localhost:8081';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Lỗi kết nối mạng';
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
