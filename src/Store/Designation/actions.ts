import {DesignationType} from "../../Types/DesignationType";
import {filtersType} from "../Store";

const actions = {
    setDesignations: (designations: DesignationType[]) => ({
        type: 'SET_DESIGNATIONS',
        payload: designations,
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
    updateDesignationStore: (designation: DesignationType, create = false) => ({
        type: 'UPDATE_DESIGNATION',
        payload: designation,
        create,
    }),
    * getDesignations(filters: filtersType) {
        const path: string = '/pay-check-mate/v1/designations'
        yield actions.setLoading(true);
        const designations: DesignationType[] = yield actions.fetchFromAPI(path, filters);
        yield actions.setDesignations(designations);
        yield actions.updateFilters(filters);
        return designations;
    },
    * updateDesignation(designation: any) {
        yield actions.setLoading(true);
        const response: DesignationType = yield{
            type: 'UPDATE',
            item: designation,
        }

        // @ts-ignore
        if (!response.status || response.status !== 201) {
            yield actions.setLoading(false);
            return response;
        }

        // @ts-ignore
        yield actions.updateDesignationStore(response.data);

        return response;
    },
    *createDesignation(designation: any) {
        yield actions.setLoading(true);
        const response: DesignationType = yield{
            type: 'CREATE',
            item: designation,
        }

        // @ts-ignore
        if (!response.status || response.status !== 201) {
            yield actions.setLoading(false);
            return response;
        }

        // @ts-ignore
        yield actions.updateDesignationStore(response.data, true);

        return response;
    }
}

export default actions
