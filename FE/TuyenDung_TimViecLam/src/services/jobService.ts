import axiosInstance from './axiosInstance';
import type {
    Job,
    JobResponse,
    ApiResponse,
    JobParams,
    Category,
    Level,
    Experience,
    JobType,
} from '../types/job';

// ─── Tiện ích Quản lý tin tuyển dụng ────────────────────────────────────────────────────

export async function getJobs(params?: JobParams) {
    const { data } = await axiosInstance.get<ApiResponse<JobResponse>>('/jobposts', { params });
    return data;
}

export async function getJobById(id: string) {
    const { data } = await axiosInstance.get<ApiResponse<Job>>(`/jobposts/${id}`);
    return data;
}

export async function getJobsByCompanyId(companyId: string) {
    const { data } = await axiosInstance.get<ApiResponse<Job[]>>(`/jobposts/company/${companyId}`);
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

export async function toggleSavedJob(userId: string, jobPostId: string) {
    const { data } = await axiosInstance.post<ApiResponse<boolean>>(`/savedjobs/toggle?userId=${userId}&jobPostId=${jobPostId}`);
    return data;
}

export async function checkIsSaved(userId: string, jobPostId: string) {
    const { data } = await axiosInstance.get<ApiResponse<boolean>>(`/savedjobs/check?userId=${userId}&jobPostId=${jobPostId}`);
    return data;
}

export async function getSavedJobs(userId: string, pageNumber: number = 1, pageSize: number = 9) {
    const { data } = await axiosInstance.get<ApiResponse<JobResponse>>(`/savedjobs/user/${userId}`, {
        params: { pageNumber, pageSize }
    });
    return data;
}

export async function getLevels() {
    const { data } = await axiosInstance.get<ApiResponse<Level[]>>('/metadata/levels');
    return data;
}

export async function getExperiences() {
    const { data } = await axiosInstance.get<ApiResponse<Experience[]>>('/metadata/experiences');
    return data;
}

export async function getJobTypes() {
    const { data } = await axiosInstance.get<ApiResponse<JobType[]>>('/metadata/jobtypes');
    return data;
}

export async function createJobApi(job: any) {
    const { data } = await axiosInstance.post<ApiResponse<Job>>('/jobposts', job);
    return data;
}

export async function updateJobApi(id: string, job: any) {
    const { data } = await axiosInstance.put<ApiResponse<Job>>(`/jobposts/${id}`, job);
    return data;
}

export async function deleteJobApi(id: string) {
    const { data } = await axiosInstance.delete<ApiResponse<boolean>>(`/jobposts/${id}`);
    return data;
}

export async function toggleJobStatusApi(id: string) {
    const { data } = await axiosInstance.put<ApiResponse<boolean>>(`/jobposts/${id}/toggle-status`);
    return data;
}
