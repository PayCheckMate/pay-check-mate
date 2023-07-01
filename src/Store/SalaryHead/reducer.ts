import {SalaryHeadType} from "../../Types/SalaryHeadType";
import {filtersType} from "../Store";
import {defaultFilters} from "./selectors";

export interface SalaryHeadState {
    salaryHeads: SalaryHeadType[],
    loading: boolean,
    total: number,
    totalPages: number,
    filters: filtersType
}

const DefaultState: SalaryHeadState = {
    salaryHeads: [] as SalaryHeadType[],
    loading: false,
    total: 0,
    totalPages: 1,
    filters: defaultFilters as filtersType
}

const reducer = (state = DefaultState, action: any) => {
    switch (action.type) {
        case "SET_SALARY_HEADS":
            return {
                ...state,
                salaryHeads: action.payload.data,
                total: action.payload.headers['X-WP-Total'],
                totalPages: action.payload.headers['X-WP-TotalPages'],
                loading: false,
            }
        case "GET_SALARY_HEADS":
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
        case "UPDATE_SALARY_HEAD":
            // Check if the salary_head is new or not. If new, then add it to the top of the list
            if (action.create) {
                return {
                    ...state,
                    salaryHeads: [action.payload, ...state.salaryHeads],
                    loading: false,
                }
            } else {
                return {
                    ...state,
                    salaryHeads: state.salaryHeads.map((salary_head: SalaryHeadType) => {
                        if (salary_head.id === action.payload.id) {
                            return action.payload;
                        }
                        return salary_head;
                    }),
                    loading: false,
                }
            }
        default:
            return state;
    }
}

export default reducer;
