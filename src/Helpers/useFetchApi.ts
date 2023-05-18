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
    makePostRequest: <DataType>(requestUrl: string, data: DataType, run?: boolean) => Promise<Model>;
    makePutRequest: <DataType>(requestUrl: string, data: DataType, run?: boolean) => Promise<Model>;
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

    const makeRequest = async (
        requestUrl: string,
        requestMethod: string = 'GET',
        run: boolean = true,
        requestData?: any
    ): Promise<Model> => {
        setLoading(true);
        const requestOptions: APIFetchOptions = {
            method: requestMethod,
            headers: { 'Content-Type': 'application/json' },
        };

        if (requestData) {
            requestOptions.body = JSON.stringify(requestData);
        }

        return apiFetchUnparsed<UnparsedResponse<Model>>(requestUrl, requestOptions)
            .then((response) => {
                if (response.headers !== undefined) {
                    setTotalPage(parseInt(response.headers.get('X-WP-TotalPages') || '0'));
                    setTotal(parseInt(response.headers.get('X-WP-Total') || '0'));
                }
                if (run) {
                    setModels(Array.isArray(response.data) ? response.data : [response.data]); // Update setModels to handle both single Model values and arrays of Model.
                }

                setLoading(false);
                return response.data;
            })
            .catch((e) => {
                setLoading(false);
                throw e;
            });
    };

    const makePostRequest = async <DataType>(requestUrl: string, data: DataType, run = true): Promise<Model> => {
        return makeRequest(url, 'POST', run, data);
    };

    const makePutRequest = async <DataType>(requestUrl: string, data: DataType, run = true): Promise<Model> => {
        return makeRequest(url, 'PUT', run, data);
    };

    const makeGetRequest = async (requestUrl?: string, run = true): Promise<Model> => {
        return makeRequest(requestUrl || url, 'GET', run);
    };

    const makeDeleteRequest = async (requestUrl: string, run = true): Promise<Model> => {
        return makeRequest(requestUrl, 'DELETE', run);
    };

    useEffect(() => {
        if (!run) return;

        setLoading(true);
        const queryParam = new URLSearchParams(filterObject as URLSearchParams).toString();
        const path = url + '?' + queryParam;
        apiFetchUnparsed<UnparsedResponse<Model>>(path, initialFilters)
            .then((response) => {
                if (response.headers !== undefined) {
                    setTotalPage(parseInt(response.headers.get('X-WP-TotalPages') || '0'));
                    setTotal(parseInt(response.headers.get('X-WP-Total') || '0'));
                }
                setModels(Array.isArray(response.data) ? response.data : [response.data]); // Update setModels to handle both single Model values and arrays of Model
                setLoading(false);
            })
            .catch((e) => {
                setLoading(false);
            });
    }, [filterObject, run]);

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
