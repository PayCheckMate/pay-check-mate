import {filtersType} from "../../Types/DesignationType";
import {DesignationState} from "./reducer";

export const filter: filtersType={
    per_page: '10',
    page: 1,
    order_by: 'id',
    order: 'desc',
    status: '1',
}

const selectors = {
    getDesignations: ( state: DesignationState, filters: filtersType = filter ) => {
        return state;
    },

    getLoading: ( state: DesignationState ) => {
        return state.loading;
    }

}

export default selectors