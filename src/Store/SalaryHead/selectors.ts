import {SalaryHeadState} from "./reducer";
import {filtersType} from "../Store";

export const filter: filtersType={
    per_page: '10',
    page: 1,
    order_by: 'id',
    order: 'desc',
    status: '1',
}

const selectors = {
    getSalaryHeads: ( state: SalaryHeadState, filters: filtersType = filter ) => {
        console.log(state)
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
