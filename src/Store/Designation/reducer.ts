import {DesignationType, filtersType} from "../../Types/DesignationType";

export interface DesignationState {
    designations: DesignationType[],
    loading: boolean,
    total: number,
    totalPages: number,
    filters: filtersType
}

const DefaultState: DesignationState = {
    designations: [] as DesignationType[],
    loading: false,
    total: 0,
    totalPages: 1,
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
        case "UPDATE_FILTERS":
            return {
                ...state,
                filters: action.payload,
            };
        case "UPDATE_DESIGNATION_STATUS":
            return {
                ...state,
                designations: state.designations.map((designation: DesignationType) => {
                    designation.id === action.payload.id ? action.payload : designation
                }),
                loading: false,
            }
        default:
            return state;
    }
}

export default reducer;