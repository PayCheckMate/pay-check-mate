import {SalaryHeadType} from "../../Types/SalaryHeadType";
import {filtersType} from "../Store";

const actions = {
    setSalaryHeads: (salaryHeads: SalaryHeadType[]) => ({
        type: 'SET_SALARY_HEADS',
        payload: salaryHeads,
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
    updateSalaryHeadStore: (salary_head: SalaryHeadType, create = false) => ({
        type: 'UPDATE_SALARY_HEAD',
        payload: salary_head,
        create,
    }),
    *getSalaryHeads(filters: filtersType) {
        const path: string = '/pay-check-mate/v1/salary-heads'
        yield actions.setLoading(true);
        const salaryHeads: SalaryHeadType[] = yield actions.fetchFromAPI(path, filters);
        yield actions.setSalaryHeads(salaryHeads);
        yield actions.updateFilters(filters);
        return salaryHeads;
    },
    *updateSalaryHead(salary_head: any) {
        yield actions.setLoading(true);
        const response: SalaryHeadType = yield{
            type: 'UPDATE',
            item: salary_head,
        }

        yield actions.updateSalaryHeadStore(response);

        return response;
    },
    *createSalaryHead(salary_head: any) {
        yield actions.setLoading(true);
        const response: SalaryHeadType = yield{
            type: 'CREATE',
            item: salary_head,
        }

        yield actions.updateSalaryHeadStore(response, true);

        return response;
    }
}

export default actions
