// ─── Login ────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
  email: string;
  role: 'candidate' | 'employer' | 'admin';
  fullName?: string;
}

// ─── Register – Ứng viên ──────────────────────────────────────────────────────

export interface RegisterCandidateRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  dateOfBirth?: string;   // "YYYY-MM-DD"
  gender?: string;
  address?: string;
}

// ─── Register – Nhà tuyển dụng ───────────────────────────────────────────────

export interface RegisterRecruiterRequest {
  email: string;
  password: string;
  companyName: string;
  companyAddress?: string;
  companyWebsite?: string;
  companyDescription?: string;
}

// ─── Phản hồi chung từ API ────────────────────────────────────────────────────

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
}
