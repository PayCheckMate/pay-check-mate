export interface DepartmentType {
    id: number;
    name: string;
    status: DepartmentStatus;
    created_on: string;
    updated_at: string;
}

export enum DepartmentStatus {
    Active = 1,
    Inactive = 0
}