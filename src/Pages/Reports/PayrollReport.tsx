import {useEffect, useState} from "@wordpress/element";
import {EmployeeSalary, SalaryHeadsResponseType, SalaryResponseType, SelectBoxType,} from "../../Types/SalaryHeadType";
import '../../css/table.scss'
import useFetchApi from "../../Helpers/useFetchApi";
import {Loading} from "../../Components/Loading";
import {__} from "@wordpress/i18n";
import {EmptyState} from "../../Components/EmptyState";
import {Card} from "../../Components/Card";
import {CurrencyDollarIcon, PrinterIcon} from "@heroicons/react/24/outline";
import {toast} from "react-toastify";
import {useParams} from "react-router-dom";
import {useSelect} from "@wordpress/data";
import designation from "../../Store/Designation";
import department from "../../Store/Department";
import {PayrollType} from "../../Types/PayrollType";
import {userCan} from "../../Helpers/User";
import {UserCapNames} from "../../Types/UserType";
import {PermissionDenied} from "../../Components/404";
import {handlePrint} from "../../Helpers/Helpers";
import {SelectBox} from "../../Components/SelectBox";
import {FormInput} from "../../Components/FormInput";
import {Button} from "../../Components/Button";

const ViewPayroll = () => {
    const payrollId = useParams().id;
    const {loading,makePostRequest} = useFetchApi('');

    const [selectedDesignation, setSelectedDesignation] = useState<SelectBoxType>({} as SelectBoxType);
    const [selectedDepartment, setSelectedDepartment] = useState<SelectBoxType>({} as SelectBoxType);
    const [payDate, setPayDate] = useState(new Date().toISOString().slice(0, 10));
    const [payRoll, setPayRoll] = useState<PayrollType>({} as PayrollType);
    const [tableData, setTableData] = useState<EmployeeSalary[]>([]);
    const {designations} = useSelect((select) => select(designation).getDesignations({per_page: '-1', status: '1'}), []);
    const {departments} = useSelect((select) => select(department).getDepartments({per_page: '-1', status: '1'}), []);
    const [salaryHeads, setSalaryHeads] = useState<SalaryHeadsResponseType>({
        earnings: [],
        deductions: [],
        non_taxable: []
    });
    const handleFilter = (e: any) => {
        e.preventDefault();
        try {
            if (!payDate) {
                toast.error(__('Please select a date', 'pcm'));
                return;
            }
            const data = {
                'payroll_date': payDate,
                'department_id': selectedDepartment.id,
                'designation_id': selectedDesignation.id,
            }
            makePostRequest<SalaryResponseType>('/pay-check-mate/v1/payrolls/reports', data, false).then((response) => {
                const salary_heads = {
                    earnings: response.salary_head_types.earnings ? Object.values(response.salary_head_types.earnings) : [],
                    deductions: response.salary_head_types.deductions ? Object.values(response.salary_head_types.deductions) : [],
                    non_taxable: response.salary_head_types.non_taxable ? Object.values(response.salary_head_types.non_taxable) : [],
                };
                setSalaryHeads(salary_heads as SalaryHeadsResponseType);
                setTableData(response.employee_salary_history);
                // @ts-ignore
                setPayRoll(response.payroll);
            }).catch((error: any) => {
                toast.error(__('Something went wrong while fetching payroll report', 'pcm'), {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000
                });
                setTableData([]);
                setPayRoll({} as PayrollType);
                setSalaryHeads({} as SalaryHeadsResponseType);
            })
        } catch (error) {
            console.log(error, 'error'); // Handle the error accordingly
        }
    };
    useEffect(() => {
        if (designations.length <= 0) return;
        const defaultDesignation = {
            id: 'all',
            name: __('All', 'pcm'),
        }

        setSelectedDesignation(defaultDesignation)
    }, [designations]);

    useEffect(() => {
        if (departments.length <= 0) return;

        const defaultDepartment = {
            id: 'all',
            name: __('All', 'pcm'),
        }

        setSelectedDepartment(defaultDepartment)
    }, [departments]);
    const sumValues = (values: { [key: number]: number }): number => {
        return Object.values(values).reduce((sum, value) => sum + parseFloat(String(value)), 0);
    };

    const rowNetPayable = (data: EmployeeSalary): number => {
        return parseInt(String(data.basic_salary)) + sumValues(data.salary_details.earnings) - sumValues(data.salary_details.deductions);
    }

    const rowTotalPayable = (data: EmployeeSalary): number => {
        return parseInt(String(data.basic_salary)) + (sumValues(data.salary_details.earnings) + sumValues(data.salary_details.non_taxable)) - sumValues(data.salary_details.deductions);
    }

    const totalAllowance: number = Number(tableData.reduce(
            (total, data) => total + sumValues(data.salary_details.earnings),
            0
        ).toFixed(2)
    );

    const totalDeductions: number = Number(tableData.reduce(
            (total, data) => total + sumValues(data.salary_details.deductions),
            0
        ).toFixed(2)
    );


    const netPayable: number = Number(tableData.reduce(
            (total, data) => total + rowNetPayable(data),
            0
        ).toFixed(2)
    );

    const totalNetPayable: number = Number(tableData.reduce(
            (total, data) => total + rowTotalPayable(data),
            0
        ).toFixed(2)
    );

    return (
        <>
            {!userCan(UserCapNames.pay_check_mate_view_payroll_details) ? (
                <Card>
                    <PermissionDenied />
                </Card>
            ) : (
                <>
                    <div className="flex justify-between">
                        <form
                            className="p-6"
                            onSubmit={handleFilter}
                        >
                            <div className="grid grid-cols-4 gap-4">
                                <div>
                                    <SelectBox
                                        title={__('Designation', 'pcm')}
                                        options={designations}
                                        selected={selectedDesignation}
                                        setSelected={(selectedDesignation) => setSelectedDesignation(selectedDesignation)}
                                    />
                                </div>
                                <div>
                                    <SelectBox
                                        title={__('Department', 'pcm')}
                                        options={departments}
                                        selected={selectedDepartment}
                                        setSelected={(selectedDepartment) => setSelectedDepartment(selectedDepartment)}
                                    />
                                </div>
                                <div>
                                    <FormInput
                                        type="date"
                                        label={__('Pay month', 'pcm')}
                                        name="pay_month"
                                        id="pay_month"
                                        value={payDate}
                                        onChange={(e) => setPayDate(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-end">
                                    {/*This button should flat and small*/}
                                    {!payrollId && (
                                        <Button
                                            type="submit"
                                        >
                                            {__('Show report', 'pcm')}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                    {tableData.length > 0 ? (
                        <>
                            {loading ? (
                                <Loading />
                            ) : (
                                <div id='printable'>
                                    <div className="flex justify-between">
                                        <div>
                                            <div className="sm:flex-auto">
                                                <h1 className="text-base font-semibold leading-6 text-gray-900">
                                                    {__('Payroll for : ', 'pcm')} {payRoll?.payroll_date_string}
                                                </h1>
                                            </div>
                                            {/*<div className="flex justify-between mt-2 mb-4">*/}
                                            {/*    <div className="grid grid-cols-4 gap-4">*/}
                                            {/*        <div>*/}
                                            {/*            {__('Department', 'pcm')} : {designations.find((designation: any) => designation.id === payRoll?.designation_id)?.name || __('All', 'pcm')}*/}
                                            {/*        </div>*/}
                                            {/*        <div>*/}
                                            {/*            {__('Designation', 'pcm')} : {departments.find((department: any) => department.id === payRoll?.department_id)?.name || __('All', 'pcm')}*/}
                                            {/*        </div>*/}

                                            {/*    </div>*/}
                                            {/*</div>*/}
                                        </div>
                                        <div className="flex items-center no-print">
                                            <PrinterIcon className="h-6 w-6 text-gray-500 cursor-pointer" onClick={() => handlePrint('printable')} />
                                            {/*Excel Download*/}
                                        </div>
                                    </div>
                                    <div className="payroll-table-container">
                                        <table className="payroll-table">
                                            <thead>
                                            <tr>
                                                <th rowSpan={2}>
                                                    {__('Sl. No.', 'pcm')}
                                                </th>
                                                <th rowSpan={2}>
                                                    {__('Employee ID', 'pcm')}
                                                </th>
                                                <th
                                                    rowSpan={2}
                                                    className="fixed-column"
                                                >
                                                    {__('Employee Name', 'pcm')}
                                                </th>
                                                <th rowSpan={2}>
                                                    {__('Designation', 'pcm')}
                                                </th>
                                                <th rowSpan={2}>
                                                    {__('Department', 'pcm')}
                                                </th>
                                                <th rowSpan={3}>
                                                    {__('Basic Salary', 'pcm')}
                                                </th>
                                                {salaryHeads.earnings.length > 0 && (
                                                    <th
                                                        className="salary"
                                                        colSpan={salaryHeads.earnings.length}
                                                    >Earnings</th>
                                                )}
                                                <th
                                                    className="total_salary"
                                                    rowSpan={2}
                                                >
                                                    {__('Total Earnings', 'pcm')}
                                                </th>
                                                {salaryHeads.deductions.length > 0 && (
                                                    <th
                                                        className="deduction"
                                                        colSpan={salaryHeads.deductions.length}
                                                    >
                                                        {__('Deductions', 'pcm')}
                                                    </th>
                                                )}
                                                <th
                                                    className="total_deduction"
                                                    rowSpan={2}
                                                >
                                                    {__('Total Deductions', 'pcm')}
                                                </th>
                                                <th
                                                    className="net_payable"
                                                    rowSpan={2}
                                                >
                                                    {__('Net Payable', 'pcm')}
                                                </th>
                                                {salaryHeads.non_taxable.length > 0 && (
                                                    <th
                                                        className="non_taxable"
                                                        colSpan={salaryHeads.non_taxable.length}
                                                    >
                                                        {__('Non Taxable', 'pcm')}
                                                    </th>
                                                )}
                                                <th
                                                    className="total_payable"
                                                    rowSpan={2}
                                                >
                                                    {__('Total Payable', 'pcm')}
                                                </th>
                                            </tr>
                                            <tr className="second-row">
                                                {salaryHeads.earnings.map((earning) => (
                                                    <th
                                                        className="salary"
                                                        key={earning.id}
                                                    >
                                                        {earning.head_name}
                                                    </th>
                                                ))}
                                                {salaryHeads.deductions.map((deduction) => (
                                                    <th
                                                        className="deduction"
                                                        key={deduction.id}
                                                    >
                                                        {deduction.head_name}
                                                    </th>
                                                ))}
                                                {salaryHeads.non_taxable.map((deduction) => (
                                                    <th key={deduction.id}>
                                                        {deduction.head_name}
                                                    </th>
                                                ))}
                                            </tr>
                                            </thead>

                                            <tbody>
                                            {tableData.map((data, tableDataIndex) => (
                                                <tr key={data.id}>
                                                    <td
                                                        className="text-right"
                                                        key={`sl${tableDataIndex}`}
                                                    >
                                                        {tableDataIndex + 1}
                                                    </td>
                                                    <td
                                                        className="text-right"
                                                        key={`employee_id${tableDataIndex}`}
                                                    >
                                                        {data.employee_id}
                                                    </td>
                                                    <td
                                                        className="text-left fixed-column"
                                                        key={`employee_name${tableDataIndex}`}
                                                    >
                                                        {data.first_name + ' ' + data.last_name}
                                                    </td>
                                                    <td
                                                        className="text-left"
                                                        key={`designation${tableDataIndex}`}
                                                    >
                                                        {departments.find((department: any) => department.id === data.department_id)?.name || ''}
                                                    </td>
                                                    <td
                                                        className="text-left"
                                                        key={`department${tableDataIndex}`}
                                                    >
                                                        {designations.find((designation: any) => designation.id === data.designation_id)?.name || ''}
                                                    </td>
                                                    <td
                                                        className="text-right"
                                                        key={`basic_salary${tableDataIndex}`}
                                                    >
                                                        {data.basic_salary}
                                                    </td>
                                                    {salaryHeads.earnings.map((earning) => (
                                                        <td
                                                            className="text-right"
                                                            key={earning.id}
                                                        >
                                                            {data.salary_details.earnings[earning.id] || 0}
                                                        </td>
                                                    ))}
                                                    <td
                                                        className="text-right total_salary"
                                                        key={`total_earnings${tableDataIndex}`}
                                                    >
                                                        {sumValues(data.salary_details.earnings)}
                                                    </td>
                                                    {salaryHeads.deductions.map((deduction) => (
                                                        <td
                                                            className="text-right"
                                                            key={deduction.id}
                                                        >
                                                            {data.salary_details.deductions[deduction.id] || 0}
                                                        </td>
                                                    ))}
                                                    <td
                                                        className="total_deduction text-right"
                                                        key={`total_deductions${tableDataIndex}`}
                                                    >
                                                        {sumValues(data.salary_details.deductions)}
                                                    </td>
                                                    <td
                                                        className="net_payable text-right"
                                                        key={`net_payable${tableDataIndex}`}
                                                    >
                                                        {rowNetPayable(data)}
                                                    </td>
                                                    {salaryHeads.non_taxable.map((non_taxable) => (
                                                        <td
                                                            className="text-right"
                                                            key={non_taxable.id}
                                                        >
                                                            {data.salary_details.non_taxable[non_taxable.id] || 0}
                                                        </td>
                                                    ))}
                                                    <td
                                                        className="total_payable text-right"
                                                        key={`total_payable${tableDataIndex}`}
                                                    >
                                                        {rowTotalPayable(data)}
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                            <tfoot>
                                            <tr>
                                                <td
                                                    key={`total`}
                                                    className="fixed-column text-right font-bold text-xl"
                                                    colSpan={5}
                                                >
                                                    {__('Total', 'pcm')}
                                                </td>
                                                <td
                                                    className="text-right"
                                                    key={`total_basic_salary`}
                                                >
                                                    {sumValues(tableData.map((data) => data.basic_salary))}
                                                </td>
                                                {salaryHeads.earnings.map((earning) => (
                                                    <td
                                                        className="text-right"
                                                        key={`total_${earning.id}`}
                                                    >
                                                        {sumValues(tableData.map((data) => data.salary_details.earnings[earning.id] || 0))}
                                                    </td>
                                                ))}
                                                <td
                                                    className="total_salary text-right"
                                                    key={`total_earnings`}
                                                >
                                                    {totalAllowance}
                                                </td>
                                                {salaryHeads.deductions.map((deduction) => (
                                                    <td
                                                        className="text-right"
                                                        key={deduction.id}
                                                    >
                                                        {sumValues(tableData.map((data) => data.salary_details.deductions[deduction.id] || 0))}
                                                    </td>
                                                ))}
                                                <td
                                                    className="text-right"
                                                    key={`total_deductions`}
                                                >
                                                    {totalDeductions}
                                                </td>
                                                <td
                                                    className="text-right"
                                                    key={`non_taxable`}
                                                >
                                                    {netPayable}
                                                </td>
                                                {salaryHeads.non_taxable.map((non_taxable) => (
                                                    <td
                                                        className="text-right"
                                                        key={non_taxable.id}
                                                    >
                                                        {sumValues(tableData.map((data) => data.salary_details.non_taxable[non_taxable.id] || 0))}
                                                    </td>
                                                ))}
                                                <td
                                                    className="text-right"
                                                    key={`total_net_payable`}
                                                >
                                                    {totalNetPayable}
                                                </td>
                                            </tr>
                                            </tfoot>
                                        </table>
                                        {/*Give remarks 75% and prepared by 25%*/}
                                        <div className="flex justify-between mt-4">
                                            <div className="w-4/6 remarks">
                                                <div className="flex">
                                                        <div className="flex">
                                                            <div className="mt-4">
                                                                <strong>
                                                                    {__('Remarks', 'pcm')}
                                                                </strong>:&nbsp;
                                                                <div dangerouslySetInnerHTML={{__html: payRoll.remarks}}/>
                                                            </div>
                                                        </div>
                                                </div>
                                            </div>
                                            <div className="w-1/6 prepared_by">
                                                <div className="flex">
                                                        <strong className="font-bold">
                                                            {__('Prepared By: ', 'pcm')}&nbsp;
                                                        </strong>
                                                        {payRoll.prepared_by_first_name + ' ' + payRoll.prepared_by_last_name} ({payRoll.prepared_by_employee_id})
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <Card>
                            <EmptyState
                                title={__('Payroll Sheet', 'pcm')}
                                description={__('Select department or designation and pay month to view payroll list', 'pcm')}
                                icon={<CurrencyDollarIcon
                                    className="w-6 h-6 text-red-600"
                                    aria-hidden="true"
                                />}
                            />
                        </Card>
                    )}
                </>
            )}
        </>
    );
};

export default ViewPayroll;
