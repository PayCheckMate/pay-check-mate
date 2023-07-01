import {DepartmentState} from "./reducer";
import {filtersType} from "../Store";
import {DepartmentType} from "../../Types/DepartmentType";

export const defaultFilters: filtersType={
    per_page: '10',
    page: 1,
    order_by: 'id',
    order: 'desc',
    status: '1',
}

const selectors = {
    getDepartments: ( state: DepartmentState, filters: filtersType = defaultFilters ) => {
        return state;
    },
    getFilters: ( state: DepartmentState ) => {
        return state.filters;
    },
    getLoading: ( state: DepartmentState ) => {
        return state.loading;
    }

}

export default selectors
