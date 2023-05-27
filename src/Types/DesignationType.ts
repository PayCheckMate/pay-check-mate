export interface DesignationType {
    id: number;
    designation_name: string;
    status: number;
    created_on: string;
    updated_at: string;
}

export enum DesignationStatus {
    Active = 1,
    Inactive = 0
}