export interface Company {
    id: string;
    name: string;
    logo: string;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
}