import axiosInstance from './axiosInstance';
import type {
    Job,
    JobResponse,
    ApiResponse,
    JobParams,
    Category,
} from '../types/job';

// ─── Tiện ích Quản lý tin tuyển dụng ────────────────────────────────────────────────────

export async function getJobs(params?: JobParams) {
    const { data } = await axiosInstance.get<ApiResponse<JobResponse>>('/jobposts', { params });
    return data;
}

export async function getCategories() {
    const { data } = await axiosInstance.get<ApiResponse<Category[]>>('/categories');
    return data;
}

export async function getLocations() {
    const { data } = await axiosInstance.get<ApiResponse<{ id: string; name: string }[]>>('/locations');
    return data;
}

export async function getFeaturedJobs() {
    // API này trả về data là mảng [Job] trực tiếp
    const { data } = await axiosInstance.get<ApiResponse<Job[]>>('/jobposts/top');
    return data;
}
