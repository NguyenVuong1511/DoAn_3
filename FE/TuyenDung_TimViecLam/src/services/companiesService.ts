import axiosInstance from './axiosInstance';
import type { Company, ApiResponse } from "../types/companies.ts";

// ─── Tiện ích Quản lý công ty ────────────────────────────────────────────────────

export async function getCompanies() {
    const { data } = await axiosInstance.get<ApiResponse<Company[]>>('/companies');
    return data;
}