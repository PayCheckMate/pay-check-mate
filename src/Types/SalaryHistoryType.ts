export interface SalaryHistoryType {
    employee_id: string | number;
    basic_salary: number|string;
    salary_head_details: {
        [id: number]: number|string;
    }
    status: number;
    active_from: string;
    remarks: string;
    created_at: string;
    updated_at: string;
}
