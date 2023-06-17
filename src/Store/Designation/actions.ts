import {argsType, DesignationType} from "../../Types/DesignationType";

const actions = {
    setDesignation: (designation: string) => ({
        type: 'SET_DESIGNATION',
        payload: designation,
    }),

    setDesignations: (designations: DesignationType[]) => ({
        type: 'SET_DESIGNATIONS',
        payload: designations,
    }),

    getDesignations: () => ({
        type: 'GET_DESIGNATIONS',
    }),

    fetchFromAPI(path: string, args?: argsType) {
        return {
            type: 'FETCH_FROM_API',
            path,
            args,
        };
    },
}

export default actions