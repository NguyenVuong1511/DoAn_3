export interface Category {
    id: string;
    name: string;
    iconName: string;
    color: string;
    bgColor: string;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
}