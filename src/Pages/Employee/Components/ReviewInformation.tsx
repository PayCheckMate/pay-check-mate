import {EmployeeType} from "../../../Types/EmployeeType";
import {__} from "@wordpress/i18n";
import {SalaryHeadType, SelectBoxType} from "../../../Types/SalaryHeadType";
import {Button} from "../../../Components/Button";
import {useState} from "react";
import useFetchApi from "../../../Helpers/useFetchApi";
import {useEffect} from "@wordpress/element";
import {DesignationType} from "../../../Types/DesignationType";
import {DepartmentType} from "../../../Types/DepartmentType";
import {useSelect} from "@wordpress/data";
import department from "../../../Store/Department";
import designation from "../../../Store/Designation";
import salaryHead from "../../../Store/SalaryHead";

export type SalaryInformationType = {
    [key: string]: number;
}
export const ReviewInformation = ({personalInformation, salaryInformation, setError}: { personalInformation: EmployeeType, salaryInformation: SalaryInformationType, setError: any }) => {
    const {departments} = useSelect((select) => select(department).getDepartments({per_page: '-1', status: '1'}), []);
    const {designations} = useSelect((select) => select(designation).getDesignations({per_page: '-1', status: '1'}), []);
    const {salaryHeads} = useSelect((select) => select(salaryHead).getSalaryHeads({per_page: '-1', status: '1', order_by: 'head_type', order: 'ASC'}), []);

    const [employeeDesignation, setEmployeeDesignation] = useState<DesignationType>({} as DesignationType);
    const [employeeDepartment, setEmployeeDepartment] = useState<DepartmentType>({} as DepartmentType);

    useEffect(() => {
        setEmployeeDesignation(designations.find((item: DesignationType) => item.id === personalInformation.designation_id) as DesignationType);
        setEmployeeDepartment(departments.find((item: DepartmentType) => item.id === personalInformation.department_id) as DepartmentType);
    }, []);

    if (salaryHeads != null) {
        salaryHeads.forEach((head: SalaryHeadType) => {
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
                    {__('Review Information', 'pay_check_mate')}
                </h2>
            </div>
            <div className="border-t border-gray-100">
                <dl className="divide-y divide-gray-100">
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                            {__('Employee ID', 'pay_check_mate')}
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {!personalInformation.employee_id ? (
                                <>
                                    {setError(true)}
                                    <span className="text-red-500">{__('Employee ID cannot be empty.', 'pay_check_mate')}</span>
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
                            {__('First name', 'pay_check_mate')}
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {!personalInformation.first_name ? (
                                <>
                                    {setError(true)}
                                    <span className="text-red-500">{__('First name cannot be empty.', 'pay_check_mate')}</span>
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
                            {__('Last name', 'pay_check_mate')}
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {!personalInformation.last_name ? (
                                <>
                                    {setError(true)}
                                    <span className="text-red-500">{__('Last name cannot be empty.', 'pay_check_mate')}</span>
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
                            {__('Email address', 'pay_check_mate')}
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {!personalInformation.email ? (
                                <>
                                    {setError(true)}
                                    <span className="text-red-500">{__('Email address cannot be empty.', 'pay_check_mate')}</span>
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
                            {__('Department', 'pay_check_mate')}
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {!employeeDepartment || Object.keys(employeeDepartment).length === 0 ? (
                                <>
                                    {setError(true)}
                                    <span className="text-red-500">{__('Department cannot be empty.', 'pay_check_mate')}</span>
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
                            {__('Designation', 'pay_check_mate')}
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {!employeeDesignation || Object.keys(employeeDesignation).length === 0 ? (
                                <>
                                    {setError(true)}
                                    <span className="text-red-500">{__('Designation cannot be empty.', 'pay_check_mate')}</span>
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
                            {__('Joining Date', 'pay_check_mate')}
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {!personalInformation.joining_date ? (
                                <>
                                    {setError(true)}
                                    <span className="text-red-500">{__('Joining date cannot be empty.', 'pay_check_mate')}</span>
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
                            {__('Address', 'pay_check_mate')}
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{personalInformation.address}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                            {__('Salary Active From', 'pay_check_mate')}
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {(salaryInformation.active_from !== undefined && salaryInformation.active_from !== null)? new Date(salaryInformation.active_from).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            }) :
                                (
                                    <>
                                    {setError(true)}
                                        <span className="text-red-500">{__('Salary active from cannot be empty.', 'pay_check_mate')}</span>
                                    </>
                                )}
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                            {__('Salary Information', 'pay_check_mate')}
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {salaryInformation && Object.keys(salaryInformation).map((key, index) => {
                                if (key === 'remarks' || key === 'active_from' || key === 'salary_history_id') {
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
