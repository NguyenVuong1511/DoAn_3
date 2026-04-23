import axiosInstance from './axiosInstance';
import type {
    Category,
    ApiResponse,
} from '../types/categories';

// ─── Tiện ích Quản lý danh mục ────────────────────────────────────────────────────

export async function getCategories() {
    const { data } = await axiosInstance.get<ApiResponse<Category[]>>('/categories');
    return data;
}