import {register} from "@wordpress/data";
import designations from "./Designation";
import department from "./Department";
import salaryHead from "./SalaryHead";
import payroll from "./Payroll";

export interface filtersType {
    per_page: string | number,
    page?: number,
    search?: string,
    order_by?: string,
    order?: string,
    status?: string,
}

register(designations);
register(department);
register(salaryHead);
register(payroll);
