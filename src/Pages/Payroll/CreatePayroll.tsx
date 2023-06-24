import {useEffect, useState} from "@wordpress/element";
import {
    EmployeeSalary,
    SalaryHeadsResponseType,
    SalaryResponseType,
    SelectBoxType
} from "../../Types/SalaryHeadType";
import '../../css/table.scss'
import useFetchApi from "../../Helpers/useFetchApi";
import {Loading} from "../../Components/Loading";
import {SelectBox} from "../../Components/SelectBox";
import {__} from "@wordpress/i18n";
import {FormInput} from "../../Components/FormInput";
import {EmptyState} from "../../Components/EmptyState";
import {Card} from "../../Components/Card";
import {CurrencyDollarIcon} from "@heroicons/react/24/outline";
import {useSelect} from "@wordpress/data";
import department from "../../Store/Department";
import designation from "../../Store/Designation";
import {toast} from "react-toastify";
import {Button} from "../../Components/Button";

const CreatePayroll = () => {
    const {loading, makePostRequest,} = useFetchApi('');
    const [tableData, setTableData] = useState<EmployeeSalary[]>([]);
    const {designations} = useSelect((select) => select(designation).getDesignations({per_page: '-1', status: '1'}), []);
    const {departments} = useSelect((select) => select(department).getDepartments({per_page: '-1', status: '1'}), []);
    const [selectedDesignation, setSelectedDesignation] = useState<SelectBoxType>({} as SelectBoxType);
    const [selectedDepartment, setSelectedDepartment] = useState<SelectBoxType>({} as SelectBoxType);
    const [payDate, setPayDate] = useState('');

    // @ts-ignore
    const handleFilter = (e) => {
        e.preventDefault();
        try {
            if (!payDate) {
                toast.error(__('Please select a date', 'pcm'));
                return;
            }
            const data = {
                'date': payDate,
                'department_id': selectedDepartment.id,
                'designation_id': selectedDesignation.id,
            }
            makePostRequest<SalaryResponseType>('/pay-check-mate/v1/payroll', data, false).then((response) => {
                const salary_heads = {
                    earnings: response.salary_head_types.earnings ? Object.values(response.salary_head_types.earnings) : [],
                    deductions: response.salary_head_types.deductions ? Object.values(response.salary_head_types.deductions) : [],
                    non_taxable: response.salary_head_types.non_taxable ? Object.values(response.salary_head_types.non_taxable) : [],
                };

                setSalaryHeads(salary_heads)
                setTableData(response.employee_salary_history)
            }).catch((e: unknown) => {
                console.log(e);
            })
        } catch (error) {
            console.log(error); // Handle the error accordingly
        }
    };

    useEffect(() => {
        if (designations.length <= 0) return;
        const defaultDesignation = {
            id: 0,
            name: __('All', 'pcm'),
        }
        // Add default designation to the list
        // @ts-ignore
        designations.unshift(defaultDesignation);
        setSelectedDesignation(defaultDesignation)
    }, [designations]);

    useEffect(() => {
        if (departments.length <= 0) return;

        const defaultDepartment = {
            id: 0,
            name: __('All', 'pcm'),
        }
        // Add default department to the list
        // @ts-ignore
        departments.unshift(defaultDepartment);
        setSelectedDepartment(defaultDepartment)

    }, [departments]);
    const [salaryHeads, setSalaryHeads] = useState<SalaryHeadsResponseType>({
        earnings: [],
        deductions: [],
        non_taxable: []
    });

    const sumValues = (values: { [key: number]: number }): number => {
        return Object.values(values).reduce((sum, value) => sum + parseFloat(String(value)), 0);
    };

    const rowNetPayable = (data: EmployeeSalary): number => {
        return data.basic_salary + sumValues(data.salary_head_details.earnings) - sumValues(data.salary_head_details.deductions);
    }

    const rowTotalPayable = (data: EmployeeSalary): number => {
        return data.basic_salary + (sumValues(data.salary_head_details.earnings) + sumValues(data.salary_head_details.non_taxable)) - sumValues(data.salary_head_details.deductions);
    }

    const totalAllowance: number = Number(tableData.reduce(
            (total, data) => total + sumValues(data.salary_head_details.earnings),
            0
        ).toFixed(2)
    );

    const totalDeductions: number = Number(tableData.reduce(
            (total, data) => total + sumValues(data.salary_head_details.deductions),
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

    const handleVariableSalary = (value: number, tableDataIndex: number, salary_head_id: number, head_type: string) => {
        setTableData((prevTableData: EmployeeSalary[]) => {
            const newTableData = [...prevTableData];
            // @ts-ignore
            newTableData[tableDataIndex].salary_head_details[head_type][salary_head_id] = value;
            return newTableData;
        })
    }

    return (
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
                            <Button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium tracking-wide text-white capitalize bg-indigo-600 rounded hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500"
                            >
                                {__('Create Payroll', 'pcm')}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
            {tableData.length > 0 ? (
                <div className="payroll-table-container">
                {loading ? (
                    <Loading />
                ) : (
                    <table className="payroll-table">
                        <thead>
                        <tr>
                            <th rowSpan={2}>{__('Sl. No.', 'pcm')}</th>
                            <th rowSpan={2}>{__('Employee ID', 'pcm')}</th>
                            <th
                                rowSpan={2}
                                className="fixed-column"
                            >{__('Employee Name', 'pcm')}</th>
                            <th rowSpan={2}>{__('Designation', 'pcm')}</th>
                            <th rowSpan={2}>{__('Department', 'pcm')}</th>
                            <th rowSpan={3}>{__('Basic Salary', 'pcm')}</th>
                            {salaryHeads.earnings.length > 0 && (
                                <th
                                    className="salary"
                                    colSpan={salaryHeads.earnings.length}
                                >Earnings</th>
                            )}
                            <th
                                className="total_salary"
                                rowSpan={2}
                            >{__('Total Earnings', 'pcm')}</th>
                            {salaryHeads.deductions.length > 0 && (
                                <th
                                    className="deduction"
                                    colSpan={salaryHeads.deductions.length}
                                >{__('Deductions', 'pcm')}</th>
                            )}
                            <th
                                className="total_deduction"
                                rowSpan={2}
                            >{__('Total Deductions', 'pcm')}</th>
                            <th
                                className="net_payable"
                                rowSpan={2}
                            >{__('Net Payable', 'pcm')}</th>
                            {salaryHeads.non_taxable.length > 0 && (
                                <th
                                    className="non_taxable"
                                    colSpan={salaryHeads.non_taxable.length}
                                >{__('Non Taxable', 'pcm')}</th>
                            )}
                            <th
                                className="total_payable"
                                rowSpan={2}
                            >{__('Total Payable', 'pcm')}</th>
                        </tr>
                        <tr className="second-row">
                            {salaryHeads.earnings.map((earning) => (
                                <th
                                    className="salary"
                                    key={earning.id}
                                >{earning.head_name}</th>
                            ))}
                            {salaryHeads.deductions.map((deduction) => (
                                <th
                                    className="deduction"
                                    key={deduction.id}
                                >{deduction.head_name}</th>
                            ))}
                            {salaryHeads.non_taxable.map((deduction) => (
                                <th key={deduction.id}>{deduction.head_name}</th>
                            ))}
                        </tr>
                        </thead>

                        <tbody>
                        {tableData.map((data, tableDataIndex) => (
                            <tr key={data.id}>
                                <td className="text-right" key={`sl${tableDataIndex}`}>{tableDataIndex + 1}</td>
                                <td className="text-right" key={`employee_id${tableDataIndex}`}>{data.employee_id}</td>
                                <td className="text-left fixed-column" key={`employee_name${tableDataIndex}`}>{data.full_name}</td>
                                <td className="text-left" key={`designation${tableDataIndex}`}>{data.designation_name}</td>
                                <td className="text-left" key={`department${tableDataIndex}`}>{data.department_name}</td>
                                <td className="text-right" key={`basic_salary${tableDataIndex}`}>{data.basic_salary}</td>
                                {salaryHeads.earnings.map((earning) => (
                                    (parseInt(String(earning.is_variable)) === 1) ? (
                                        <input
                                            key={earning.id}
                                            type="number"
                                            name={`earnings[${data.id}][${earning.id}]`}
                                            value={data.salary_head_details.earnings[earning.id] || 0}
                                            className="text-right"
                                        />
                                    ) : (
                                        <td
                                            className="text-right"
                                            key={earning.id}
                                        >{data.salary_head_details.earnings[earning.id] || 0}</td>
                                    )
                                ))}
                                <td className="text-right total_salary" key={`total_earnings${tableDataIndex}`}>{sumValues(data.salary_head_details.earnings)}</td>
                                {salaryHeads.deductions.map((deduction) => (
                                    (parseInt(String(deduction.is_variable)) === 1) ? (
                                        <FormInput
                                            id={`non_taxable[${data.id}][${deduction.id}]`}
                                            type="number"
                                            key={deduction.id}
                                            name={`deductions[${data.id}][${deduction.id}]`}
                                            value={data.salary_head_details.deductions[deduction.id] || 0}
                                            className="text-right"
                                            onChange={(event)=>handleVariableSalary(parseInt(event.target.value), tableDataIndex, deduction.id, 'deductions')}
                                        />
                                    ) : (
                                        <td
                                            className="text-right"
                                            key={deduction.id}
                                        >{data.salary_head_details.deductions[deduction.id] || 0}</td>
                                    )
                                ))}
                                <td className="total_deduction text-right" key={`total_deductions${tableDataIndex}`}>{sumValues(data.salary_head_details.deductions)}</td>
                                <td className="net_payable text-right" key={`net_payable${tableDataIndex}`}>{rowNetPayable(data)}</td>
                                {salaryHeads.non_taxable.map((non_taxable) => (
                                        (parseInt(String(non_taxable.is_variable)) === 1) ? (
                                            <FormInput
                                                id={`non_taxable[${data.id}][${non_taxable.id}]`}
                                                type="number"
                                                key={non_taxable.id}
                                                name={`non_taxable[${data.id}][${non_taxable.id}]`}
                                                value={data.salary_head_details.non_taxable[non_taxable.id] || 0}
                                                className="text-right"
                                                onChange={(event)=>handleVariableSalary(parseInt(event.target.value), tableDataIndex, non_taxable.id, 'non_taxable')}
                                            />
                                        ) : (
                                            <td
                                                className="text-right"
                                                key={non_taxable.id}
                                            >{data.salary_head_details.non_taxable[non_taxable.id] || 0}</td>
                                        )
                                    )
                                )}
                                <td className="total_payable text-right" key={`total_payable${tableDataIndex}`}>{rowTotalPayable(data)}</td>
                            </tr>
                        ))}
                        </tbody>
                        <tfoot>
                        <tr>
                            <td
                                key={`total`}
                                className="fixed-column text-right font-bold text-xl"
                                colSpan={5}
                            >{__('Total', 'pcm')}</td>
                            <td className="text-right" key={`total_basic_salary`}>{sumValues(tableData.map((data) => data.basic_salary))}</td>
                            {salaryHeads.earnings.map((earning) => (
                                <td
                                    className="text-right"
                                    key={`total_${earning.id}`}
                                >{sumValues(tableData.map((data) => data.salary_head_details.earnings[earning.id] || 0))}</td>
                            ))}
                            <td className="total_salary text-right" key={`total_earnings`}>{totalAllowance}</td>
                            {salaryHeads.deductions.map((deduction) => (
                                <td
                                    className="text-right"
                                    key={deduction.id}
                                >{sumValues(tableData.map((data) => data.salary_head_details.deductions[deduction.id] || 0))}</td>
                            ))}
                            <td className="text-right" key={`total_deductions`}>{totalDeductions}</td>
                            <td className="text-right" key={`total_net_payable`}>{netPayable}</td>
                            {salaryHeads.non_taxable.map((non_taxable) => (
                                <td
                                    className="text-right"
                                    key={non_taxable.id}
                                >{sumValues(tableData.map((data) => data.salary_head_details.non_taxable[non_taxable.id] || 0))}</td>
                            ))}
                            <td className="text-right" key={`total_net_payable`}>{totalNetPayable}</td>
                        </tr>
                        </tfoot>
                    </table>
                )};
                </div>
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
    );
};

export default CreatePayroll;
