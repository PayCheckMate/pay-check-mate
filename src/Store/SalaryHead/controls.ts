import {apiFetchUnparsed} from "../../Helpers/useFetchApi";

const controls = {
    FETCH_FROM_API: ( action: any ) => {
        if (action.filters){
            const queryParams = new URLSearchParams(action.filters).toString();
            action.path += `?${queryParams}`;
        }
        return apiFetchUnparsed( action.path ).then( ( response: any ) => {
            return response.data;
        });
    },
    CREATE: ( action: any ) => {
        const path = `/pay-check-mate/v1/salary-heads`;
        return apiFetchUnparsed( path, {
            method: 'POST',
            body: JSON.stringify( action.item ),
            parse: true,
        }).then( ( response: any ) => {
            return response.data;
        });
    },
    UPDATE: ( action: any ) => {
        const path = `/pay-check-mate/v1/salary-heads/${action.item.id}`;
        return apiFetchUnparsed( path, {
            method: 'PUT',
            body: JSON.stringify( action.item ),
            parse: true,
        }).then( ( response: any ) => {
            return response.data;
        });
    }
}

export default controls;
