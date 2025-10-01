export interface User{
    id: number;
    username: string;
    firstname: string;
    lastname: string;   
    email: string;
}

export interface Task{
    id: number;
    title: string;
    description: string | null;
    status: string;
    due_date: string | null;
    responsible: number;
    created_at: string;
}

export interface Project{
    id: number;
    name: string;
    description: string | null;
    creator: number;
    created_at: string;
    tasks: Task[];
}

export interface RegisterErrorResponse {
    username?: string[];
    email?: string[];
    password?: string[];
    password2?: string[];
    non_field_errors?: string[];
    general?: string[];
}

export interface LoginErrorResponse {
    non_field_errors?: string[];
    detail?: string;
}

