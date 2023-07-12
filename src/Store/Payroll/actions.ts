import {PayrollType} from "../../Types/PayrollType";
import {filtersType} from "../Store";

const actions = {
    setPayrolls: (salaryHeads: PayrollType[]) => ({
        type: 'SET_PAYROLLS',
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
    updatePayrollStore: (payroll: PayrollType, create = false) => ({
        type: 'UPDATE_PAYROLL',
        payload: payroll,
        create,
    }),
    *getPayrolls(filters: filtersType) {
        const path: string = '/pay-check-mate/v1/payrolls'
        yield actions.setLoading(true);
        const salaryHeads: PayrollType[] = yield actions.fetchFromAPI(path, filters);
        yield actions.setPayrolls(salaryHeads);
        yield actions.updateFilters(filters);
        return salaryHeads;
    },
    *updatePayroll(payroll: any) {
        yield actions.setLoading(true);
        const response: PayrollType = yield{
            type: 'UPDATE',
            item: payroll,
        }

        // @ts-ignore
        if (!response.status || response.status !== 201) {
            yield actions.setLoading(false);
            return response;
        }

        // @ts-ignore
        yield actions.updatePayrollStore(response.data);

        return response;
    },
    *createPayroll(payroll: any) {
        yield actions.setLoading(true);
        const response: PayrollType = yield{
            type: 'CREATE',
            item: payroll,
        }

        // @ts-ignore
        if (!response.status || response.status !== 201) {
            yield actions.setLoading(false);
            return response;
        }

        // @ts-ignore
        yield actions.updatePayrollStore(response.data, true);

        return response;
    }
}

export default actions
