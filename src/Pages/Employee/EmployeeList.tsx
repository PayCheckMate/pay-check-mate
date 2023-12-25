import {Button} from "../../Components/Button";
import {CheckCircleIcon, DocumentTextIcon, PlusIcon} from "@heroicons/react/24/outline";
import {Table} from "../../Components/Table";
import {__} from "@wordpress/i18n";
import {useEffect, useState} from "@wordpress/element";
import useFetchApi from "../../Helpers/useFetchApi";
import {EmployeeType} from "../../Types/EmployeeType";
import {filtersType} from "../../Store/Store";
import {Link} from "react-router-dom";
import {userCan} from "../../Helpers/User";
import {UserCapNames} from "../../Types/UserType";
import {applyFilters} from "../../Helpers/Hooks";
import {Status} from "../../Components/Status";
import {HOC} from "../../Components/HOC";

export const EmployeeList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const per_page = 10;
    const {
        loading,
        models,
        totalPages,
        setFilterObject,
        filterObject,
        total
    } = useFetchApi<EmployeeType>('/pay-check-mate/v1/employees', {page: 1, per_page}, true);
    const [employees, setEmployees] = useState([] as EmployeeType[]);
    useEffect(() => {
        if (models) {
            setEmployees(models);
        }
    }, [models, filterObject])

    const handleFilterChange = (filterObject: filtersType) => {
        setFilterObject(filterObject);
        setCurrentPage(filterObject.page || 1);
    };

    let anchorClass = applyFilters('pay_check_mate.anchor_class', 'anchor-link-gray')
    const columns = [
        {
            title: 'Employee ID',
            dataIndex: 'employee_id',
            sortable: true,
        },
        {
            title: __('Joining Date', 'pay-check-mate'), dataIndex: 'joining_date', sortable: true,
            render: (text: string, record: any) => {
                return (
                    <span>
                        {new Date(text).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </span>
                )
            }
        },
        {
            title: __('Name', 'pay-check-mate'),
            dataIndex: 'first_name',
            sortable: true,
            render: (text: string, record: any) => {
                if (userCan(UserCapNames.pay_check_mate_view_employee_details)) {
                    return (
                        <Link
                            to={`/employee/${record.employee_id}`}
                            className={anchorClass}
                        >
                            {record.first_name + ' ' + record.last_name}
                        </Link>
                    )
                } else {
                    return (
                        <span>{record.first_name + ' ' + record.last_name}</span>
                    )
                }
            }
        },
        {title: __('Email', 'pay-check-mate'), dataIndex: 'email'},
        {
            title: __('Designation', 'pay-check-mate'), dataIndex: 'designation_id', sortable: true,
            render: (text: string, record: any) => {
                return (
                    <span>{record.designation_name}</span>
                )
            }
        },
        {
            title: __('Department', 'pay-check-mate'), dataIndex: 'department_id', sortable: true,
            render: (text: string, record: any) => {
                return (
                    <span>{record.department_name}</span>
                )
            }
        },
        {
            title: __('Status', 'pay-check-mate'), dataIndex: 'status', sortable: true,
            render: (text: string, record: any) => {
                return (<Status
                    status={record.status}
                    textMap={{active: __('Active', 'pay-check-mate'), inactive: __('Resigned', 'pay-check-mate')}}
                />)
            }
        },
        {
            title: __('Action', 'pay-check-mate'),
            dataIndex: 'action',
            render: (text: string, record: any) => {
                if (parseInt(String(record.status)) === 0){
                    return (
                        <div className="flex">
                            <span className="text-gray-300">{__('Resigned', 'pay-check-mate')}</span>
                        </div>
                    )
                }
                return (
                    <div className="flex">
                        {applyFilters('pay_check_mate.employee_list_filter', null, record)}
                        {userCan(UserCapNames.pay_check_mate_edit_employee) && (
                            <>
                                <span className="mx-2 text-gray-300">|</span>
                                <Link
                                    to={`/employee/edit/${record.employee_id}`}
                                    className={anchorClass}
                                >
                                    {__('Edit', 'pay-check-mate')}
                                </Link>
                            </>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <HOC role={UserCapNames.pay_check_mate_view_employee_list}>
            <div>
                <div className="sm:flex sm:items-center mb-6">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">
                            {__('Employee List', 'pay-check-mate')}
                        </h1>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        {userCan(UserCapNames.pay_check_mate_add_employee) && (
                            <div className="flex space-x-3">
                                <Button
                                    className="hover:text-white"
                                    path="/import-employee"
                                >
                                    <DocumentTextIcon
                                        className="w-5 h-5 mr-2 -ml-1 text-white"
                                        aria-hidden="true"
                                    />
                                    {__('Import Employee', 'pay-check-mate')}
                                </Button>
                                <Button
                                    className="hover:text-white"
                                    path="/add-employee"
                                >
                                    <PlusIcon
                                        className="w-5 h-5 mr-2"
                                        aria-hidden="true"
                                    />
                                    {__('Add Employee', 'pay-check-mate')}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
                <Table
                    permissions={UserCapNames.pay_check_mate_view_employee_list}
                    columns={columns}
                    total={total}
                    data={employees}
                    isLoading={loading}
                    totalPage={totalPages}
                    per_page={per_page}
                    filters={filterObject as filtersType}
                    currentPage={currentPage}
                    onFilterChange={handleFilterChange}
                    search={true}
                />
            </div>
        </HOC>
    )
}
