import {DesignationType, filtersType} from "../../Types/DesignationType";

export interface DesignationState {
    designations: DesignationType[],
    loading: boolean,
    statusLoading: boolean,
    total: number,
    totalPages: number,
    statuses: {},
    filters: filtersType
}

const DefaultState: DesignationState = {
    designations: [] as DesignationType[],
    loading: false,
    statusLoading: false,
    total: 0,
    totalPages: 1,
    statuses: {},
    filters: {} as filtersType
}

const reducer = (state = DefaultState, action: any) => {
    switch (action.type) {
        case "SET_DESIGNATIONS":
            return {
                ...state,
                designations: action.payload.data,
                total: action.payload.headers['X-WP-Total'],
                totalPages: action.payload.headers['X-WP-TotalPages'],
                loading: false,
            }
       case "GET_DESIGNATIONS":
            return state;
        case "SET_LOADING":
            return {
                ...state,
                loading: action.payload,
            }
        default:
            return state;
    }
}

export default reducer;