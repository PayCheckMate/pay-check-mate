export interface DesignationType {
    id: number;
    name: string;
    status: DesignationStatus;
    created_on: string;
    updated_at: string;
}

export enum DesignationStatus {
    Active = 1,
    Inactive = 0
}
