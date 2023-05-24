import apiFetch, {APIFetchOptions} from '@wordpress/api-fetch';
import {useEffect, useState} from '@wordpress/element';


const apiFetchUnparsed = async <Model>(
    path: string,
    options?: APIFetchOptions,
    data?: any
): Promise<Model> => {
    const requestOptions: APIFetchOptions = {path, parse: false, ...options};
    if (data) {
        requestOptions.body = JSON.stringify(data);
    }

    // @ts-ignore
    return apiFetch(requestOptions).then((response: Response) => {
        return Promise.all([response.headers, response.json()]).then(([headers, jsonData]) => {
            return {headers, data: jsonData};
        });
    });
};
const useFetchApi = <Model extends object>(url: string, initialFilters?: object, run = true): {
    models: Model[];
    filterObject: object;
    setFilterObject: <FilterType>(newFilterObj: FilterType) => void;
    loading: boolean;
    makePostRequest: <DataType>(requestUrl: string, data: DataType, run?: boolean) => Promise<Model>;
    makePutRequest: <DataType>(requestUrl: string, data: DataType, run?: boolean) => Promise<Model>;
    makeGetRequest: (requestUrl?: string, run?: boolean) => Promise<Model>;
    makeDeleteRequest: (requestUrl: string, run?: boolean) => Promise<Model>;
} => {
    const [loading, setLoading] = useState<boolean>(true);
    const [models, setModels] = useState<Model[]>([]);
    const [filterObject, setFilter] = useState<object>(initialFilters || {});

    const setFilterObject = <FilterType>(newFilterObj: FilterType): void => {
        setFilter((prevFilter) => ({...prevFilter, ...newFilterObj}));
    }

    const makeRequest = async (requestUrl: string, requestMethod: string = 'GET', run: boolean = true, requestData?: any): Promise<Model> => {
        setLoading(true);
        const requestOptions: APIFetchOptions = {method: requestMethod, headers: {'Content-Type': 'application/json'},};

        if (requestData) {
            requestOptions.body = JSON.stringify(requestData);
        }

        return apiFetchUnparsed(requestUrl, requestOptions).then((response: any) => {
            if (response.data) {
                setModels(response.data);
            }
            setLoading(false);

            return response.data;
        });
    }

    const makeGetRequest = async (requestUrl?: string, run = true): Promise<Model> => {
        return makeRequest(requestUrl || url, 'GET', run);
    };
    const makePostRequest = async (requestUrl: string, data: any, run = true): Promise<Model> => {
        return makeRequest(requestUrl || url, 'POST', run, data);
    }
    const makePutRequest = async (requestUrl: string, data: any, run = true): Promise<Model> => {
        return makeRequest(requestUrl || url, 'PUT', run, data);
    }
    const makeDeleteRequest = async (requestUrl: string, run = true): Promise<Model> => {
        return makeRequest(requestUrl || url, 'DELETE', run);
    }


    useEffect(() => {
        if (!run) return;

        setLoading(true);
        const queryParam = new URLSearchParams(filterObject as URLSearchParams).toString();
        const path = url + '?' + queryParam;
        apiFetchUnparsed(path, initialFilters).then((response: any) => {
            if (response.data.status === 200 && response.data) {
                setModels(response.data.data);
            }
            setLoading(false);
        });
    }, [filterObject, run]);

    return {
        models,
        loading,
        filterObject,
        setFilterObject,
        makeGetRequest,
        makePostRequest,
        makePutRequest,
        makeDeleteRequest
    }
};

export default useFetchApi;
