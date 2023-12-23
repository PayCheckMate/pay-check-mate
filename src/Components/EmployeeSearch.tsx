import {FormInput} from "./FormInput";
import {__} from "@wordpress/i18n";
import {useMemo, useState} from "@wordpress/element";
import {debounce} from "lodash";
import {toast} from "react-toastify";
import apiFetch from "@wordpress/api-fetch";

type EmployeeSearchProps = {
    label?: string;
    setOnSearch: (employeeId: string) => void;
}

function EmployeeSearch() {
    const [searchedEmployee, setSearchedEmployee] = useState('');

    const handleSearch = useMemo(() => debounce((e: any) => {
        e.preventDefault();
        if (e.target.value.length > 1 && e.target.value.length < 3) return;
        console.log(e.target.value, 'e.target.value')
        apiFetch({
            path: `/pay-check-mate/v1/employees?search=${searchedEmployee}&per_page=-1`,
            method: 'GET',
        }).then((res: any) => {
            console.log(res, 'res')
        }).catch((err: any) => {
            toast.error(__('Something went wrong', 'pay-check-mate'));
        });
    }, 1000), []);
    return (
        <>
        <FormInput
            type="text"
            className="mt-2"
            label={__('Search Employee', 'pay-check-mate')}
            name="employee_id"
            id="employee_id"
            value={searchedEmployee}
            onChange={(e) => {
                setSearchedEmployee(e.target.value);
                handleSearch(e)
            }}
        />
        </>
    )
}

export default EmployeeSearch;
