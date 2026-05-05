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
  description?: string;
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
export async function toggleJobStatusAdmin(jobId: string, action?: string): Promise<ApiResponse<boolean>> {
    const { data } = await axiosInstance.patch<ApiResponse<boolean>>(`/admin/jobs/${jobId}/status${action ? `?action=${action}` : ''}`);
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
/**
 * Lấy danh sách toàn bộ danh mục cho Admin
 */
export async function getAllCategoriesAdmin(): Promise<ApiResponse<any[]>> {
    const { data } = await axiosInstance.get<ApiResponse<any[]>>('/admin/categories');
    return data;
}

/**
 * Thêm danh mục mới
 */
export async function addCategoryAdmin(category: any): Promise<ApiResponse<boolean>> {
    const { data } = await axiosInstance.post<ApiResponse<boolean>>('/admin/categories', category);
    return data;
}

/**
 * Cập nhật danh mục
 */
export async function updateCategoryAdmin(id: string, category: any): Promise<ApiResponse<boolean>> {
    const { data } = await axiosInstance.put<ApiResponse<boolean>>(`/admin/categories/${id}`, category);
    return data;
}

/**
 * Xóa danh mục
 */
export async function deleteCategoryAdmin(id: string): Promise<ApiResponse<boolean>> {
    const { data } = await axiosInstance.delete<ApiResponse<boolean>>(`/admin/categories/${id}`);
    return data;
}

/**
 * Lấy danh sách toàn bộ địa điểm cho Admin
 */
export async function getAllLocationsAdmin(): Promise<ApiResponse<any[]>> {
    const { data } = await axiosInstance.get<ApiResponse<any[]>>('/admin/locations');
    return data;
}

/**
 * Thêm địa điểm mới
 */
export async function addLocationAdmin(location: any): Promise<ApiResponse<boolean>> {
    const { data } = await axiosInstance.post<ApiResponse<boolean>>('/admin/locations', location);
    return data;
}

/**
 * Cập nhật địa điểm
 */
export async function updateLocationAdmin(id: string, location: any): Promise<ApiResponse<boolean>> {
    const { data } = await axiosInstance.put<ApiResponse<boolean>>(`/admin/locations/${id}`, location);
    return data;
}

/**
 * Xóa địa điểm
 */
export async function deleteLocationAdmin(id: string): Promise<ApiResponse<boolean>> {
    const { data } = await axiosInstance.delete<ApiResponse<boolean>>(`/admin/locations/${id}`);
    return data;
}
