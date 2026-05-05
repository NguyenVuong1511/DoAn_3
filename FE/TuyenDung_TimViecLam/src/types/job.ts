export interface Job {
    id: string;
    recruiterId: string;
    companyId: string;
    categoryId: string;
    locationId: string;
    jobTypeId: string;
    levelId: string;
    experienceId: string;
    title: string;
    description: string | null;
    requirement: string | null;
    benefit: string | null;
    minSalary: number;
    maxSalary: number;
    quantity: number;
    postDate: string;
    deadline: string;
    status: string;
    companyName: string;
    companyLogo: string;
    locationName: string;
    jobTypeName: string;
    levelName: string;
    experienceName: string;
    applicationCount: number;
}

export interface JobResponse {
    jobs: Job[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

export interface JobParams {
    pageNumber?: number;
    pageSize?: number;
    title?: string;
    categoryId?: string;
    locationId?: string;
    jobTypeId?: string;
    levelId?: string;
    experienceId?: string;
    minSalary?: number;
    maxSalary?: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface Category {
    id: string;
    name: string;
    iconName: string;
    color: string;
    bgColor: string;
}

export interface Level {
    id: string;
    name: string;
}

export interface Experience {
    id: string;
    name: string;
}

export interface JobType {
    id: string;
    name: string;
}
