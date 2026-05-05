import axiosInstance from './axiosInstance';
import type { JobResponse, ApiResponse } from '../types/job';

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  role: 'CANDIDATE' | 'RECRUITER' | 'ADMIN';
  status: 'ACTIVE' | 'LOCKED';
  fullName?: string;
  phone?: string;
  companyName?: string;
  avatar?: string;
  companyLogo?: string;
  createdAt: string;
}

export interface AdminCompany {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  address?: string;
  email?: string;
  isVerified: boolean;
  createdAt: string;
}

// ─── ADMIN SERVICES ───────────────────────────────────────────────────────────

/**
 * Lấy danh sách việc làm dành cho Admin (Bao gồm cả tin chờ duyệt)
 */
export async function getAllJobsForAdmin(pageNumber: number = 1, pageSize: number = 100): Promise<ApiResponse<JobResponse>> {
    const { data } = await axiosInstance.get<ApiResponse<JobResponse>>('/admin/jobs', {
        params: { pageNumber, pageSize }
    });
    return data;
}

/**
 * Duyệt hoặc Khóa bài đăng tuyển dụng
 */
export async function toggleJobStatusAdmin(jobId: string): Promise<ApiResponse<boolean>> {
    const { data } = await axiosInstance.patch<ApiResponse<boolean>>(`/admin/jobs/${jobId}/status`);
    return data;
}

/**
 * Lấy danh sách công ty
 */
export async function getAllCompaniesForAdmin(): Promise<ApiResponse<AdminCompany[]>> {
    const { data } = await axiosInstance.get<ApiResponse<AdminCompany[]>>('/admin/companies');
    return data;
}

/**
 * Xác minh công ty
 */
export async function verifyCompanyAdmin(companyId: string): Promise<ApiResponse<boolean>> {
    const { data } = await axiosInstance.patch<ApiResponse<boolean>>(`/admin/companies/${companyId}/verify`);
    return data;
}

/**
 * Lấy danh sách toàn bộ người dùng
 */
export async function getAllUsersAdmin(): Promise<ApiResponse<AdminUser[]>> {
    const { data } = await axiosInstance.get<ApiResponse<AdminUser[]>>('/admin/users');
    return data;
}

/**
 * Khóa hoặc Mở khóa tài khoản người dùng
 */
export async function toggleUserStatusAdmin(userId: string): Promise<ApiResponse<boolean>> {
    const { data } = await axiosInstance.patch<ApiResponse<boolean>>(`/admin/users/${userId}/status`);
    return data;
}

/**
 * Lấy thống kê tổng quan cho Dashboard
 */
export async function getAdminStats(): Promise<ApiResponse<any>> {
    const { data } = await axiosInstance.get<ApiResponse<any>>('/admin/dashboard/stats');
    return data;
}
