import {register} from "@wordpress/data";
import designations from "./Designation";
import department from "./Department";
import salaryHead from "./SalaryHead";

export interface filtersType {
    per_page?: string,
    page?: number,
    order_by?: string,
    order?: string,
    status?: string,
}

register(designations);
register(department);
register(salaryHead);
