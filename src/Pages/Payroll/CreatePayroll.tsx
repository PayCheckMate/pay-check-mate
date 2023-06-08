import React, {useEffect, useState} from "@wordpress/element";
import {EmployeeSalary, SalaryHeadsResponseType, SalaryResponseType, SelectBoxType} from "../../Types/SalaryHeadType";
import '../../css/table.scss'
import useFetchApi from "../../Helpers/useFetchApi";
import {Loading} from "../../Components/Loading";
import {SelectBox} from "../../Components/SelectBox";
import {__} from "@wordpress/i18n";
import {DesignationType} from "../../Types/DesignationType";
import {FormInput} from "../../Components/FormInput";
import {DepartmentType} from "../../Types/DepartmentType";
import {EmptyState} from "../../Components/EmptyState";
import {Card} from "../../Components/Card";
import {CurrencyDollarIcon} from "@heroicons/react/24/outline";

const CreatePayroll = () => {
    const {
        models,
        loading,
        makeGetRequest,
        makePostRequest,
        filterObject,
        setFilterObject,
    } = useFetchApi<SalaryResponseType>('/pay-check-mate/v1/payroll', {}, false);
    const [tableData, setTableData] = useState<EmployeeSalary[]>([]);
    const [designations, setDesignations] = useState<DesignationType[]>([]);
    const [departments, setDepartments] = useState<DepartmentType[]>([]);
    const [selectedDesignation, setSelectedDesignation] = useState<SelectBoxType>({} as SelectBoxType);
    const [selectedDepartment, setSelectedDepartment] = useState<SelectBoxType>({} as SelectBoxType);
    const [payDate, setPayDate] = useState('');
    const [payDateError, setPayDateError] = useState('');

    // @ts-ignore
    const handleFilter = (e) => {
        e.preventDefault();
        try {
            if (!payDate) {
                setPayDateError(__('Please select a date', 'pay-check-mate'));
                return;
            }
            const data = {
                'date': payDate,
                'department_id': selectedDepartment.id,
                'designation_id': selectedDesignation.id,
            }
            makePostRequest<SalaryResponseType>('', data, false).then((response) => {
                const earning_types = Object.values(response.salary_head_types.earnings).map(item => item);
                const deduction_types = Object.values(response.salary_head_types.deductions).map(item => item);
                const non_taxable_types = Object.values(response.salary_head_types.non_taxable).map(item => item);
                const salary_heads = {
                    earnings: earning_types,
                    deductions: deduction_types,
                    non_taxable: non_taxable_types,
                }
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
        const data = {
            'per_page': '-1',
        }
        makeGetRequest('/pay-check-mate/v1/designations', data).then((data: any) => {
            const defaultDesignation = {
                id: 0,
                name: __('All', 'pcm'),
            }
            let designation = data.data.map((item: DesignationType) => {
                return {
                    id: item.id,
                    name: item.name,
                }
            })

            designation = [defaultDesignation, ...designation];
            setDesignations(designation);
            setSelectedDesignation(defaultDesignation)
        }).catch((e: unknown) => {
            console.log(e, 'error');
        })
        makeGetRequest('/pay-check-mate/v1/departments', data).then((data: any) => {
            const defaultDepartment = {
                id: 0,
                name: __('All', 'pcm'),
            }
            let department = data.data.map((item: DepartmentType) => {
                return {
                    id: item.id,
                    name: item.name,
                }
            })

            department = [defaultDepartment, ...department];
            setDepartments(department);
            setSelectedDepartment(defaultDepartment)
        }).catch((e: unknown) => {
            console.log(e, 'error');
        })
    }, []);
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

    return (
        <>
            {loading ? (
                <Loading />
            ) : (

                <>
                    <div className="flex justify-between">
                        <form className="p-6" onSubmit={handleFilter}>
                            <div className="grid grid-cols-4 gap-4">
                                <div>
                                    <SelectBox title={__('Designation', 'pcm')} options={designations} selected={selectedDesignation} setSelected={(selectedDesignation) => setSelectedDesignation(selectedDesignation)} />
                                </div>
                                <div>
                                    <SelectBox title={__('Department', 'pcm')} options={departments} selected={selectedDepartment} setSelected={(selectedDepartment) => setSelectedDepartment(selectedDepartment)} />
                                </div>
                                <div>
                                    <FormInput
                                        type="date"
                                        label={__('Pay month', 'pcm')}
                                        name="pay_month"
                                        id="pay_month"
                                        value={payDate}
                                        onChange={(e) => setPayDate(e.target.value)}
                                        error={payDateError}
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium tracking-wide text-white capitalize bg-blue-600 rounded hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
                                    >
                                        Filter
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    {tableData.length > 0 ? (
                        <div className="payroll-table-container">
                            <table className="payroll-table">
                                <thead>
                                <tr>
                                    <th rowSpan={2}>Sl</th>
                                    <th rowSpan={2} className="fixed-column">Employee Name</th>
                                    <th rowSpan={2}>Designation</th>
                                    <th rowSpan={2}>Department</th>
                                    <th rowSpan={3}>Basic</th>
                                    <th className="salary" colSpan={salaryHeads.earnings.length}>Salary</th>
                                    <th className="total_salary" rowSpan={2}>Total Allowance</th>
                                    <th className="deduction" colSpan={salaryHeads.deductions.length}>Deductions</th>
                                    <th className="total_deduction" rowSpan={2}>Total Deductions</th>
                                    <th className="net_payable" rowSpan={2}>Net Payable</th>
                                    <th className="non_taxable" colSpan={salaryHeads.non_taxable.length}>Non-Taxable Allowance</th>
                                    <th className="total_payable" rowSpan={2}>Total Payable</th>
                                </tr>
                                <tr className="second-row">
                                    {salaryHeads.earnings.map((earning) => (
                                        <th className="salary" key={earning.id}>{earning.head_name}</th>
                                    ))}
                                    {salaryHeads.deductions.map((deduction) => (
                                        <th className="deduction" key={deduction.id}>{deduction.head_name}</th>
                                    ))}
                                    {salaryHeads.non_taxable.map((deduction) => (
                                        <th key={deduction.id}>{deduction.head_name}</th>
                                    ))}
                                </tr>
                                </thead>

                                <tbody>
                                {tableData.map((data, index) => (
                                    <tr key={data.id}>
                                        <td className="text-right">{index + 1}</td>
                                        <td className="text-left fixed-column">{data.full_name}</td>
                                        <td className="text-left">{data.designation_name}</td>
                                        <td className="text-left">{data.department_name}</td>
                                        <td className="text-right">{data.basic_salary}</td>
                                        {salaryHeads.earnings.map((earning) => (
                                            <td className="text-right" key={earning.id}>{data.salary_head_details.earnings[earning.id] || 0}</td>
                                        ))}
                                        <td className="text-right total_salary">{sumValues(data.salary_head_details.earnings)}</td>
                                        {salaryHeads.deductions.map((deduction) => (
                                            <td className="text-right" key={deduction.id}>{data.salary_head_details.deductions[deduction.id] || 0}</td>
                                        ))}
                                        <td className="total_deduction text-right">{sumValues(data.salary_head_details.deductions)}</td>
                                        <td className="net_payable text-right">{rowNetPayable(data)}</td>
                                        {salaryHeads.non_taxable.map((non_taxable) => (
                                            <td className="text-right" key={non_taxable.id}>{data.salary_head_details.non_taxable[non_taxable.id] || 0}</td>
                                        ))}
                                        <td className="total_payable text-right">{rowTotalPayable(data)}</td>
                                    </tr>
                                ))}
                                </tbody>
                                <tfoot>
                                <tr>
                                    <td className="fixed-column" colSpan={4}>Total:</td>
                                    <td className="text-right">{sumValues(tableData.map((data) => data.basic_salary))}</td>
                                    {salaryHeads.earnings.map((earning) => (
                                        <td className="text-right" key={earning.id}>{sumValues(tableData.map((data) => data.salary_head_details.earnings[earning.id] || 0))}</td>
                                    ))}
                                    <td className="total_salary text-right">{totalAllowance}</td>
                                    {salaryHeads.deductions.map((deduction) => (
                                        <td className="text-right" key={deduction.id}>{sumValues(tableData.map((data) => data.salary_head_details.deductions[deduction.id] || 0))}</td>
                                    ))}
                                    <td className="text-right">{totalDeductions}</td>
                                    <td className="text-right">{netPayable}</td>
                                    {salaryHeads.non_taxable.map((deduction) => (
                                        <td className="text-right" key={deduction.id}>{sumValues(tableData.map((data) => data.salary_head_details.non_taxable[deduction.id] || 0))}</td>
                                    ))}
                                    <td className="text-right">{totalNetPayable}</td>
                                </tr>
                                </tfoot>
                            </table>
                        </div>
                    ) : (
                        <Card>
                            <EmptyState
                                title={__('Payroll Sheet', 'pcm')}
                                description={__('Select department or designation and pay month to view payroll list', 'pcm')}
                                icon={<CurrencyDollarIcon className="w-6 h-6 text-red-600" aria-hidden="true" />}
                            />
                        </Card>
                    )}
                </>
            )}
        </>
    );
};

export default CreatePayroll;
