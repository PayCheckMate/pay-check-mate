import {useParams} from "react-router-dom";
import {useEffect, useState} from "@wordpress/element";
import {EmployeeType, SingleEmployeeResponseType} from "../../Types/EmployeeType";
import {toast} from "react-toastify";
import {__} from "@wordpress/i18n";
import useFetchApi from "../../Helpers/useFetchApi";
import {useSelect} from "@wordpress/data";
import salaryHead from "../../Store/SalaryHead";
import {userCan, userIs} from "../../Helpers/User";
import {UserCapNames} from "../../Types/UserType";
import {Card} from "../../Components/Card";
import {PermissionDenied} from "../../Components/404";
import {CurrencyDollarIcon} from "@heroicons/react/24/outline";
import {ChevronDownIcon} from "@heroicons/react/20/solid";
import {SalaryHistoryType, SalaryPurposeType} from "../../Types/SalaryHistoryType";
import {HeadType} from "../../Types/SalaryHeadType";
import {Status} from "../../Components/Status";
import {applyFilters} from "../../Helpers/Hooks";
import {HOC} from "../../Components/HOC";

type EmployeeDetailsProps = {
    employee_id?: number|string,
    page_title?: string
}
export const EmployeeDetails = ({employee_id = '', page_title=''}: EmployeeDetailsProps) => {
    const {makeGetRequest} = useFetchApi('', {}, false);
    let employeeId = useParams().id;
    if (employee_id !== '') {
        employeeId = String(employee_id)
    }
    const [personalInformation, setPersonalInformation] = useState({} as EmployeeType);
    const [salaryInformation, setSalaryInformation] = useState([] as SalaryHistoryType[]);
    const {salaryHeads} = useSelect(select => select(salaryHead).getSalaryHeads({per_page: '-1', page: 1, order_by: 'head_type', order: 'asc', status: '1'}), []);

    useEffect(() => {
        if (employeeId) {
            makeGetRequest<SingleEmployeeResponseType>('/pay-check-mate/v1/employees/' + employeeId + '/salary-details', {order_by: 'active_from', order: 'DESC', per_page: '-1'}, true).then((response) => {
                if (response.status === 200) {
                    const employeeKeysToRemove = Object.keys(localStorage).filter(key => key.startsWith('Employee.'));
                    employeeKeysToRemove.forEach(key => localStorage.removeItem(key));
                    setPersonalInformation(response.data);
                    setSalaryInformation(response.data.salaryInformation as SalaryHistoryType[]);
                } else {
                    toast.error(__('Something went wrong', 'pcm'));
                }
            });
        }
    }, [employeeId])

    const [isOpen, setIsOpen] = useState({} as any);

    const handleToggleCollapse = (id: number) => {
        setIsOpen({
            ...isOpen,
            [id]: !isOpen[id]
        });
    };

    let blue = applyFilters('pcm.blue', 'gray')
    return (
        <>
            {!userCan(UserCapNames.pay_check_mate_view_employee_details) && !userIs('pay_check_mate_employee') ? (
                <Card>
                    <PermissionDenied />
                </Card>
            ) : (
                <HOC role={UserCapNames.pay_check_mate_view_employee_details}>
                    <div className="sm:flex-auto mb-6">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">
                            {
                                page_title !== '' ? page_title : __('Employee Details', 'pcm')
                            }
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
                                                personalInformation.resign_date ?
                                                    new Date(personalInformation.resign_date).toLocaleDateString('en-US', {
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
                                            {<Status status={personalInformation.status} />}
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
                                    {salaryInformation && salaryInformation.map((salary) => {
                                        return (
                                            <li
                                                onClick={() => handleToggleCollapse(salary.id)}
                                                key={salary.id}
                                                className="mb-10 ml-6 cursor-pointer"
                                            >
                                                <span key={'span'+salary.id} className={`absolute flex items-center justify-center w-6 h-6 bg-${blue}-100 rounded-full -left-3 ring-8 ring-white`}>
                                                <CurrencyDollarIcon className={`w-4 h-4 text-${blue}-500`} />
                                                </span>
                                                <h3 key={'h3'+salary.id} className="flex items-center mb-1 text-lg font-semibold text-gray-900">
                                                    {SalaryPurposeType.Initial === parseInt(String(salary.salary_purpose)) &&
                                                        (
                                                            <>
                                                                <span key={'initial_salary'+salary.id} className="ml-2 font-normal text-gray-600">
                                                                    {__('Initial salary', 'pcm')}
                                                                </span>
                                                            </>
                                                        )
                                                    }
                                                    {SalaryPurposeType.Increment === parseInt(String(salary.salary_purpose)) && (
                                                        <>
                                                            <span key={'increment'+salary.id} className="ml-2 font-normal text-gray-600">
                                                                {__('Increment', 'pcm')}
                                                            </span>
                                                      </>
                                                    )}
                                                    {SalaryPurposeType.Promotion === parseInt(String(salary.salary_purpose)) && (
                                                        <>
                                                            <span key={'Promotion'+salary.id} className="ml-2 font-normal text-gray-600">
                                                                {__('Promotion', 'pcm')}
                                                            </span>
                                                      </>
                                                    )}
                                                    <ChevronDownIcon className="w-4 h-4 ml-1 text-gray-500" />
                                                </h3>
                                                <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                                                    {
                                                        __('Active from: ', 'pcm') + new Date(salary.active_from).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })
                                                    }
                                                </time>
                                                {isOpen[salary.id] && (
                                                    <>
                                                        <div className="mt-6 border-b border-gray-100">
                                                            <dl className="flex flex-col sm:flex-row sm:justify-between">
                                                                <dt className="text-sm font-medium leading-6 text-gray-900">
                                                                    {__('Basic Salary', 'pcm')}
                                                                </dt>
                                                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0">
                                                                    + {salary.basic_salary}
                                                                </dd>
                                                            </dl>
                                                        </div>
                                                        {salaryHeads && salaryHeads.map((salaryHead) => {
                                                                return (
                                                                    <div key={'div'+salaryHead.id} className="mt-1 border-b border-gray-100">
                                                                        <dl key={salaryHead.id} className="flex flex-col sm:flex-row sm:justify-between">
                                                                            <dt key={'dt'+salaryHead.id} className="text-sm font-medium leading-6 text-gray-900">
                                                                                {salaryHead.head_name}
                                                                            </dt>
                                                                            <dd key={'dd'+salaryHead.id} className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0">
                                                                                {parseInt(String(salaryHead.head_type)) === HeadType.Earning ? '+' : '-'} {salary.salary_details[salaryHead.id]}
                                                                            </dd>
                                                                        </dl>
                                                                    </div>
                                                                )
                                                            }
                                                        )}
                                                        <div className="mt-4 border-b border-gray-100">
                                                            <dl className="flex flex-col sm:flex-row sm:justify-between">
                                                                <dt className="text-sm font-medium leading-6 text-gray-900">
                                                                    {__('Gross Salary', 'pcm')}
                                                                </dt>
                                                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0">
                                                                    {salary.gross_salary}
                                                                </dd>
                                                            </dl>
                                                        </div>
                                                        {/*Remarks*/}
                                                        <div className="mt-6">
                                                            <h3 className="text-base font-semibold leading-7 text-gray-900">
                                                                {__('Remarks', 'pcm')}
                                                            </h3>
                                                            <p dangerouslySetInnerHTML={{__html: salary.remarks}} />
                                                        </div>
                                                    </>
                                                )}
                                            </li>
                                        )
                                    })}
                                </ol>
                            </div>
                        </Card>
                    </div>
                </HOC>
            )}
        </>
    )
}
