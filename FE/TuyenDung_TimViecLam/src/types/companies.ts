export interface Company {
    id: string;
    name: string;
    logoUrl: string;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
}