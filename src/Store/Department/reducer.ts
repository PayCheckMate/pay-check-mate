import {DepartmentType} from "../../Types/DepartmentType";
import {filtersType} from "../Store";

export interface DepartmentState {
    departments: DepartmentType[],
    loading: boolean,
    total: number,
    totalPages: number,
    filters: filtersType
}

const DefaultState: DepartmentState = {
    departments: [] as DepartmentType[],
    loading: false,
    total: 0,
    totalPages: 1,
    filters: {} as filtersType
}

const reducer = (state = DefaultState, action: any) => {
    switch (action.type) {
        case "SET_DEPARTMENTS":
            return {
                ...state,
                departments: action.payload.data,
                total: action.payload.headers['X-WP-Total'],
                totalPages: action.payload.headers['X-WP-TotalPages'],
                loading: false,
            }
        case "GET_DEPARTMENTS":
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
        case "UPDATE_DEPARTMENT":
            // Check if the department is new or not. If new then add it to the top of the list
            if (action.create) {
                return {
                    ...state,
                    departments: [action.payload, ...state.departments],
                    loading: false,
                }
            } else {
                return {
                    ...state,
                    departments: state.departments.map((department: DepartmentType) => {
                        if (department.id === action.payload.id) {
                            return action.payload;
                        }
                        return department;
                    }),
                    loading: false,
                }
            }
        default:
            return state;
    }
}

export default reducer;
