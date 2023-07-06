import {useEffect, useState} from "@wordpress/element";
import {
    EmployeeSalary,
    SalaryHeadsResponseType,
    SalaryResponseType,
    SelectBoxType
} from "../../Types/SalaryHeadType";
import '../../css/table.scss'
import useFetchApi, {apiFetchUnparsed} from "../../Helpers/useFetchApi";
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
import {Spinner} from "../../Components/Spinner";
import {useNavigate} from "react-router-dom";

const CreatePayroll = () => {
    const navigate = useNavigate();
    const {loading, makePostRequest,} = useFetchApi('');
    // Get initial table data from local storage
    let PayrollTableData = localStorage.getItem('Payroll.TableData');
    // @ts-ignore
    let TableData = JSON.parse(PayrollTableData) as EmployeeSalary[];

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [tableData, setTableData] = useState<EmployeeSalary[]>([]);
    const {designations} = useSelect((select) => select(designation).getDesignations({per_page: '-1', status: '1'}), []);
    const {departments} = useSelect((select) => select(department).getDepartments({per_page: '-1', status: '1'}), []);
    const [selectedDesignation, setSelectedDesignation] = useState<SelectBoxType>({} as SelectBoxType);
    const [selectedDepartment, setSelectedDepartment] = useState<SelectBoxType>({} as SelectBoxType);
    const [payDate, setPayDate] = useState(new Date().toISOString().slice(0, 10));
    const [remarks, setRemarks] = useState<string>('');

    // @ts-ignore
    const handleFilter = (e) => {
        e.preventDefault();
        setIsSubmitting(false)
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
            makePostRequest<SalaryResponseType>('/pay-check-mate/v1/payrolls', data, false).then((response) => {
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

        setSelectedDesignation(defaultDesignation)
    }, [designations]);

    useEffect(() => {
        if (departments.length <= 0) return;

        const defaultDepartment = {
            id: 0,
            name: __('All', 'pcm'),
        }

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
        return data.basic_salary + sumValues(data.salary_details.earnings) - sumValues(data.salary_details.deductions);
    }

    const rowTotalPayable = (data: EmployeeSalary): number => {
        return data.basic_salary + (sumValues(data.salary_details.earnings) + sumValues(data.salary_details.non_taxable)) - sumValues(data.salary_details.deductions);
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

    const handleVariableSalary = (value: number, tableDataIndex: number, salary_head_id: number, head_type: string) => {
        setTableData((prevTableData: EmployeeSalary[]) => {
            const newTableData = [...prevTableData];
            // @ts-ignore
            newTableData[tableDataIndex].salary_details[head_type][salary_head_id] = value;
            localStorage.setItem('Payroll.TableData', JSON.stringify(newTableData));
            return newTableData;
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true);
        try {
            // @ts-ignore
            const _wpnonce = payCheckMate.pay_check_mate_nonce;
            apiFetchUnparsed('pay-check-mate/v1/payrolls/save-payroll', {
                method: 'POST',
                parse: true,
                body: JSON.stringify({
                    'payroll_date': payDate,
                    'remarks': remarks,
                    'department_id': selectedDepartment.id,
                    'designation_id': selectedDesignation.id,
                    'employee_salary_history': tableData,
                    '_wpnonce': _wpnonce,
                }),
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then((response: any) => {
                if (response.data.code === 400){
                    toast.error(response.data.message);
                    setIsSubmitting(false);
                    return;
                }

                setIsSubmitting(false);
                setTableData([])
                localStorage.removeItem('Payroll.TableData');
                navigate('/payroll');
                toast.success(__('Payroll saved successfully', 'pcm'));
            }).catch((e: unknown) => {
                console.log(e);
                setIsSubmitting(false);
            });
        }catch (e) {
            console.log(e);
            setIsSubmitting(false);
        }
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
                            {/*This button should flat and small*/}
                            <Button
                                type="submit"
                                className="px-4 py-2 h-8 m-2 text-sm font-medium tracking-wide text-white capitalize bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500"
                            >
                                {__('Generate', 'pcm')}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
            {tableData.length > 0 ? (
                <>
                    {loading ? (
                        <Loading />
                    ) : (
                        <div className="payroll-table-container">
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
                                    <td
                                        className="text-right"
                                        key={`sl${tableDataIndex}`}
                                    >{tableDataIndex + 1}</td>
                                    <td
                                        className="text-right"
                                        key={`employee_id${tableDataIndex}`}
                                    >{data.employee_id}</td>
                                    <td
                                        className="text-left fixed-column"
                                        key={`employee_name${tableDataIndex}`}
                                    >{data.full_name}</td>
                                    <td
                                        className="text-left"
                                        key={`designation${tableDataIndex}`}
                                    >{data.designation_name}</td>
                                    <td
                                        className="text-left"
                                        key={`department${tableDataIndex}`}
                                    >{data.department_name}</td>
                                    <td
                                        className="text-right"
                                        key={`basic_salary${tableDataIndex}`}
                                    >{data.basic_salary}</td>
                                    {salaryHeads.earnings.map((earning) => (
                                        <td
                                            className="text-right"
                                            key={earning.id}
                                        >{(parseInt(String(earning.is_variable)) === 1) ? (
                                            <FormInput
                                                id={`earnings[${data.id}][${earning.id}]`}
                                                key={earning.id}
                                                type="number"
                                                name={`earnings[${data.id}][${earning.id}]`}
                                                value={data.salary_details.earnings[earning.id] || (TableData && TableData[tableDataIndex].salary_details.earnings[earning.id]) || 0}
                                                onChange={(event) => handleVariableSalary(parseInt(event.target.value), tableDataIndex, earning.id, 'earnings')}
                                            />
                                        ) : (
                                            data.salary_details.earnings[earning.id] || 0
                                        )}
                                        </td>
                                    ))}
                                    <td
                                        className="text-right total_salary"
                                        key={`total_earnings${tableDataIndex}`}
                                    >{sumValues(data.salary_details.earnings)}</td>
                                    {salaryHeads.deductions.map((deduction) => (
                                        <td
                                            className="text-right"
                                            key={deduction.id}
                                        >{(parseInt(String(deduction.is_variable)) === 1) ? (
                                            <FormInput
                                                id={`deductions[${data.id}][${deduction.id}]`}
                                                type="number"
                                                key={deduction.id}
                                                name={`deductions[${data.id}][${deduction.id}]`}
                                                value={data.salary_details.deductions[deduction.id] || (TableData && TableData[tableDataIndex].salary_details.deductions[deduction.id]) || 0}
                                                onChange={(event) => handleVariableSalary(parseInt(event.target.value), tableDataIndex, deduction.id, 'deductions')}
                                            />
                                        ) : (
                                            data.salary_details.deductions[deduction.id] || 0
                                        )}
                                        </td>
                                    ))}
                                    <td
                                        className="total_deduction text-right"
                                        key={`total_deductions${tableDataIndex}`}
                                    >{sumValues(data.salary_details.deductions)}</td>
                                    <td
                                        className="net_payable text-right"
                                        key={`net_payable${tableDataIndex}`}
                                    >{rowNetPayable(data)}</td>
                                    {salaryHeads.non_taxable.map((non_taxable) => (
                                        <td
                                            className="text-right"
                                            key={non_taxable.id}
                                        >{(parseInt(String(non_taxable.is_variable)) === 1) ? (
                                            <FormInput
                                                id={`non_taxable[${data.id}][${non_taxable.id}]`}
                                                type="number"
                                                key={non_taxable.id}
                                                name={`non_taxable[${data.id}][${non_taxable.id}]`}
                                                value={data.salary_details.non_taxable[non_taxable.id] || (TableData && TableData[tableDataIndex].salary_details.non_taxable[non_taxable.id]) || 0}
                                                onChange={(event) => handleVariableSalary(parseInt(event.target.value), tableDataIndex, non_taxable.id, 'non_taxable')}
                                            />
                                        ) : (
                                            data.salary_details.non_taxable[non_taxable.id] || 0
                                        )}
                                        </td>
                                    ))}
                                    <td
                                        className="total_payable text-right"
                                        key={`total_payable${tableDataIndex}`}
                                    >{rowTotalPayable(data)}</td>
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
                                <td
                                    className="text-right"
                                    key={`total_basic_salary`}
                                >{sumValues(tableData.map((data) => data.basic_salary))}</td>
                                {salaryHeads.earnings.map((earning) => (
                                    <td
                                        className="text-right"
                                        key={`total_${earning.id}`}
                                    >{sumValues(tableData.map((data) => data.salary_details.earnings[earning.id] || 0))}</td>
                                ))}
                                <td
                                    className="total_salary text-right"
                                    key={`total_earnings`}
                                >{totalAllowance}</td>
                                {salaryHeads.deductions.map((deduction) => (
                                    <td
                                        className="text-right"
                                        key={deduction.id}
                                    >{sumValues(tableData.map((data) => data.salary_details.deductions[deduction.id] || 0))}</td>
                                ))}
                                <td
                                    className="text-right"
                                    key={`total_deductions`}
                                >{totalDeductions}</td>
                                <td
                                    className="text-right"
                                    key={`non_taxable`}
                                >{netPayable}</td>
                                {salaryHeads.non_taxable.map((non_taxable) => (
                                    <td
                                        className="text-right"
                                        key={non_taxable.id}
                                    >{sumValues(tableData.map((data) => data.salary_details.non_taxable[non_taxable.id] || 0))}</td>
                                ))}
                                <td
                                    className="text-right"
                                    key={`total_net_payable`}
                                >{totalNetPayable}</td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                    )}
                    <div className="flex justify-end mt-4">
                        <textarea
                            className="form-input w-full"
                            name="remarks"
                            id="remarks"
                            placeholder={__('Remarks', 'pcm')}
                            value={remarks}
                            onChange={(event) => setRemarks(event.target.value)}
                        />
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            type="submit"
                            className={isSubmitting ? 'btn-primary inline-flex items-center px-4 py-2 btn-disabled cursor-not-allowed' : 'btn btn-primary'}
                            disabled={isSubmitting}
                            onClick={(event: any) => {
                                handleSubmit(event)
                            }}
                        >
                            {isSubmitting ? (
                                <>
                                {__('Submitting...', 'pcm')}<Spinner />
                            </>
                            ) : __('Save', 'pcm')}
                        </button>
                    </div>
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
    );
};

export default CreatePayroll;
