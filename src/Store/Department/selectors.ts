import {DepartmentState} from "./reducer";
import {filtersType} from "../Store";

export const filter: filtersType={
    per_page: '10',
    page: 1,
    order_by: 'id',
    order: 'desc',
    status: '1',
}

const selectors = {
    getDepartments: ( state: DepartmentState, filters: filtersType = filter ) => {
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
