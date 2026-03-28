import axiosInstance from './axiosInstance';
import type {
  LoginRequest,
  LoginResponse,
  RegisterCandidateRequest,
  RegisterRecruiterRequest,
  ApiResponse,
} from '../types/auth';

// ─── Đăng nhập ────────────────────────────────────────────────────────────────
export async function loginApi(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await axiosInstance.post<ApiResponse<LoginResponse>>('/auth/login', payload);

  if (!data.data) throw new Error(data.message ?? 'Đăng nhập thất bại');

  // Lưu thông tin vào localStorage
  localStorage.setItem('authToken', data.data.token);
  localStorage.setItem('userRole', data.data.role);
  localStorage.setItem('userId', data.data.userId);

  return data.data;
}

// ─── Đăng ký ứng viên ─────────────────────────────────────────────────────────
export async function registerCandidateApi(
  payload: RegisterCandidateRequest
): Promise<ApiResponse> {
  const { data } = await axiosInstance.post<ApiResponse>('/auth/register/candidate', payload);
  return data;
}

// ─── Đăng ký nhà tuyển dụng ──────────────────────────────────────────────────
export async function registerRecruiterApi(
  payload: RegisterRecruiterRequest
): Promise<ApiResponse> {
  const { data } = await axiosInstance.post<ApiResponse>('/auth/register/recruiter', payload);
  return data;
}

// ─── Đăng xuất ───────────────────────────────────────────────────────────────
export function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
}

// ─── Lấy token đã lưu ─────────────────────────────────────────────────────────
export function getToken(): string | null {
  return localStorage.getItem('authToken');
}
