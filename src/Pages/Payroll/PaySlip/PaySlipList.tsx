import {__} from "@wordpress/i18n";
import {UserCapNames} from "../../../Types/UserType";
import {Table} from "../../../Components/Table";
import {useEffect, useState} from "@wordpress/element";
import {PayrollType} from "../../../Types/PayrollType";
import {Link} from "react-router-dom";
import {filtersType} from "../../../Store/Store";
import useFetchApi from "../../../Helpers/useFetchApi";
import {EmployeeSalary} from "../../../Types/SalaryHeadType";

export const PaySlipList = () => {
    let per_page = '10';
    const [paySlipList, setPaySlipList] = useState<EmployeeSalary[]>([]);
    const {models, loading, filterObject, setFilterObject, total, totalPages} = useFetchApi('/pay-check-mate/v1/payslip', {per_page: per_page, status: '1'}, true);
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        if (models) {
            setPaySlipList(models as EmployeeSalary[])
        }
    }, [models]);

    const columns = [
        {
            title: __('Salary date', 'pcm'), dataIndex: 'payroll_date',
            render: (text: any, record: PayrollType) => {
                return (
                    <>
                        {new Date(text).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                        })}
                    </>
                )
            }
        },
        {
            title: __('Action', 'pcm'), dataIndex: 'action',
            render: (value: any, record: PayrollType) => {
                return (
                    <>
                        <Link
                            to={`/pay-slip/view/${record.id}`}
                            state={{data: record}}
                            className="text-blue-500 hover:text-blue-700 mr-2"
                        >
                            {__('View', 'pcm')}
                        </Link>
                    </>
                )
            }
        },
    ]
    const handleFilterChange = (filterObject: filtersType) => {
        setFilterObject(filterObject);
        setCurrentPage(filterObject.page || 1);
    };
    return (
        <>
            <div>
                <div className="sm:flex sm:items-center mb-6">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">
                            {__('Payslip List', 'pcm')}
                        </h1>
                    </div>
                </div>
                <Table
                    permissions={UserCapNames.pay_check_mate_view_payslip_list}
                    columns={columns}
                    data={paySlipList}
                    isLoading={loading}
                    totalPage={totalPages}
                    per_page={per_page}
                    filters={filterObject as filtersType}
                    currentPage={currentPage}
                    total={total}
                    onFilterChange={(filter) => handleFilterChange(filter)}
                    search={false}
                />
            </div>
        </>
    )
};
