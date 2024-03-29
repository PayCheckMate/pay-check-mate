import apiFetch, {APIFetchOptions} from '@wordpress/api-fetch';
import {useEffect, useState} from '@wordpress/element';


export const apiFetchUnparsed = async <Model>(path: string, options?: APIFetchOptions, data?: any): Promise<Model> => {
    // Add headers to the options
    if (!options?.headers) {
        options = {
            ...options, headers: {
                'Content-Type': 'application/json',
            }
        };
    }

    if (!options?.parse) {
        options = {...options, parse: false};
    }

    const requestOptions: APIFetchOptions = {path, ...options};
    if (data) {
        requestOptions.body = JSON.stringify(data);
    }

    // @ts-ignore
    return apiFetch(requestOptions).then((response: Response) => {
        let data: any = response;
        if(response.ok){
            data = response.json();
        }
        return Promise.all([data]).then(([jsonData]) => {
            return {data: jsonData};
        });
    }).catch((error) => {
        return {data: error};
    })
};
const useFetchApi = <Model extends object>(url: string, initialFilters?: object, run = true): {
    models: Model[];
    total: number;
    totalPages: number;
    filterObject: object;
    setFilterObject: <FilterType>(newFilterObj: FilterType) => void;
    loading: boolean;
    makePostRequest: <DataType>(requestUrl: string, data: object, run?: boolean) => Promise<DataType>;
    makePutRequest: <DataType>(requestUrl: string, data: object, run?: boolean) => Promise<DataType>;
    makeGetRequest: <DataType>(requestUrl?: string, data?: object, run?: boolean) => Promise<DataType>;
    makeDeleteRequest: <DataType>(requestUrl: string, run?: boolean) => Promise<DataType>;
} => {
    const [loading, setLoading] = useState<boolean>(false);
    const [models, setModels] = useState<Model[]>([]);
    const [filterObject, setFilter] = useState<object>(initialFilters || {});
    const [total, setTotal] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    const setFilterObject = <FilterType>(newFilterObj: FilterType): void => {
        setFilter((prevFilter) => ({...prevFilter, ...newFilterObj}));
    }

    const makeRequest = async <DataType>(requestUrl: string, requestMethod: string = 'GET', run: boolean = true, requestData?: any): Promise<DataType> => {
        setLoading(true);
        const requestOptions: APIFetchOptions = {method: requestMethod, headers: {'Content-Type': 'application/json'},};

        if (requestData) {
            requestOptions.body = JSON.stringify(requestData);
        }

        return apiFetchUnparsed(requestUrl, requestOptions).then((response: any) => {
            setLoading(false);

            return response.data;
            // if (response.data.data) {
            //     return response.data.data;
            // }else if (response.data) {
            //     return response.data;
            // }else {
            //     return response;
            // }
        });
    }
    const makeGetRequest = async <DataType>(requestUrl?: string, data?: any, run = true): Promise<DataType> => {
        if (data) {
            const queryParams = new URLSearchParams(data).toString();
            requestUrl += `?${queryParams}`;
        }
        return makeRequest(requestUrl || url, 'GET', run);
    };

    const makePostRequest = async <DataType>(requestUrl: string, data: object, run = true): Promise<DataType> => {
        return makeRequest(requestUrl || url, 'POST', run, data);
    }
    const makePutRequest = async <DataType>(requestUrl: string, data: object, run = true): Promise<DataType> => {
        return makeRequest(requestUrl || url, 'PUT', run, data);
    }
    const makeDeleteRequest = async <DataType>(requestUrl: string, run = true): Promise<DataType> => {
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
                setTotal(response.data.headers['X-WP-Total']);
                setTotalPages(response.data.headers['X-WP-TotalPages']);
            }

            setLoading(false);
        });
    }, [filterObject, run]);

    return {
        models,
        total,
        totalPages,
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
