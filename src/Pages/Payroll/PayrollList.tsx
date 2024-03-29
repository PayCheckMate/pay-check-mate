import {Button} from "../../Components/Button";
import {CheckCircleIcon, ExclamationTriangleIcon, PencilSquareIcon, PlusIcon, XMarkIcon} from "@heroicons/react/24/outline";
import {__} from "@wordpress/i18n";
import {useDispatch, useSelect} from "@wordpress/data";
import payroll from "../../Store/Payroll";
import {Table} from "../../Components/Table";
import React, {useState} from "@wordpress/element";
import {filtersType} from "../../Store/Store";
import department from "../../Store/Department";
import designation from "../../Store/Designation";
import {PayrollStatus, PayrollType} from "../../Types/PayrollType";
import useNotify from "../../Helpers/useNotify";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import {CheckIcon} from "@heroicons/react/20/solid";
import {UserCapNames} from "../../Types/UserType";
import {userCan} from "../../Helpers/User";
import {applyFilters} from "../../Helpers/Hooks";
import {HOC} from "../../Components/HOC";

export const PayrollList = () => {
    const dispatch = useDispatch();
    const per_page = '10';
    const {payrolls, loading, totalPages, filters, total} = useSelect((select) => select(payroll).getPayrolls({per_page: per_page, page: 1, order_by: 'payroll_date', order: 'DESC'}), []);
    const {departments} = useSelect((select) => select(department).getDepartments({per_page: '-1'}), []);
    const {designations} = useSelect((select) => select(designation).getDesignations({per_page: '-1'}), []);

    const [currentPage, setCurrentPage] = useState(filters.page);
    const handleStatus = (payrollData: PayrollType, status: number) => {
        if (!userCan(UserCapNames.pay_check_mate_approve_payroll)) return;
        if (status === payrollData.status) return;
        // @ts-ignore
        const _wpnonce = payCheckMate.pay_check_mate_nonce;
        const data = {
            ...payrollData,
            status,
            _wpnonce
        }
        dispatch(payroll).updatePayroll(data).then((response: any) => {
            useNotify(response, __('Payroll updated successfully', 'pay-check-mate'), __('Something went wrong while updating payroll', 'pay-check-mate'));
        }).catch((error: any) => {
            console.log(error, 'error')
            toast.error(__('Something went wrong while updating payroll', 'pay-check-mate'), {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000
            });
        })
    }
    const orange = applyFilters('pay_check_mate.orange', 'gray');
    const red = applyFilters('pay_check_mate.red', 'gray');
    const green = applyFilters('pay_check_mate.green', 'gray');
    let anchorClass = applyFilters('pay_check_mate.anchor_class', 'anchor-link-gray')
    const columns = [
        {
            title: __('Payroll date', 'pay-check-mate'), dataIndex: 'payroll_date', sortable: true,
            render: (text: string, record: PayrollType) => {
                return (
                    <span>{record.payroll_date_string}</span>
                )
            }
        },
        {
            title: __('Department', 'pay-check-mate'), dataIndex: 'department_id',
            render: (text: string, record: PayrollType) => {
                if (parseInt(String(record.department_id)) === 0) return <span>{__('All', 'pay-check-mate')}</span>
                const departmentData = departments?.find((department) => department.id === record.department_id);
                return (
                    <span>{departmentData?.name}</span>
                )
            }
        },
        {
            title: __('Designation', 'pay-check-mate'), dataIndex: 'designation_id',
            render: (text: string, record: PayrollType) => {
                if (parseInt(String(record.designation_id)) === 0) return <span>{__('All', 'pay-check-mate')}</span>
                const designationData = designations?.find((designation) => designation.id === record.designation_id);
                return (
                    <span>{designationData?.name}</span>
                )
            }
        },
        {
            title: __('Prepared by', 'pay-check-mate'), dataIndex: 'prepared_by',
            render: (text: string, record: PayrollType) => {
                return (
                    <span>{record.created_user}</span>
                )
            }
        },
        {title: __('Total salary', 'pay-check-mate'), dataIndex: 'total_salary', sortable: true},
        {
            title: __('Status', 'pay-check-mate'), dataIndex: 'status', sortable: true,
            render: (text: string, record: PayrollType) => {
                if (parseInt(String(record.status)) === PayrollStatus.Approved) {
                    return (
                        <span className={"flex items-center text-"+green+"-500"}>
                            <CheckIcon className="h-5 w-5 mr-1"/>
                            {__('Approved', 'pay-check-mate')}
                        </span>
                    )
                } else if (parseInt(String(record.status)) === PayrollStatus.Rejected) {
                    return (
                        <span className={"flex items-center text-" + red + "-500"}>
                            <XMarkIcon className="h-5 w-5 mr-1"/>
                            {__('Rejected', 'pay-check-mate')}
                        </span>
                    )
                } else if (parseInt(String(record.status)) === PayrollStatus.Cancelled) {
                    return (
                        <span className="flex items-center text-gray-500">
                            <ExclamationTriangleIcon className="h-5 w-5 mr-1"/>
                            {__('Cancelled', 'pay-check-mate')}
                        </span>
                    )
                } else {
                    return (
                        <span className={"flex items-center text-" + orange + "-500"}>
                            <PencilSquareIcon className="h-5 w-5 mr-1"/>
                            {__('Pending', 'pay-check-mate')}
                        </span>
                    )
                }
            }
        },
        {
            title: __('Action', 'pay-check-mate'), dataIndex: 'action',
            render: (text: string, record: PayrollType) => {
                return (
                    <div className="flex">
                        <Link
                            to={`/payroll/${record.id}`}
                            className={anchorClass}
                        >
                            {__('View', 'pay-check-mate')}
                        </Link>
                        {parseInt(String(record.status)) === PayrollStatus.NotApproved && (
                            <>
                                {userCan(UserCapNames.pay_check_mate_edit_payroll) && (

                                    <>
                                        <span className="mx-2 text-gray-300">|</span>
                                        <Link
                                            to={`/payroll/edit/${record.id}`}
                                            className={"text-" + orange + "-400 hover:text-" + orange + "-600"}
                                        >
                                            {__('Edit', 'pay-check-mate')}
                                        </Link>
                                    </>
                                )}
                                {userCan(UserCapNames.pay_check_mate_approve_payroll) && (
                                    <>
                                        <span className="mx-2 text-gray-300">|</span>
                                        <button
                                            onClick={() => handleStatus(record, 1)}
                                            className={"text-" + green + "-600 hover:text-" + green + "-900"}
                                        >
                                            {__('Approve', 'pay-check-mate')}
                                        </button>
                                    </>
                                )}
                                {userCan(UserCapNames.pay_check_mate_reject_payroll) && (
                                    <>
                                        <span className="mx-2 text-gray-300">|</span>
                                        <button
                                            onClick={() => handleStatus(record, 2)}
                                            className={"text-" + red + "-600 hover:text-" + red + "-900"}
                                        >
                                            {__('Reject', 'pay-check-mate')}
                                        </button>
                                    </>
                                )}
                                {userCan(UserCapNames.pay_check_mate_cancel_payroll) && (
                                    <>
                                        <span className="mx-2 text-gray-300">|</span>
                                        <button
                                            onClick={() => handleStatus(record, 3)}
                                            className="text-gray-400 hover:text-gray-700"
                                        >
                                            {__('Cancel', 'pay-check-mate')}
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )
            }
        }
    ]
    const handleFilterChange = (filterObject: filtersType) => {
        // Remove status, because we want to show all statuses
        delete filterObject.status;
        dispatch(payroll).getPayrolls(filterObject)
        setCurrentPage(filterObject.page);
    };
    return (
        <HOC role={UserCapNames.pay_check_mate_view_payroll_list}>
            <div>
                <div className="sm:flex sm:items-center mb-6">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">
                            {__('Payroll List', 'pay-check-mate')}
                        </h1>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        {userCan(UserCapNames.pay_check_mate_add_payroll) && (
                            <>
                                <Button
                                    className="hover:text-white"
                                    path="/generate-payroll"
                                >
                                    <PlusIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                                    {__('Generate Payroll', 'pay-check-mate')}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
                <Table
                    permissions={UserCapNames.pay_check_mate_view_payroll_list}
                    columns={columns}
                    data={payrolls}
                    isLoading={loading}
                    totalPage={totalPages}
                    per_page={parseInt(per_page)}
                    total={total}
                    currentPage={currentPage}
                    filters={filters}
                    onFilterChange={(filter) => handleFilterChange(filter)}
                    search={true}
                />
            </div>
        </HOC>
    )
}
