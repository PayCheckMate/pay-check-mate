import {register} from "@wordpress/data";
import designations from "./Designation";
import department from "./Department";

export interface filtersType {
    per_page?: string,
    page?: number,
    order_by?: string,
    order?: string,
    status?: string,
}

register(designations);
register(department);
