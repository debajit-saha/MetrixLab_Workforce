export interface IEmployeeResponse {
    data: IEmployee[];
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
}

export interface IEmployee {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar: string;
}
