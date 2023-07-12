import {Button} from "../../Components/Button";
import {CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon, PencilSquareIcon, XCircleIcon, XMarkIcon} from "@heroicons/react/24/outline";
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

export const PayrollList = () => {
    const dispatch = useDispatch();
    const per_page = '10';
    const {payrolls, loading, totalPages, filters, total} = useSelect((select) => select(payroll).getPayrolls({per_page: per_page, page: 1, order_by: 'payroll_date', order: 'DESC'}), []);
    const {departments} = useSelect((select) => select(department).getDepartments({per_page: '-1'}), []);
    const {designations} = useSelect((select) => select(designation).getDesignations({per_page: '-1'}), []);

    const [currentPage, setCurrentPage] = useState(filters.page);
    const handleStatus = (payrollData: PayrollType, status: number) => {
        // @ts-ignore
        const _wpnonce = payCheckMate.pay_check_mate_nonce;
        const data = {
            ...payrollData,
            status,
            _wpnonce
        }
        dispatch(payroll).updatePayroll(data).then((response: any) => {
            useNotify(response, __('Payroll updated successfully', 'pcm'), __('Something went wrong while updating payroll', 'pcm'));
        }).catch((error: any) => {
            console.log(error, 'error')
            toast.error(__('Something went wrong while updating payroll', 'pcm'), {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 3000
            });
        })
    }
    const columns = [
        {title: __('Payroll date', 'pcm'), dataIndex: 'payroll_date_string', sortable: true},
        {
            title: __('Department', 'pcm'), dataIndex: 'department_id',
            render: (text: string, record: PayrollType) => {
                if (parseInt(String(record.department_id)) === 0) return <span>{__('All', 'pcm')}</span>
                const departmentData = departments?.find((department) => department.id === record.department_id);
                return (
                    <span>{departmentData?.name}</span>
                )
            }
        },
        {
            title: __('Designation', 'pcm'), dataIndex: 'designation_id',
            render: (text: string, record: PayrollType) => {
                if (parseInt(String(record.designation_id)) === 0) return <span>{__('All', 'pcm')}</span>
                const designationData = designations?.find((designation) => designation.id === record.designation_id);
                return (
                    <span>{designationData?.name}</span>
                )
            }
        },
        {
            title: __('Prepared by', 'pcm'), dataIndex: 'prepared_by',
            render: (text: string, record: PayrollType) => {
                return (
                    <span>{record.created_employee_id}</span>
                )
            }
        },
        {title: __('Total salary', 'pcm'), dataIndex: 'total_salary', sortable: true},
        {
            title: __('Status', 'pcm'), dataIndex: 'status', sortable: true,
            render: (text: string, record: PayrollType) => {
                if (parseInt(String(record.status)) === PayrollStatus.Approved) {
                    return (
                        <span className="flex items-center text-green-500">
                            <CheckIcon className="h-5 w-5 mr-1"/>
                            {__('Approved', 'pcm')}
                        </span>
                    )
                } else if (parseInt(String(record.status)) === PayrollStatus.Rejected) {
                    return (
                        <span className="flex items-center text-red-500">
                            <XMarkIcon className="h-5 w-5 mr-1"/>
                            {__('Rejected', 'pcm')}
                        </span>
                    )
                } else if (parseInt(String(record.status)) === PayrollStatus.Cancelled) {
                    return (
                        <span className="flex items-center text-gray-500">
                            <ExclamationTriangleIcon className="h-5 w-5 mr-1"/>
                            {__('Cancelled', 'pcm')}
                        </span>
                    )
                } else {
                    return (
                        <span className="flex items-center text-orange-500">
                            <PencilSquareIcon className="h-5 w-5 mr-1"/>
                            {__('Pending', 'pcm')}
                        </span>
                    )
                }
            }
        },
        {
            title: __('Action', 'pcm'), dataIndex: 'action',
            render: (text: string, record: PayrollType) => {
                return (
                    <div className="flex">
                        <Link
                            to={`/payroll/${record.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                        >
                            {__('View', 'pcm')}
                        </Link>
                        {parseInt(String(record.status)) === PayrollStatus.NotApproved && (
                            <>
                                <span className="mx-2 text-gray-300">|</span>
                                <Link
                                    to={`/payroll/edit/${record.id}`}
                                    className="text-orange-400 hover:text-orange-600"
                                    // onClick={() => handleModal(record)}
                                >
                                    {__('Edit', 'pcm')}
                                </Link>
                                <span className="mx-2 text-gray-300">|</span>
                                <button
                                    onClick={() => handleStatus(record, 1)}
                                    className="text-green-600 hover:text-green-900"
                                >
                                    {__('Approve', 'pcm')}
                                </button>
                                <span className="mx-2 text-gray-300">|</span>
                                <button
                                    onClick={() => handleStatus(record, 2)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    {__('Reject', 'pcm')}
                                </button>
                                <span className="mx-2 text-gray-300">|</span>
                                <button
                                    onClick={() => handleStatus(record, 3)}
                                    className="text-gray-400 hover:text-gray-700"
                                >
                                    {__('Cancel', 'pcm')}
                                </button>
                            </>
                        )}
                    </div>
                )
            }
        }
    ]
    const handleFilterChange = (filterObject: filtersType) => {
        // Remove status, cause we want to show all status
        delete filterObject.status;
        dispatch(payroll).getPayrolls(filterObject)
        setCurrentPage(filterObject.page);
    };
    return (
        <>
            <div>
                <div className="sm:flex sm:items-center mb-6">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">
                            {__('Payroll List', 'pcm')}
                        </h1>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <Button
                            className="hover:text-white"
                            path="/generate-payroll"
                        >
                            <CheckCircleIcon
                                className="w-5 h-5 mr-2 -ml-1 text-white"
                                aria-hidden="true"
                            />
                            {__('Generate Payroll', 'pcm')}
                        </Button>
                    </div>
                </div>
                <Table
                    columns={columns}
                    data={payrolls}
                    isLoading={loading}
                    totalPage={totalPages}
                    per_page={parseInt(per_page)}
                    total={total}
                    currentPage={currentPage}
                    filters={filters}
                    onFilterChange={(filter) => handleFilterChange(filter)}
                />
            </div>
        </>
    )
}
