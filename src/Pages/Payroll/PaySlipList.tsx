import {__} from "@wordpress/i18n";
import {UserCapNames} from "../../Types/UserType";
import {Table} from "../../Components/Table";
import {useEffect, useState} from "@wordpress/element";
import {PayrollType} from "../../Types/PayrollType";
import {Link} from "react-router-dom";
import {filtersType} from "../../Store/Store";
import useFetchApi from "../../Helpers/useFetchApi";
import {EmployeeSalary} from "../../Types/SalaryHeadType";

export const PaySlipList = () => {
    const [paySlipList, setPaySlipList] = useState<EmployeeSalary[]>([]);
    const {models} = useFetchApi('/pay-check-mate/v1/employees/payslip', {per_page: '10', status: '1'}, true);
    useEffect(() => {
        if (models) {
            setPaySlipList(models as EmployeeSalary[])
        }
    }, [models]);

    const columns = [
        {title: __('Employee', 'pcm'), dataIndex: 'employee_id', sortable: true},
        {title: __('Basic', 'pcm'), dataIndex: 'basic_salary', sortable: true},
        {
            title: __('Action', 'pcm'), dataIndex: 'action', sortable: false,
            render: (value: any, record: PayrollType) => {
                return (
                    <>
                        <Link to={`/payroll/${record.id}/view`} className="text-blue-500 hover:text-blue-700 mr-2">
                            {__('View', 'pcm')}
                        </Link>
                    </>
                )
            }
        },
    ]
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
                    permissions={UserCapNames.pay_check_mate_view_payroll_list}
                    columns={columns}
                    data={paySlipList}
                    isLoading={false}
                    totalPage={1}
                    per_page={1}
                    total={1}
                    currentPage={1}
                    filters={{} as filtersType}
                    // onFilterChange={(filter) => handleFilterChange(filter)}
                />
            </div>
        </>
    )
};
