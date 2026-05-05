export interface Company {
    id: string;
    name: string;
    logo?: string;
    address?: string;
    website?: string;
    description?: string;
    isVerified: boolean;
    industry?: string;
    size?: string;
    phone?: string;
    email?: string;
    cover?: string;
    culture?: string;
    benefits?: string;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
}