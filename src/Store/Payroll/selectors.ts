import {PayrollState} from "./reducer";
import {filtersType} from "../Store";

export const defaultFilters: filtersType={
    per_page: '10',
    page: 1,
    order_by: 'id',
    order: 'desc',
    status: 'all',
}

const selectors = {
    getPayrolls: ( state: PayrollState, filters: filtersType = defaultFilters ) => {
        return state;
    },
    getPayroll: ( state: PayrollState, id: number ) => {
        return state.payrolls.find( payroll => payroll.id === id );
    },
    getFilters: ( state: PayrollState ) => {
        return state.filters;
    },
    getLoading: ( state: PayrollState ) => {
        return state.loading;
    }

}

export default selectors
