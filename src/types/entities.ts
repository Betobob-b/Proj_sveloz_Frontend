export interface User{
    id: number;
    userName: string;
    firstName: string;
    lastName: string;   
    email: string;
}

export interface Task{
    id: number;
    title: string;
    description: string | null;
    status: string;
    dueDate: string | null;
    responsible: number;
    createdAt: string;
}

export interface Project{
    id: number;
    name: string;
    description: string | null;
    creator: number;
    createdAt: string;
    tasks: Task[];
}