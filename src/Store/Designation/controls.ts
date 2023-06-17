import {apiFetchUnparsed} from "../../Helpers/useFetchApi";

const controls = {
    FETCH_FROM_API: ( action: any ) => {
        if (action.args){
            const queryParams = new URLSearchParams(action.args).toString();
            action.path += `?${queryParams}`;
        }
        return apiFetchUnparsed( action.path ).then( ( response: any ) => {
            return response.data;
        });
    }
}

export default controls;