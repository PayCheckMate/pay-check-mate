import {EmployeeType} from "../../../Types/EmployeeType";
import {__} from "@wordpress/i18n";
import {SelectBoxType} from "../../../Types/SalaryHeadType";

export type SalaryInformationType = {
    [key: string]: number;
}
export const ReviewInformation = ({personalInformation, salaryInformation}: { personalInformation: EmployeeType, salaryInformation: SalaryInformationType }) => {
    let designation = localStorage.getItem('Employee.designation');
    let employeeDesignation = {} as SelectBoxType;
    if (designation != null) {
        employeeDesignation = JSON.parse(designation) as SelectBoxType;
    }
    let department = localStorage.getItem('Employee.department');
    let employeeDepartment = {} as SelectBoxType;
    if (department != null) {
        employeeDepartment = JSON.parse(department) as SelectBoxType;
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
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{personalInformation.employee_id}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                            {__('First name', 'pcm')}
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{personalInformation.first_name}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                            {__('Last name', 'pcm')}
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{personalInformation.last_name}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                            {__('Email address', 'pcm')}
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{personalInformation.email}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                            {__('Department', 'pcm')}
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{employeeDepartment.name}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                            {__('Designation', 'pcm')}
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{employeeDesignation.name}</dd>
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
                                return (
                                    <span key={index}>{key}: {salaryInformation[key]}<br /></span>
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