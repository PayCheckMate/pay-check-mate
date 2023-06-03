import React, {useEffect, useState} from "@wordpress/element";
import {EmployeeSalary, HeadType, SalaryHeadsResponseType} from "../../Types/SalaryHeadType";
import '../../css/table.scss'
import useFetchApi from "../../Helpers/useFetchApi2";

const CreatePayroll = () => {
    const {
        models,
        loading,
        makePostRequest,
        filterObject,
        setFilterObject,
    } = useFetchApi<SalaryHeadsResponseType>('/pay-check-mate/v1/payroll');
    const [tableData, setTableData] = useState<EmployeeSalary[]>([]);
    useEffect(() => {
        if (models) {
            console.log(models)
        }
        try {
            makePostRequest<any>('', {'date': '2023-05-01'}, false).then((data) => {
                const earning_types = Object.values(data.salary_head_types.earnings).map(item => item);
                const deduction_types = Object.values(data.salary_head_types.deductions).map(item => item);
                const non_taxable_types = Object.values(data.salary_head_types.non_taxable).map(item => item);
                const salary_heads = {
                    earnings: earning_types,
                    deductions: deduction_types,
                    nonTaxable: non_taxable_types,
                }
                setSalaryHeads(salary_heads)
            }).catch((e: unknown) => {
                console.log(e);
            })
        } catch (error) {
            console.log(error); // Handle the error accordingly
        }
    }, [filterObject]);



    const [salaryHeads, setSalaryHeads] = useState<SalaryHeadsResponseType>({
        earnings: [
            {
                id: 2,
                head_name: 'House Rent',
                head_type: HeadType.Earning,
                priority: 1,
            },
            {
                id: 3,
                head_name: 'Medical',
                head_type: HeadType.Earning,
                priority: 2,
            },
            {
                id: 4,
                head_name: 'Conveyance',
                head_type: HeadType.Earning,
                priority: 3,
            },
            {
                id: 5,
                head_name: 'Provident Fund',
                head_type: HeadType.Earning,
                priority: 4,
            },
        ],
        deductions: [
            {
                id: 9,
                head_name: 'Provident Fund',
                head_type: HeadType.Deduction,
                priority: 1,
            },
            {
                id: 10,
                head_name: 'Medical',
                head_type: HeadType.Deduction,
                priority: 2,
            },
            {
                id: 12,
                head_name: 'Tax',
                head_type: HeadType.Deduction,
                priority: 3,
            },
            {
                id: 11,
                head_name: 'Ticks',
                head_type: HeadType.Deduction,
                priority: 4,
            },
        ],
        nonTaxable: [
            {
                id: 13,
                head_name: 'Mobile',
                head_type: HeadType.NonTaxable,
                priority: 1,
            },
            {
                id: 14,
                head_name: 'Lunch',
                head_type: HeadType.NonTaxable,
                priority: 2,
            },
            {
                id: 15,
                head_name: 'Transport',
                head_type: HeadType.NonTaxable,
                priority: 3,
            }

        ]
    });


    // for (let i = 1; i <= 100; i++) {
    //     const data: EmployeeSalary = {
    //         id: i,
    //         employeeName: "Ratul Hasan",
    //         designation: "Software Engineer",
    //         department: "Engineering",
    //         basic: 62500,
    //         allowance: {
    //             2: 25000,
    //             3: 15000,
    //             4: 5000,
    //             5: 5500,
    //         },
    //         totalAllowance: 50500,
    //         deductions: {
    //             9: 5500,
    //             10: 250,
    //             11: 10,
    //             12: 5000,
    //         },
    //         totalDeductions: 10760,
    //         netPayable: 102240,
    //         nonTaxableAllowance: {
    //             13: 500,
    //             14: 1000,
    //             15: 2000,
    //         },
    //         totalPayable: 105740,
    //     };
    //
    //     tableData.push(data);
    // }
    const sumValues = (values: { [key: number]: number }): number => {
        return Object.values(values).reduce((sum, value) => sum + value, 0);
    };

    const totalAllowance: number = tableData.reduce(
        (total, data) => total + data.totalAllowance,
        0
    );

    const totalDeductions: number = tableData.reduce(
        (total, data) => total + data.totalDeductions,
        0
    );

    const totalNetPayable: number = tableData.reduce(
        (total, data) => total + data.netPayable,
        0
    );

    const totalPayable: number = tableData.reduce(
        (total, data) => total + data.totalPayable,
        0
    );

    return (
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
                    <th className="non_taxable" colSpan={salaryHeads.nonTaxable.length}>Non-Taxable Allowance</th>
                    <th className="total_payable" rowSpan={2}>Total Payable</th>
                </tr>
                <tr className="second-row">
                    {salaryHeads.earnings.map((earning) => (
                        <th className="salary" key={earning.id}>{earning.head_name}</th>
                    ))}
                    {salaryHeads.deductions.map((deduction) => (
                        <th className='deduction' key={deduction.id}>{deduction.head_name}</th>
                    ))}
                    {salaryHeads.nonTaxable.map((deduction) => (
                        <th key={deduction.id}>{deduction.head_name}</th>
                    ))}
                </tr>
                </thead>

                <tbody>
                {tableData.map((data, index) => (
                    <tr key={data.id}>
                        <td className="text-right">{data.id}</td>
                        <td className="text-left fixed-column">{data.employeeName}</td>
                        <td className="text-left">{data.designation}</td>
                        <td className="text-left">{data.department}</td>
                        <td className="text-left">{data.basic}</td>
                        {/* Loop over data.allowance */}
                        {Object.entries(data.salary_head_details.allowance).map(([key, value]) => (
                            <td className="text-right" key={key}>{value}</td>
                        ))}
                        <td className="text-right total_salary">{data.totalAllowance}</td>
                        {/* Loop over data.deductions */}
                        {Object.entries(data.salary_head_details.deductions).map(([key, value]) => (
                            <td className="text-right" key={key}>{value}</td>
                        ))}
                        <td className="total_deduction text-right">{data.totalDeductions}</td>
                        <td className="net_payable text-right">{data.netPayable}</td>
                        {/* Loop over data.nonTaxableAllowance */}
                        {Object.entries(data.salary_head_details.nonTaxableAllowance).map(([key, value]) => (
                            <td className="text-right" key={key}>{value}</td>
                        ))}
                        <td className="total_payable text-right">{data.totalPayable}</td>
                    </tr>
                ))}
                </tbody>
                <tfoot>
                <tr>
                    <td className="fixed-column" colSpan={4}>Total:</td>
                    <td className="text-right">{sumValues(tableData.map((data) => data.basic))}</td>
                    {salaryHeads.earnings.map((earning) => (
                        <td className="text-right" key={earning.id}>{sumValues(tableData.map((data) => data.allowance[earning.id] || 0))}</td>
                    ))}
                    <td className="total_salary text-right">{totalAllowance}</td>
                    {/* Loop over salaryHeads.deductions */}
                    {salaryHeads.deductions.map((deduction) => (
                        <td className="text-right" key={deduction.id}>{sumValues(tableData.map((data) => data.deductions[deduction.id] || 0))}</td>
                    ))}
                    <td className="text-right">{totalDeductions}</td>
                    <td className="text-right">{totalNetPayable}</td>
                    {/* Loop over salaryHeads.nonTaxable */}
                    {salaryHeads.nonTaxable.map((deduction) => (
                        <td className="text-right" key={deduction.id}>{sumValues(tableData.map((data) => data.nonTaxableAllowance[deduction.id] || 0))}</td>
                    ))}
                    <td className="text-right">{totalPayable}</td>
                </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default CreatePayroll;
