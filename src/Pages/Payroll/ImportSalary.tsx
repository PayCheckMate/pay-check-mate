import {HOC} from "../../Components/HOC";
import {UserCapNames} from "../../Types/UserType";
import {Card} from "../../Components/Card";
import {__} from "@wordpress/i18n";
import {useSelect} from "@wordpress/data";
import salaryHead from "../../Store/SalaryHead";
import {Button} from "../../Components/Button";
import {DocumentArrowDownIcon} from "@heroicons/react/24/outline";
import * as XLSX from 'xlsx';
import {SelectBox} from "../../Components/SelectBox";
import {useEffect, useState} from "@wordpress/element";
import {SelectBoxType} from "../../Types/SalaryHeadType";
import DragAndDrop from "../../Components/DragAndDrop";
import {toast} from "react-toastify";
import useFetchApi from "../../Helpers/useFetchApi";
import {EmployeeType} from "../../Types/EmployeeType";

interface ImportSalaryProps {
    setVariableSalary: (variableSalary: any) => void;
}
export const ImportSalary = ({setVariableSalary}: ImportSalaryProps) => {
    const {salaryHeads} = useSelect((select) => select(salaryHead).getSalaryHeads({per_page: '-1', status: '1', order_by: 'head_type', order: 'ASC'}), []);
    const [fileData, setFileData] = useState([] as any[]);
    const [salaries, setSalaries] = useState([] as any[]);
    const [employees, setEmployees] = useState([] as EmployeeType[]);
    const [downloadOptions, setDownloadOptions] = useState([
        {id: 1, name: 'CSV'},
        {id: 2, name: 'Excel'}
    ] as SelectBoxType[]);
    const [selectedOption, setSelectedOption] = useState(downloadOptions[0]);

    const {models,} = useFetchApi<EmployeeType>('/pay-check-mate/v1/employees', {per_page: '-1', status: 1}, true);
    useEffect(() => {
        if (models) {
            setEmployees(models);
        }
    }, [models]);

    // Set salary head which is variable
    const headerRow = salaryHeads.filter((head) => parseInt(String(head.is_variable)) === 1).map((head) => head.head_name);
    const headers = [
        __('Employee id', 'pcm'),
        ...headerRow,
    ]

    const totalHeadRowToBe = headers.length;
    const getSampleData = () => {
        const data = [];
        data.push(headers);

        employees.forEach((employee, index) => {
            const dataRow = [
                employee.employee_id,...Array(headerRow.length).fill('0')
            ];
            data.push(dataRow);
        });

        return data;
    }

    const [exportSalaries, setExportSalaries] = useState([] as any[]);
    useEffect(() => {
        setSalaries([]); // Reset salaries when CSV or Excel data changes
        if (fileData.length > 0) {
            // Set salary as key is head id and value is amount
            setSalaries(prevSalaries => {
                const salaries = [] as any;
                return prevSalaries.concat(
                    fileData.filter((data: any) => {
                        if (data.length !== totalHeadRowToBe) {
                            toast.error(__('File is not formatted properly. Please check the sample file.', 'pcm'));
                            setFileData([]);
                            return false;
                        }
                        // Remove header row.
                        if (data[0] !== 'Employee id'){
                            // Set ExportSalaries as key is salary head id and value is amount
                            salaryHeads.forEach((head) => {
                                const salary = data[headerRow.indexOf(head.head_name) + 1];
                                if (headerRow.includes(head.head_name)) {
                                    salaries.push({
                                        employee_id: data[0],
                                        [head.id]: salary
                                    })
                                }
                            });
                            console.log(salaries, 'salaries')
                            return true;
                        }
                    })
                );
            });
        }
    }, [fileData]);
    console.log(exportSalaries, 'exportSalaries')
    const downloadFile = () => {
        if (selectedOption.id === 1) {
            downloadCSV();
        } else {
            downloadExcel();
        }
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
        a.download = 'sample_salary_' + new Date().toISOString().slice(0, 10) + '.csv';
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
        a.download = 'sample_employee_' + new Date().toISOString().slice(0, 10) + '.xlsx';
        a.click();
    };

    const importVariableSalary = () => {
        if (salaries.length === 0) {
            toast.error(__('Please upload a file first.', 'pcm'));
            return;
        }
        setVariableSalary(salaries);
    }
    return (
        <HOC role={UserCapNames.pay_check_mate_approve_payroll}>
            <div>
                <div className="flex justify-start sm:flex-auto mb-6">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">
                        {__('Import Variable Salary', 'pcm')}
                    </h1>
                </div>
                <Card>
                    <div className="payroll-table-container">
                        <div className="flex justify-between mb-6 gap-4">
                            <div>
                                <p className="text-base leading-6 text-gray-900">
                                    {__('Import salary data in CSV or Excel format following the structure of sample file. The fields are aligned with your salary heads.', 'pcm')}
                                </p>
                                <p className="text-gray-600">
                                    {__('Note: The first row of the CSV file must be the column name.', 'pcm')}
                                </p>
                            </div>
                            <div className="flex justify-between gap-6">
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
                                    <DocumentArrowDownIcon
                                        className="w-5 h-5 mr-2 -ml-1 text-white"
                                        aria-hidden="true"
                                    />
                                    {__('Download sample', 'pcm')}
                                </Button>
                            </div>
                        </div>
                        <div>
                            <DragAndDrop setFileData={(data: any) => setFileData(data)} />
                        </div>
                    </div>
                    <div className="flex justify-end mt-12">
                        {salaries.length > 0 && (
                            <div className="payroll-table-container h-full">
                                <table className="payroll-table">
                                <thead>
                                    <tr>
                                        <th>{__('SL', 'pcm')}</th>
                                        <th>{__('Employee id', 'pcm')}</th>
                                        {headerRow.map((head, index) => (
                                            <th key={index}>{head}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {salaries.map((employee, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            {Object.keys(employee).map((key, index) => (
                                                <td key={index}>{employee[key]}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        )}
                    </div>
                    {salaries.length > 0 && (
                        <>
                            <div className="flex items-center justify-end gap-x-6 py-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSalaries([]);
                                        setFileData([]);
                                    }}
                                    className="text-sm font-semibold leading-6 text-gray-900 btn-cancel"
                                >
                                    {__('Reset', 'pcm')}
                                </button>
                                <Button
                                    onClick={() => importVariableSalary()}
                                    className="btn-primary"
                                >
                                    {__('Import', 'pcm')}
                                </Button>
                            </div>
                        </>
                    )}
                </Card>
            </div>
        </HOC>
    )
}
