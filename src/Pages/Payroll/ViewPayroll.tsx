import {useEffect, useState} from "@wordpress/element";
import {EmployeeSalary, HeadType, SalaryHeadsResponseType, SalaryResponseType, SelectBoxType,} from "../../Types/SalaryHeadType";
import '../../css/table.scss'
import useFetchApi from "../../Helpers/useFetchApi";
import {Loading} from "../../Components/Loading";
import {__} from "@wordpress/i18n";
import {EmptyState} from "../../Components/EmptyState";
import {Card} from "../../Components/Card";
import {CurrencyDollarIcon, ArrowUpTrayIcon, PrinterIcon} from "@heroicons/react/24/outline";
import {toast} from "react-toastify";
import {useParams} from "react-router-dom";
import {useSelect} from "@wordpress/data";
import designation from "../../Store/Designation";
import department from "../../Store/Department";
import {PayrollType} from "../../Types/PayrollType";
import {applyFilters} from "../../Helpers/Hooks";
import {SelectBox} from "../../Components/SelectBox";
import {Button} from "../../Components/Button";
import * as XLSX from "xlsx";
import {HOC} from "../../Components/HOC";
import {UserCapNames} from "../../Types/UserType";

const ViewPayroll = () => {
    const payrollId = useParams().id;
    const {loading, makeGetRequest,} = useFetchApi('');

    const [payRoll, setPayRoll] = useState<PayrollType>({} as PayrollType);
    const [tableData, setTableData] = useState<EmployeeSalary[]>([]);
    const {designations} = useSelect((select) => select(designation).getDesignations({per_page: '-1', status: '1'}), []);
    const {departments} = useSelect((select) => select(department).getDepartments({per_page: '-1', status: '1'}), []);
    const [salaryHeads, setSalaryHeads] = useState<SalaryHeadsResponseType>({
        earnings: [],
        deductions: [],
        non_taxable: []
    });

    const [downloadOptions, setDownloadOptions] = useState([
        {id: 1, name: 'CSV'},
        {id: 2, name: 'Excel'}
    ] as SelectBoxType[]);
    const [selectedOption, setSelectedOption] = useState(downloadOptions[0]);

    useEffect(() => {
        makeGetRequest<SalaryResponseType>(`/pay-check-mate/v1/payrolls/${payrollId}`).then((response: any) => {
            const salary_heads = {
                earnings: response.salary_head_types.earnings ? Object.values(response.salary_head_types.earnings) : [],
                deductions: response.salary_head_types.deductions ? Object.values(response.salary_head_types.deductions) : [],
                non_taxable: response.salary_head_types.non_taxable ? Object.values(response.salary_head_types.non_taxable) : [],
            };
            setSalaryHeads(salary_heads as SalaryHeadsResponseType);
            setTableData(response.employee_salary_history);
            setPayRoll(response.payroll);
        }).catch((error: any) => {
            console.log(error, 'error')
            toast.error(__('Something went wrong while fetching payroll', 'pay_check_mate'), {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000
            });
        })
    }, [])

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
    const handlePrint = (divID: string) => {
        const divToPrint = document.getElementById(divID);
        const iframe = document.createElement('iframe')
        iframe.setAttribute('style', 'height: 0px; width: 0px; position: absolute;')
        document.body.appendChild(iframe)
        let print = iframe.contentWindow
        if (print && divToPrint) {
            let htmlToPrint = `
                <style type="text/css">
                    .no-print, .no-print * {
                        display: none !important;
                    }
                    .remarks{
                        width: 66.666667%;
                        margin-top: 1rem;
                    }
                    .prepared_by{
                        width: 20%;
                        margin-top: 1rem;
                    }
                    .text-right {
                        text-align: right;
                    }
                    .text-left {
                        text-align: left;
                    }
                    .payroll-table {
                        margin-top: 1rem;
                    }
                    .payroll-table th, .payroll-table td {
                      border: 1px solid #000;
                      padding: 4px;
                    }
                    .flex {
                        display: flex;
                    }
                    .justify-between {
                        justify-content: space-between;
                    }
                    h4 {
                      font-size: 20px;
                      font-weight: 400;
                    }
                    table {
                      border-collapse: collapse;
                      width: 100%;
                    }
                    body {
                      margin-left: 30px;
                    }
                </style>
                `;
            htmlToPrint += divToPrint.outerHTML;
            print.document.open()
            print.document.write(htmlToPrint)
            print.document.close()
            print.focus()
            print.print()
        }
    }

    const downloadFile = () => {
        if (selectedOption.id === 1) {
            downloadCSV();
        } else {
            downloadExcel();
        }
    }

    // Adding header row to Excel
    const allSalaryHeads = salaryHeads.earnings.concat(salaryHeads.deductions, salaryHeads.non_taxable);
    const headers = [
        __('Employee ID', 'pay_check_mate'),
        __('Employee name', 'pay_check_mate'),
        __('Designation', 'pay_check_mate'),
        __('Department', 'pay_check_mate'),
        __('Basic Salary', 'pay_check_mate'),
        ...allSalaryHeads.map((salaryHead) => salaryHead.head_name),
        __('Total Salary', 'pay_check_mate'),
    ]

    const getSampleData = () => {
        const data = [];
        data.push(headers);
        // Adding data row to Excel and/or CSV
        const dataRow = tableData.map((employee) => {
            return [
                employee.employee_id,
                employee.first_name + ' ' + employee.last_name,
                departments.find((department: any) => department.id === employee.department_id)?.name || __('All', 'pay_check_mate'),
                designations.find((designation: any) => designation.id === employee.designation_id)?.name || __('All', 'pay_check_mate'),
                employee.basic_salary,
                ...allSalaryHeads.map((salaryHead) => {
                    if (parseInt(String(salaryHead.head_type)) === HeadType.Earning) {
                        return employee.salary_details.earnings[salaryHead.id] || 0;
                    } else if (parseInt(String(salaryHead.head_type)) === HeadType.Deduction) {
                        return employee.salary_details.deductions[salaryHead.id] || 0;
                    } else {
                        return employee.salary_details.non_taxable[salaryHead.id] || 0;
                    }
                }),
                rowTotalPayable(employee),
            ];
        });

        data.push(...dataRow);
        return data;
    }
    const downloadCSV = () => {
        const csvData = getSampleData();

        // Create CSV content
        const csvContent = csvData.map(row => row.join(',')).join('\n');

        // Create a Blob object from the CSV content
        const blob = new Blob([csvContent], {type: 'text/csv'});

        // Create a download link and trigger click event
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        // With date
        a.download = 'salary_sheet_' + new Date().toISOString().slice(0, 10) + '.csv';
        a.click();
    };

    const downloadExcel = () => {
        const excelData = getSampleData();
        // Create Excel Workbook
        const workbook = XLSX.utils.book_new();
        const sheetData = XLSX.utils.aoa_to_sheet(excelData);
        XLSX.utils.book_append_sheet(workbook, sheetData, 'Payroll Data');

        // Generate Excel file
        const excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});

        // Convert buffer to blob
        const blob = new Blob([excelBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});

        // Create a download link and trigger click event
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'salary_sheet_' + new Date().toISOString().slice(0, 10) + '.xlsx';
        a.click();
    };

    const isExportSalarySheet = applyFilters('pay_check_mate.is_export_salary_sheet', false)
    const earningClass = applyFilters('pay_check_mate.earning_class', '')
    const totalEarningsClass = applyFilters('pay_check_mate.total_earnings_class', '')
    const deductionClass = applyFilters('pay_check_mate.deduction_class', '')
    const totalDeductionsClass = applyFilters('pay_check_mate.total_deductions_class', '')
    const nonTaxableClass = applyFilters('pay_check_mate.non_taxable_class', '')
    const netPayableClass = applyFilters('pay_check_mate.net_payable_class', '')
    const totalPayableClass = applyFilters('pay_check_mate.total_payable_class', '')
    let red = applyFilters('pay_check_mate.red', 'gray');

    return (
        <>
            {tableData.length > 0 ? (
                <>
                    {loading ? (
                        <Loading />
                    ) : (
                        <HOC role={UserCapNames.pay_check_mate_view_payroll_details}>
                            <div id='printable'>
                                <div className="flex justify-between">
                                    <div>
                                        <div className="sm:flex-auto">
                                            <h1 className="text-base font-semibold leading-6 text-gray-900">
                                                {__('Payroll for : ', 'pay_check_mate')} {payRoll?.payroll_date_string}
                                            </h1>
                                        </div>
                                        <div className="flex justify-between mt-2 mb-4">
                                            <div className="grid grid-cols-4 gap-4">
                                                <div>
                                                    {__('Department', 'pay_check_mate')} : {designations.find((designation: any) => designation.id === payRoll?.designation_id)?.name || __('All', 'pay_check_mate')}
                                                </div>
                                                <div>
                                                    {__('Designation', 'pay_check_mate')} : {departments.find((department: any) => department.id === payRoll?.department_id)?.name || __('All', 'pay_check_mate')}
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center no-print">
                                        <PrinterIcon className="h-6 w-6 text-gray-500 cursor-pointer" onClick={() => handlePrint('printable')} />
                                        {isExportSalarySheet && (
                                            <div className="ml-6 flex justify-between gap-6">
                                                <SelectBox
                                                    className="w-24"
                                                    title=""
                                                    options={downloadOptions}
                                                    selected={selectedOption}
                                                    setSelected={(option) => setSelectedOption(option)}
                                                />
                                                <Button
                                                    onClick={downloadFile}
                                                    className="mt-2"
                                                >
                                                    <ArrowUpTrayIcon
                                                        className="w-5 h-5 mr-2 -ml-1 text-white"
                                                        aria-hidden="true"
                                                    />
                                                    {__('Export', 'pay_check_mate')}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="payroll-table-container">
                                    <table className="payroll-table">
                                        <thead>
                                        <tr>
                                            <th rowSpan={2}>
                                                {__('Sl. No.', 'pay_check_mate')}
                                            </th>
                                            <th rowSpan={2}>
                                                {__('Employee ID', 'pay_check_mate')}
                                            </th>
                                            <th
                                                rowSpan={2}
                                                className="fixed-column"
                                            >
                                                {__('Employee Name', 'pay_check_mate')}
                                            </th>
                                            <th rowSpan={2}>
                                                {__('Designation', 'pay_check_mate')}
                                            </th>
                                            <th rowSpan={2}>
                                                {__('Department', 'pay_check_mate')}
                                            </th>
                                            <th rowSpan={3}>
                                                {__('Basic Salary', 'pay_check_mate')}
                                            </th>
                                            {salaryHeads.earnings.length > 0 && (
                                                <th
                                                    className={earningClass}
                                                    colSpan={salaryHeads.earnings.length}
                                                >Earnings</th>
                                            )}
                                            <th
                                                className={totalEarningsClass}
                                                rowSpan={2}
                                            >
                                                {__('Total Earnings', 'pay_check_mate')}
                                            </th>
                                            {salaryHeads.deductions.length > 0 && (
                                                <th
                                                    className={deductionClass}
                                                    colSpan={salaryHeads.deductions.length}
                                                >
                                                    {__('Deductions', 'pay_check_mate')}
                                                </th>
                                            )}
                                            <th
                                                className={totalDeductionsClass}
                                                rowSpan={2}
                                            >
                                                {__('Total Deductions', 'pay_check_mate')}
                                            </th>
                                            <th
                                                className={netPayableClass}
                                                rowSpan={2}
                                            >
                                                {__('Net Payable', 'pay_check_mate')}
                                            </th>
                                            {salaryHeads.non_taxable.length > 0 && (
                                                <th
                                                    className={nonTaxableClass}
                                                    colSpan={salaryHeads.non_taxable.length}
                                                >
                                                    {__('Non Taxable', 'pay_check_mate')}
                                                </th>
                                            )}
                                            <th
                                                className={totalPayableClass}
                                                rowSpan={2}
                                            >
                                                {__('Total Payable', 'pay_check_mate')}
                                            </th>
                                        </tr>
                                        <tr className="second-row">
                                            {salaryHeads.earnings.map((earning) => (
                                                <th
                                                    className={earningClass}
                                                    key={earning.id}
                                                >
                                                    {earning.head_name}
                                                </th>
                                            ))}
                                            {salaryHeads.deductions.map((deduction) => (
                                                <th
                                                    className={deductionClass}
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
                                                    {departments.find((department: any) => department.id === data.department_id)?.name || __('All', 'pay_check_mate')}
                                                </td>
                                                <td
                                                    className="text-left"
                                                    key={`department${tableDataIndex}`}
                                                >
                                                    {designations.find((designation: any) => designation.id === data.designation_id)?.name || __('All', 'pay_check_mate')}
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
                                                    className={`text-right ${totalEarningsClass}`}
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
                                                    className={`${totalDeductionsClass} text-right`}
                                                    key={`total_deductions${tableDataIndex}`}
                                                >
                                                    {sumValues(data.salary_details.deductions)}
                                                </td>
                                                <td
                                                    className={`${netPayableClass} text-right`}
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
                                                    className={`${totalPayableClass} text-right`}
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
                                                {__('Total', 'pay_check_mate')}
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
                                                className={`${totalEarningsClass} text-right`}
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
                                                className={`text-right ${totalDeductionsClass}`}
                                                key={`total_deductions`}
                                            >
                                                {totalDeductions}
                                            </td>
                                            <td
                                                className={`text-right ${netPayableClass}`}
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
                                                className={`text-right ${totalPayableClass}`}
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
                                                                {__('Remarks', 'pay_check_mate')}
                                                            </strong>:&nbsp;
                                                            <div dangerouslySetInnerHTML={{__html: payRoll.remarks}}/>
                                                        </div>
                                                    </div>
                                            </div>
                                        </div>
                                        <div className="w-1/6 prepared_by">
                                            <div className="flex">
                                                    <strong className="font-bold">
                                                        {__('Prepared By: ', 'pay_check_mate')}&nbsp;
                                                    </strong>
                                                {payRoll.prepared_by_first_name + ' ' + payRoll.prepared_by_last_name} ({payRoll.prepared_by_employee_id})
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </HOC>
                    )}
                </>
            ) : (
                <Card>
                    <EmptyState
                        title={__('Payroll Sheet', 'pay_check_mate')}
                        description={__('Select department or designation and pay month to view payroll list', 'pay_check_mate')}
                        icon={<CurrencyDollarIcon
                            className={"w-6 h-6 text-"+red+"-600"}
                            aria-hidden="true"
                        />}
                    />
                </Card>
            )}
        </>
    );
};

export default ViewPayroll;
