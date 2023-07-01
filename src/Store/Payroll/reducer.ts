import {PayrollType} from "../../Types/PayrollType";
import {filtersType} from "../Store";
import {defaultFilters} from "./selectors";

export interface PayrollState {
    payrolls: PayrollType[],
    loading: boolean,
    total: number,
    totalPages: number,
    filters: filtersType
}

const DefaultState: PayrollState = {
    payrolls: [] as PayrollType[],
    loading: false,
    total: 0,
    totalPages: 1,
    filters: defaultFilters as filtersType
}

const reducer = (state = DefaultState, action: any) => {
    switch (action.type) {
        case "SET_PAYROLLS":
            return {
                ...state,
                payrolls: action.payload.data,
                total: action.payload.headers['X-WP-Total'],
                totalPages: action.payload.headers['X-WP-TotalPages'],
                loading: false,
            }
        case "GET_PAYROLLS":
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
        case "UPDATE_PAYROLL":
            // Check if the payroll is new or not. If new, then add it to the top of the list
            if (action.create) {
                return {
                    ...state,
                    payrolls: [action.payload, ...state.payrolls],
                    loading: false,
                }
            } else {
                return {
                    ...state,
                    payrolls: state.payrolls.map((payroll: PayrollType) => {
                        if (payroll.id === action.payload.id) {
                            return action.payload;
                        }
                        return payroll;
                    }),
                    loading: false,
                }
            }
        default:
            return state;
    }
}

export default reducer;
