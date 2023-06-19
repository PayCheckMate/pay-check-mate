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
    fetchFromAPI(path: string, filters?: filtersType) {
        return {
            type: 'FETCH_FROM_API',
            path,
            filters,
        };
    },
    *getDesignations(filters: filtersType) {
        const path: string = '/pay-check-mate/v1/designations'
        yield actions.setLoading(true);
        const designations: DesignationType[] = yield actions.fetchFromAPI(path, filters);
        yield actions.setDesignations(designations);

        return designations;
    }
}

export default actions