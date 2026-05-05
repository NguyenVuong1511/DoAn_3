import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getUserRole, getToken, clearAuthData } from '../../services/authService';
import { isTokenExpired } from '../../utils/jwt';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const token = getToken();
  const role = (getUserRole() || '').toUpperCase();
  const location = useLocation();

  // 1. Kiểm tra xem đã đăng nhập và token còn hạn không
  if (!token || isTokenExpired(token)) {
    if (token) clearAuthData(); // Xóa data nếu token hết hạn
    // Lưu lại vị trí đang truy cập để sau khi login có thể quay lại
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Kiểm tra role nếu có yêu cầu
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Nếu role không khớp, đẩy về trang chủ hoặc trang thông báo lỗi
    // Ở đây tôi đẩy về trang chủ cho đơn giản
    console.warn(`Access denied. Role ${role} is not in allowed roles: ${allowedRoles}`);
    return <Navigate to="/" replace />;
  }

  // 3. Nếu thỏa mãn hết thì render children
  return <>{children}</>;
};

export default ProtectedRoute;
