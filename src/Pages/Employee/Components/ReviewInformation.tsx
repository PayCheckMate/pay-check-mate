import {EmployeeType} from "../../../Types/EmployeeType";
import {__} from "@wordpress/i18n";
import {SalaryHeadType, SelectBoxType} from "../../../Types/SalaryHeadType";
import {Button} from "../../../Components/Button";
import {useState} from "react";
import useFetchApi from "../../../Helpers/useFetchApi";
import {useEffect} from "@wordpress/element";
import {DesignationType} from "../../../Types/DesignationType";
import {DepartmentType} from "../../../Types/DepartmentType";

export type SalaryInformationType = {
    [key: string]: number;
}
export const ReviewInformation = ({personalInformation, salaryInformation, setError}: { personalInformation: EmployeeType, salaryInformation: SalaryInformationType, setError: any }) => {
    const [employeeDesignation, setEmployeeDesignation] = useState<DesignationType>({} as DesignationType);
    const [employeeDepartment, setEmployeeDepartment] = useState<DepartmentType>({} as DepartmentType);
    const {models, makeGetRequest} = useFetchApi<DesignationType>('/pay-check-mate/v1/designations', {'per_page': '-1'}, true);
    useEffect(() => {
        if (models){
            setEmployeeDesignation(models.find((item: DesignationType) => item.id === personalInformation.designation_id) as DesignationType);
        }

    }, [models]);

    useEffect(() => {
        if (personalInformation.department_id === null) {
            return;
        }
        makeGetRequest('/pay-check-mate/v1/departments', {'per_page': '-1'}, false).then((data: any) => {
            if (data) {
                setEmployeeDepartment(data.data.find((item: DepartmentType) => item.id === personalInformation.department_id) as DepartmentType);
            }
        }).catch((e: unknown) => {
            console.log(e, 'error');
        })
    }, []);

    let salaryHeads = localStorage.getItem('Employee.SalaryHeads');
    let employeeSalaryHeads = [] as SalaryHeadType[];
    if (salaryHeads != null) {
        employeeSalaryHeads = JSON.parse(salaryHeads) as SalaryHeadType[];
        employeeSalaryHeads.forEach((head: SalaryHeadType) => {
            if (salaryInformation.hasOwnProperty(head.id)) {
                salaryInformation = {
                    ...salaryInformation,
                    [head.head_name]: salaryInformation[head.id],
                };
                delete salaryInformation[head.id];
            }
        });
    }

    return (
        <div className="overflow-hidden bg-white sm:rounded-lg">
            <div className="px-4 py-6 sm:px-6">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                    {__('Review Information', 'pcm')}
                </h2>
            </div>
            <div className="border-t border-gray-100">
                <dl className="divide-y divide-gray-100">
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                            {__('Employee ID', 'pcm')}
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {!personalInformation.employee_id ? (
                                <>
                                    {setError(true)}
                                    <span className="text-red-500">{__('Employee ID cannot be empty.', 'pcm')}</span>
                                </>
                            ) : (
                                <>
                                    {setError(false)}
                                    {personalInformation.employee_id}
                                </>
                            )}

                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                            {__('First name', 'pcm')}
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {!personalInformation.first_name ? (
                                <>
                                    {setError(true)}
                                    <span className="text-red-500">{__('First name cannot be empty.', 'pcm')}</span>
                                </>
                            ) : (
                                <>
                                    {setError(false)}
                                    {personalInformation.first_name}
                                </>
                            )}
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                            {__('Last name', 'pcm')}
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {!personalInformation.last_name ? (
                                <>
                                    {setError(true)}
                                    <span className="text-red-500">{__('Last name cannot be empty.', 'pcm')}</span>
                                </>
                            ) : (
                                <>
                                    {setError(false)}
                                    {personalInformation.last_name}
                                </>
                            )}
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                            {__('Email address', 'pcm')}
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {!personalInformation.email ? (
                                <>
                                    {setError(true)}
                                    <span className="text-red-500">{__('Email address cannot be empty.', 'pcm')}</span>
                                </>
                            ) : (
                                <>
                                    {setError(false)}
                                    {personalInformation.email}
                                </>
                            )}
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                            {__('Department', 'pcm')}
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {!employeeDepartment || Object.keys(employeeDepartment).length === 0 ? (
                                <>
                                    {setError(true)}
                                    <span className="text-red-500">{__('Department cannot be empty.', 'pcm')}</span>
                                </>
                            ) : (
                                <>
                                    {setError(false)}
                                    {employeeDepartment.name}
                                </>
                            )}
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                            {__('Designation', 'pcm')}
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {!employeeDesignation || Object.keys(employeeDesignation).length === 0 ? (
                                <>
                                    {setError(true)}
                                    <span className="text-red-500">{__('Designation cannot be empty.', 'pcm')}</span>
                                </>
                            ) : (
                                <>
                                    {setError(false)}
                                    {employeeDesignation.name}
                                </>
                            )}
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                            {__('Joining Date', 'pcm')}
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {!personalInformation.joining_date ? (
                                <>
                                    {setError(true)}
                                    <span className="text-red-500">{__('Joining date cannot be empty.', 'pcm')}</span>
                                </>
                            ) : (
                                <>
                                    {setError(false)}
                                    {personalInformation.joining_date}
                                </>
                            )}
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                            {__('Address', 'pcm')}
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{personalInformation.address}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                            {__('Salary Information', 'pcm')}
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {salaryInformation && Object.keys(salaryInformation).map((key, index) => {
                                if (key === 'remarks'){
                                    return ;
                                }
                                return (
                                    <div key={`info${index}`}>
                                        <span className="font-bold text-gray-900" key={index}>{key.replace(/_/g, ' ').toUpperCase()}:</span>
                                        <span key={`value${index}`} className="ml-4">{salaryInformation[key]}<br /></span>
                                    </div>
                                );
                            })
                            }
                        </dd>
                    </div>
                </dl>
            </div>
        </div>

    );
};
