import {Button} from "../../Components/Button";
import {CheckCircleIcon} from "@heroicons/react/24/outline";
import {Table} from "../../Components/Table";
import {__} from "@wordpress/i18n";
import {useEffect, useState} from "@wordpress/element";
import {Modal} from "../../Components/Modal";
import useFetchApi from "../../Helpers/useFetchApi";
import {EmployeeStatus, EmployeeType} from "../../Types/EmployeeType";
import {filtersType} from "../../Store/Store";
import {Link} from "react-router-dom";
import {userCan} from "../../Helpers/User";
import {UserCapNames} from "../../Types/UserType";
import {applyFilters} from "../../Helpers/Hooks";
import {SalaryInformation} from "./Components/SalaryInformation";
import {Status} from "../../Components/Status";

export const EmployeeList = () => {
    const [showViewModal, setShowViewModal] = useState(false);
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

    const [pageTitle, setPageTitle] = useState(__('Employee List', 'pcm'));

    const viewEmployee = (id: number) => {
        setShowViewModal(true);
    }

    const columns = [
        {
            title: 'Employee ID',
            dataIndex: 'employee_id',
            sortable: true,
        },
        {
            title: __('Joining Date', 'pcm'), dataIndex: 'joining_date', sortable: true,
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
            title: __('Name', 'pcm'),
            dataIndex: 'first_name',
            sortable: true,
            render: (text: string, record: any) => {
                let anchorClass = applyFilters('pcm.anchor_class', 'anchor-link-gray')
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
        {title: __('Email', 'pcm'), dataIndex: 'email'},
        {
            title: __('Designation', 'pcm'), dataIndex: 'designation_id', sortable: true,
            render: (text: string, record: any) => {
                return (
                    <span>{record.designation_name}</span>
                )
            }
        },
        {
            title: __('Department', 'pcm'), dataIndex: 'department_id', sortable: true,
            render: (text: string, record: any) => {
                return (
                    <span>{record.department_name}</span>
                )
            }
        },
        {
            title: __('Status', 'pcm'), dataIndex: 'status', sortable: true,
            render: (text: string, record: any) => {
                return(<Status status={record.status} />)
            }
        },
        {
            title: __('Action', 'pcm'),
            dataIndex: 'action',
            render: (text: string, record: any) => {
                return (
                    <div className="flex">
                        {applyFilters('pcm.employee_list_action', null, record)}
                        {userCan(UserCapNames.pay_check_mate_edit_employee) && (
                            <>
                                <span className="mx-2 text-gray-300">|</span>
                                <Link
                                    to={`/employee/edit/${record.employee_id}`}
                                    className="text-indigo-600 hover:text-indigo-900"
                                >
                                    {__('Edit', 'pcm')}
                                </Link>
                            </>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <>
            {/*{showViewModal &&*/}
            {/*    <>*/}
            {/*        <Modal*/}
            {/*            setShowModal={setShowViewModal}*/}
            {/*            header={pageTitle}*/}
            {/*            width={' sm:max-w-3xl'}*/}
            {/*            zIndex={'9999'}*/}
            {/*        >*/}
            {/*            {applyFilters('pcm.employee_view_modal', null, setShowViewModal)}*/}
            {/*        </Modal>*/}
            {/*    </>*/}
            {/*}*/}
            <div>
                <div className="sm:flex sm:items-center mb-6">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">
                            {__('Employee List', 'pcm')}
                        </h1>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        {userCan(UserCapNames.pay_check_mate_add_employee) && (
                            <>
                                <Button
                                    className="hover:text-white"
                                    path="/add-employee"
                                >
                                    <CheckCircleIcon
                                        className="w-5 h-5 mr-2 -ml-1 text-white"
                                        aria-hidden="true"
                                    />
                                    {__('Add Employee', 'pcm')}
                                </Button>
                            </>
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
        </>
    )
}
