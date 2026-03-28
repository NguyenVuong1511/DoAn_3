import type {
  LoginRequest,
  LoginResponse,
  RegisterCandidateRequest,
  RegisterEmployerRequest,
  ApiResponse,
} from '../types/auth';

// ─── Base URL (đổi lại nếu backend đổi host) ─────────────────────────────────
const BASE_URL = 'https://localhost:7255/gateway/auth';

// ─── Helper gọi API ───────────────────────────────────────────────────────────
async function post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  // Nếu backend trả về JSON lỗi có cấu trúc
  const data = await res.json().catch(() => ({ success: false, message: 'Lỗi không xác định' }));

  if (!res.ok) {
    // Ưu tiên message từ backend, fallback theo HTTP status
    throw new Error(data?.message ?? `Lỗi ${res.status}`);
  }

  return data as ApiResponse<T>;
}

// ─── Đăng nhập ────────────────────────────────────────────────────────────────
export async function loginApi(payload: LoginRequest): Promise<LoginResponse> {
  const res = await post<LoginResponse>('/login', payload);

  if (!res.data) throw new Error(res.message ?? 'Đăng nhập thất bại');

  // Lưu token vào localStorage để dùng tiếp
  localStorage.setItem('authToken', res.data.token);
  localStorage.setItem('userRole', res.data.role);
  localStorage.setItem('userId', res.data.userId);

  return res.data;
}

// ─── Đăng ký ứng viên ─────────────────────────────────────────────────────────
export async function registerCandidateApi(
  payload: RegisterCandidateRequest
): Promise<ApiResponse> {
  return post('/register/candidate', payload);
}

// ─── Đăng ký nhà tuyển dụng ──────────────────────────────────────────────────
export async function registerEmployerApi(
  payload: RegisterEmployerRequest
): Promise<ApiResponse> {
  return post('/register/employer', payload);
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
