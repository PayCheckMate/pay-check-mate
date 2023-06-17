import {DesignationType} from "../../Types/DesignationType";

const DefaultState = {} as DesignationType;

const reducer = (state = DefaultState, action: any) => {
    switch (action.type) {
        case "SET_DESIGNATIONS":
            return {
                ...state,
                designations: action.payload
            }
       case "GET_DESIGNATIONS":
            return state;
        default:
            return state;
    }
}

export default reducer;