import {filtersType, DesignationType} from "../../Types/DesignationType";

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
    updateDesignationStore: (designation: DesignationType) => ({
        type: 'UPDATE_DESIGNATION_STATUS',
        payload: designation,
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

        return actions.updateDesignationStore(response);
    }
}

export default actions