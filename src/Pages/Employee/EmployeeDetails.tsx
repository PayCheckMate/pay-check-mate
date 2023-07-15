import {useParams} from "react-router-dom";
import {useEffect, useState} from "@wordpress/element";
import {EmployeeType, SingleEmployeeResponseType} from "../../Types/EmployeeType";
import {SalaryInformationType} from "./Components/ReviewInformation";
import {toast} from "react-toastify";
import {__} from "@wordpress/i18n";
import useFetchApi from "../../Helpers/useFetchApi";
import {useSelect} from "@wordpress/data";
import salaryHead from "../../Store/SalaryHead";
import {userCan} from "../../Helpers/User";
import {UserCapNames} from "../../Types/UserType";
import {Card} from "../../Components/Card";
import {PermissionDenied} from "../../Components/404";
import {CurrencyDollarIcon} from "@heroicons/react/24/outline";
import {ChevronDownIcon} from "@heroicons/react/20/solid";

export const EmployeeDetails = () => {
    const {makeGetRequest} = useFetchApi('', {}, false);
    const employeeId = useParams().id;
    const [personalInformation, setPersonalInformation] = useState({} as EmployeeType);
    const [salaryInformation, setSalaryInformation] = useState({} as SalaryInformationType);
    const {salaryHeads} = useSelect(select => select(salaryHead).getSalaryHeads(), []);

    useEffect(() => {
        if (employeeId) {
            makeGetRequest<SingleEmployeeResponseType>('/pay-check-mate/v1/employees/' + employeeId, {}, true).then((response) => {
                if (response.status === 200) {
                    const employeeKeysToRemove = Object.keys(localStorage).filter(key => key.startsWith('Employee.'));
                    employeeKeysToRemove.forEach(key => localStorage.removeItem(key));
                    const salaryInformation = {
                        ...response.data.salaryInformation,
                        // @ts-ignore
                        ...JSON.parse(response.data.salaryInformation.salary_details),
                    };
                    delete salaryInformation.salary_details;
                    delete response.data.salaryInformation;
                    setPersonalInformation(response.data);
                    setSalaryInformation(salaryInformation as SalaryInformationType);
                } else {
                    toast.error(__('Something went wrong', 'pcm'));
                }
            });
        }
    }, [employeeId])

    const [isOpen, setIsOpen] = useState({} as any);

    const handleToggleCollapse = (id: number) => {
        setIsOpen({
            [id]: !isOpen[id]
        });
    };
    console.log(isOpen)
    return (
        <>
            {!userCan(UserCapNames.pay_check_mate_view_employee_details) ? (
                <Card>
                    <PermissionDenied />
                </Card>
            ) : (
                <div>
                    <div className="sm:flex-auto mb-6">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">
                            {__('Employee Details', 'pcm')}
                        </h1>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="text-base">
                            <Card>
                                <div>
                                  <div className="px-4 sm:px-0">
                                    <h3 className="text-base font-semibold leading-7 text-gray-900">
                                        {__('Personal Information', 'pcm')}
                                    </h3>
                                  </div>
                                  <div className="mt-6 border-t border-gray-100">
                                    <dl className="divide-y divide-gray-100">
                                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-gray-900">
                                            {__('First name', 'pcm')}
                                        </dt>
                                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                            {personalInformation.first_name}
                                        </dd>
                                      </div>
                                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-gray-900">
                                            {__('Last name', 'pcm')}
                                        </dt>
                                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                            {personalInformation.last_name}
                                        </dd>
                                      </div>
                                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-gray-900">
                                            {__('Email address', 'pcm')}
                                        </dt>
                                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                            {personalInformation.email}
                                        </dd>
                                      </div>
                                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-gray-900">
                                            {__('Phone number', 'pcm')}
                                        </dt>
                                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                            {personalInformation.phone}
                                        </dd>
                                      </div>
                                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-gray-900">
                                            {__('Address', 'pcm')}
                                        </dt>
                                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                            {personalInformation.address}
                                        </dd>
                                      </div>
                                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-gray-900">
                                            {__('Joining Date', 'pcm')}
                                        </dt>
                                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                            {
                                                new Date(personalInformation.joining_date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })
                                            }
                                        </dd>
                                      </div>
                                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-gray-900">
                                            {__('Resignation Date', 'pcm')}
                                        </dt>
                                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                            {
                                                personalInformation.regine_date ?
                                                    new Date(personalInformation.regine_date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    }) : '-'
                                            }
                                        </dd>
                                      </div>
                                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-gray-900">
                                            {__('Status', 'pcm')}
                                        </dt>
                                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                            {
                                                parseInt(String(personalInformation.status)) === 1 ? (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold text-green-800 bg-gradient-to-r from-green-100/10 to-green-200">
                                                        {__('Active', 'pcm')}
                                                    </span>
                                                ) : (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold text-red-800 bg-gradient-to-r from-red-100/10 to-red-200">
                                                        {__('Inactive', 'pcm')}
                                                    </span>
                                                )
                                            }
                                        </dd>
                                      </div>
                                    </dl>
                                  </div>
                                </div>
                            </Card>
                        </div>
                        <Card>
                            <div>
                                <div className="px-4 sm:px-0">
                                    <h3 className="text-base font-semibold leading-7 text-gray-900">
                                        {__('Salary History', 'pcm')}
                                    </h3>
                                </div>
                                <ol className="relative border-l border-gray-300 mt-10">
                                    {salaryHeads && salaryHeads.map((salaryHead) => {
                                        return (
                                            <li onClick={()=>handleToggleCollapse(salaryHead.id)} key={salaryHead.id} className="mb-10 ml-6 cursor-pointer">
                                              <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                                                <CurrencyDollarIcon className="w-4 h-4 text-blue-500" />
                                              </span>
                                              <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
                                                  Title
                                                  {/*View Details*/}
                                                    <ChevronDownIcon className="w-4 h-4 ml-1 text-gray-500" />
                                              </h3>
                                              <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                                                Active from 06 Jan 2021
                                              </time>
                                                {isOpen[salaryHead.id] && (
                                                    <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                                                  Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order E-commerce & Marketing pages.
                                                </p>
                                                )}
                                            </li>
                                        )
                                    })}
                                </ol>
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </>
    )
}
