import {SalaryHeadState} from "./reducer";
import {filtersType} from "../Store";

export const defaultFilters: filtersType = {
    per_page: '10',
    page: 1,
    order_by: 'id',
    order: 'desc',
    status: 'all',
}

const selectors = {
    getSalaryHeads: ( state: SalaryHeadState, filters: filtersType = defaultFilters ) => {
        return state;
    },
    getFilters: ( state: SalaryHeadState ) => {
        return state.filters;
    },
    getLoading: ( state: SalaryHeadState ) => {
        return state.loading;
    }

}

export default selectors
