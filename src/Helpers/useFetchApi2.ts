import apiFetch, { APIFetchOptions } from '@wordpress/api-fetch';
import { useEffect, useState } from '@wordpress/element';

interface UnparsedResponse<Model> {
    headers: Headers;
    data: Model;
}

const apiFetchUnparsed = async <Model>(
    path: string,
    options?: APIFetchOptions,
    data?: any
): Promise<Model> => {
    const requestOptions: APIFetchOptions = { path, parse: false, ...options };

    if (data) {
        requestOptions.body = JSON.stringify(data);
    }

    // @ts-ignore
    return apiFetch(requestOptions).then((response: Response) => {
        return Promise.all([response.headers, response.json()]).then(([headers, jsonData]) => {
            return { headers, data: jsonData };
        });
    });
};

const useFetchApi = <Model>(
    url: string,
    initialFilters?: object,
    run = true
): {
    models: Model[];
    loading: boolean;
    total: number;
    totalPage: number;
    setFilterObject: <FilterType>(newFilterObj: FilterType) => void;
    filterObject: object;
    makePostRequest: <DataType>(data: DataType, requestUrl: string, run?: boolean) => Promise<Model>;
    makePutRequest: <DataType>(data: DataType, requestUrl: string, run?: boolean) => Promise<Model>;
    makeGetRequest: (requestUrl?: string, run?: boolean) => Promise<Model>;
    makeDeleteRequest: (requestUrl: string, run?: boolean) => Promise<Model>;
} => {
    const [loading, setLoading] = useState<boolean>(true);
    const [total, setTotal] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [models, setModels] = useState<Model[]>([]);
    const [filterObject, setFilter] = useState<object>(initialFilters || {});

    const setFilterObject = <FilterType>(newFilterObj: FilterType): void => {
        setFilter((prevFilter) => ({ ...prevFilter, ...newFilterObj }));
    };

    const makeRequest = async <DataType>(requestUrl: string, method: string, data?: DataType): Promise<Model> => {
        setLoading(true);
        const requestOptions: APIFetchOptions = {
            method,
            headers: { 'Content-Type': 'application/json' },
        };

        const urlToUse = requestUrl || url;

        return apiFetchUnparsed<UnparsedResponse<Model>>(urlToUse, requestOptions, data)
            .then((response) => {
                if (response.headers !== undefined) {
                    setTotalPage(parseInt(response.headers.get('X-WP-TotalPages') || '0'));
                    setTotal(parseInt(response.headers.get('X-WP-Total') || '0'));
                }
                setModels(Array.isArray(response.data) ? response.data : [response.data]); // Update setModels to handle both single Model values and arrays of Model
                setLoading(false);
                return response.data;
            })
            .catch((e) => {
                setLoading(false);
                throw e;
            });
    };

    const makePostRequest = async <DataType>(data: DataType, requestUrl: string): Promise<Model> => {
        return makeRequest(requestUrl, 'POST', data);
    };

    const makePutRequest = async <DataType>(data: DataType, requestUrl: string): Promise<Model> => {
        return makeRequest(requestUrl, 'PUT', data);
    };

    const makeGetRequest = async (requestUrl?: string): Promise<Model> => {
        setLoading(true);
        const requestOptions: APIFetchOptions = { method: 'GET' };

        const urlToUse = requestUrl || url;

        return apiFetchUnparsed(urlToUse, requestOptions)
    };

    const makeDeleteRequest = async (requestUrl: string): Promise<Model> => {
        return makeRequest(requestUrl, 'DELETE');
    };

    useEffect(() => {
        if (!run) return;

        setLoading(true);
        const queryParam = new URLSearchParams(filterObject as URLSearchParams).toString();
        const path = url + '?' + queryParam;
        apiFetchUnparsed<UnparsedResponse<Model>>(path, initialFilters)
            .then((response) => {
                if (undefined !== response.headers) {
                    setTotalPage(parseInt(response.headers.get('X-WP-TotalPages') || '0'));
                    setTotal(parseInt(response.headers.get('X-WP-Total') || '0'));
                }
                setModels(Array.isArray(response.data) ? response.data : [response.data]); // Update setModels to handle both single Model values and arrays of Model
                setLoading(false);
            })
            .catch((e) => {
                setLoading(false);
            });
    }, [url, filterObject, run]);

    return {
        models,
        loading,
        total,
        totalPage,
        setFilterObject,
        filterObject,
        makePostRequest,
        makePutRequest,
        makeGetRequest,
        makeDeleteRequest,
    };
};

export default useFetchApi;
