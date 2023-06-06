import React, {useEffect, useState} from "@wordpress/element";
import {EmployeeSalary, SalaryHeadsResponseType, SalaryResponseType} from "../../Types/SalaryHeadType";
import '../../css/table.scss'
import useFetchApi from "../../Helpers/useFetchApi2";
import {Loading} from "../../Components/Loading";

const CreatePayroll = () => {
    const {
        models,
        loading,
        makePostRequest,
        filterObject,
        setFilterObject,
    } = useFetchApi<SalaryResponseType>('/pay-check-mate/v1/payroll');
    const [tableData, setTableData] = useState<EmployeeSalary[]>([]);
    const [designation, setDesignation] = useState('');
    const [department, setDepartment] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // @ts-ignore
    const handleFilter = (e) => {
        e.preventDefault();

        // Perform filtering logic based on the selected filters
        // You can pass the filter values to a parent component or trigger an API call here
        console.log('Filter values:', designation, department, startDate, endDate);
    };
    useEffect(() => {
        if (models) {
            console.log(models)
        }
        try {
            makePostRequest<any>('', {'date': '2023-06-01'}, false).then((data) => {
                console.log(data)
                const earning_types = Object.values(data.salary_head_types.earnings).map(item => item);
                const deduction_types = Object.values(data.salary_head_types.deductions).map(item => item);
                const non_taxable_types = Object.values(data.salary_head_types.non_taxable).map(item => item);
                const salary_heads = {
                    earnings: earning_types,
                    deductions: deduction_types,
                    non_taxable: non_taxable_types,
                }
                setSalaryHeads(salary_heads)
                setTableData(data.employee_salary_history)
            }).catch((e: unknown) => {
                console.log(e);
            })
        } catch (error) {
            console.log(error); // Handle the error accordingly
        }
    }, [filterObject]);


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
                                    <label className="block mb-1 font-medium">Designation</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                        value={designation}
                                        onChange={(e) => setDesignation(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium">Department</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium">Pay month</label>
                                    <input
                                        type="date"
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>

                                {/*Small button*/}
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
                                    <td className="text-right">{data.id}</td>
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
                </>
            )}
        </>
    );
};

export default CreatePayroll;
