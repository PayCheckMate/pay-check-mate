import {PayrollState} from "./reducer";
import {filtersType} from "../Store";

export const defaultFilters: filtersType={
    per_page: '10',
    page: 1,
    order_by: 'id',
    order: 'desc',
    status: '1',
}

const selectors = {
    getPayrolls: ( state: PayrollState, filters: filtersType = defaultFilters ) => {
        return state;
    },
    getFilters: ( state: PayrollState ) => {
        return state.filters;
    },
    getLoading: ( state: PayrollState ) => {
        return state.loading;
    }

}

export default selectors
