import {DepartmentType} from "../../Types/DepartmentType";
import {filtersType} from "../Store";

const actions = {
    setDepartments: (departments: DepartmentType[]) => ({
        type: 'SET_DEPARTMENTS',
        payload: departments,
    }),
    setLoading: (loading: boolean) => ({
        type: 'SET_LOADING',
        payload: loading,
    }),
    updateFilters: (filters: filtersType) => ({
        type: 'UPDATE_FILTERS',
        payload: filters,
    }),
    fetchFromAPI(path: string, filters?: filtersType) {
        return {
            type: 'FETCH_FROM_API',
            path,
            filters,
        };
    },
    updateDepartmentStore: (department: DepartmentType, create = false) => ({
        type: 'UPDATE_DEPARTMENT',
        payload: department,
        create,
    }),
    * getDepartments(filters: filtersType) {
        const path: string = '/pay-check-mate/v1/departments'
        yield actions.setLoading(true);
        const departments: DepartmentType[] = yield actions.fetchFromAPI(path, filters);
        yield actions.setDepartments(departments);
        yield actions.updateFilters(filters);
        return departments;
    },
    * updateDepartment(department: any) {
        yield actions.setLoading(true);
        const response: DepartmentType = yield{
            type: 'UPDATE',
            item: department,
        }

        // @ts-ignore
        if (!response.status || response.status !== 201) {
            yield actions.setLoading(false);
            return response;
        }

        // @ts-ignore
        yield actions.updateDepartmentStore(response.data);

        return response;
    },
    *createDepartment(department: any) {
        yield actions.setLoading(true);
        const response: DepartmentType = yield{
            type: 'CREATE',
            item: department,
        }

        // @ts-ignore
        if (!response.status || response.status !== 201) {
            yield actions.setLoading(false);
            return response;
        }

        // @ts-ignore
        yield actions.updateDepartmentStore(response.data, true);

        return response;
    }
}

export default actions
