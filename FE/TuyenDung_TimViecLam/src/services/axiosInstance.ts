import axios from 'axios';

// ─── Tạo một axios instance dùng chung cho cả app ────────────────────────────
const axiosInstance = axios.create({
  baseURL: 'https://localhost:7255/gateway',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 giây timeout
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Tự động đính kèm token vào mọi request nếu đã đăng nhập
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Xử lý lỗi chung: 401 tự động logout, lấy message từ backend
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Chỉ tự động logout + redirect khi KHÔNG đang ở trang login
      // (tức là token hết hạn khi đã đăng nhập rồi)
      // Nếu đang ở trang /login thì để lỗi trả về cho form tự hiển thị
      const isOnLoginPage = window.location.pathname === '/login';
      if (!isOnLoginPage) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userRole');
        sessionStorage.removeItem('userId');
        window.location.href = '/login';
      }
    }

    // Lấy message từ backend nếu có, fallback về message mặc định
    const message =
      error.response?.data?.message ??
      error.message ??
      'Đã xảy ra lỗi, vui lòng thử lại.';

    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
