import {DesignationState} from "./reducer";
import {filtersType} from "../Store";

export const defaultFilters: filtersType={
    per_page: '10',
    page: 1,
    order_by: 'id',
    order: 'desc',
    status: '1',
}

const selectors = {
    getDesignations: ( state: DesignationState, filters: filtersType = defaultFilters ) => {
        return state;
    },
    getFilters: ( state: DesignationState ) => {
        return state.filters;
    },
    getLoading: ( state: DesignationState ) => {
        return state.loading;
    },
    getDesignation: ( state: DesignationState, id: number ) => {
        return state.designations.find( ( designation: any ) => designation.id === id );
    }

}

export default selectors
