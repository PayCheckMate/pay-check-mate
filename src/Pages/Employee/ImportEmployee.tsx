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
import {useState} from "@wordpress/element";
import {SelectBoxType} from "../../Types/SalaryHeadType";

export const ImportEmployee = () => {
    const {salaryHeads} = useSelect((select) => select(salaryHead).getSalaryHeads({per_page: '-1', status: '1', order_by: 'head_type', order: 'ASC'}), []);
    const [downloadOptions, setDownloadOptions] = useState([
        {name: 'CSV', id: 'csv'},
        {name: 'Excel', id: 'excel'}
    ] as SelectBoxType[]);
    const [selectedOption, setSelectedOption] = useState(downloadOptions[0]);

    const downloadFile = () => {
        if (downloadOptions[0].id === 'csv') {
            downloadCSV();
        } else {
            downloadExcel();
        }
    }

    const downloadCSV = () => {
        const csvData = [];
        // Adding header row to CSV
        const headerRow = salaryHeads.map((head) => head.head_name + (head.head_type_text ? ` (${head.head_type_text})` : ''));
        csvData.push([
            __('First name', 'pcm'),
            __('Last name', 'pcm'),
            __('Designation id', 'pcm'),
            __('Department id', 'pcm'),
            __('Employee id', 'pcm'),
            __('Email', 'pcm'),
            __('Phone number', 'pcm'),
            __('Bank name', 'pcm'),
            __('Bank account number', 'pcm'),
            __('Tax number', 'pcm'),
            __('Joining date', 'pcm'),
            __('Address', 'pcm'),
            __('Gross salary', 'pcm'),
            __('Basic salary', 'pcm'),
            ...headerRow,
            __('Salary active from', 'pcm'),
            __('Remarks', 'pcm')
        ]);

        // Adding data rows to CSV
        const dataRow = [
            'John', 'Doe', '1', '1', '1', 'johndoe@example.com', '1234567890', 'Bank name', '1234567890', '1234567890', '2021-01-01', 'Address',
            '10000', '1000', ...Array(salaryHeads.length).fill('100'), '2021-01-01', 'Remarks'
        ];
        csvData.push(dataRow);

        // Create CSV content
        const csvContent = csvData.map(row => row.join(',')).join('\n');

        // Create a Blob object from the CSV content
        const blob = new Blob([csvContent], {type: 'text/csv'});

        // Create a download link and trigger click event
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'payroll_data.csv';
        a.click();
    };

    const downloadExcel = () => {
        const excelData = [];

        // Adding header row to Excel
        const headerRow = salaryHeads.map((head) => head.head_name + (head.head_type_text ? ` (${head.head_type_text})` : ''));
        excelData.push([
            __('First name', 'pcm'),
            __('Last name', 'pcm'),
            __('Designation id', 'pcm'),
            __('Department id', 'pcm'),
            __('Employee id', 'pcm'),
            __('Email', 'pcm'),
            __('Phone number', 'pcm'),
            __('Bank name', 'pcm'),
            __('Bank account number', 'pcm'),
            __('Tax number', 'pcm'),
            __('Joining date', 'pcm'),
            __('Address', 'pcm'),
            __('Gross salary', 'pcm'),
            __('Basic salary', 'pcm'),
            ...headerRow,
            __('Salary active from', 'pcm'),
            __('Remarks', 'pcm')
        ]);

        // Adding data row to Excel
        const dataRow = [
            'John', 'Doe', '1', '1', '1', 'johndoe@example.com', '1234567890', 'Bank name', '1234567890', '1234567890', '2021-01-01', 'Address',
            '10000', '1000', ...Array(salaryHeads.length).fill('100'), '2021-01-01', 'Remarks'
        ];
        excelData.push(dataRow);

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
        a.download = 'payroll_data.xlsx';
        a.click();
    };

    return (
        <HOC role={UserCapNames.pay_check_mate_approve_payroll}>
            <div>
                <div className="sm:flex-auto mb-6">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">
                        {__('Import Employee', 'pcm')}
                    </h1>
                </div>
                <Card>
                    <div className="payroll-table-container">
                        <div className="flex justify-between mb-6 gap-4">
                            <div>
                                <p className="text-base leading-6 text-gray-900">
                                    {__('According to the following format, import the employee data in CSV format. Shown bellow is based on your salary heads.', 'pcm')}
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
                                    {__('Download sample file', 'pcm')}
                                </Button>
                            </div>
                        </div>
                        <table className="payroll-table">
                            <thead>
                                <tr>
                                    <th>{__('First name', 'pcm')}</th>
                                    <th>{__('Last name', 'pcm')}</th>
                                    <th>{__('Designation id', 'pcm')}</th>
                                    <th>{__('Department id', 'pcm')}</th>
                                    <th>{__('Employee id', 'pcm')}</th>
                                    <th>{__('Email', 'pcm')}</th>
                                    <th>{__('Phone number', 'pcm')}</th>
                                    <th>{__('Bank name', 'pcm')}</th>
                                    <th>{__('Bank account number', 'pcm')}</th>
                                    <th>{__('Tax number', 'pcm')}</th>
                                    <th>{__('Joining date', 'pcm')}</th>
                                    <th>{__('Address', 'pcm')}</th>
                                    <th>{__('Gross salary', 'pcm')}</th>
                                    <th>{__('Basic salary', 'pcm')}</th>
                                    {salaryHeads.map((head) => (
                                        <th>{head.head_name + (head.head_type_text ? ` (${head.head_type_text})` : '')}</th>
                                    ))}
                                    <th>{__('Salary active from', 'pcm')}</th>
                                    <th>{__('Remarks', 'pcm')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>John</td>
                                    <td>Doe</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>johndoe@example.com</td>
                                    <td>1234567890</td>
                                    <td>Bank name</td>
                                    <td>1234567890</td>
                                    <td>1234567890</td>
                                    <td>2021-01-01</td>
                                    <td>Address</td>
                                    <td>10000</td>
                                    <td>1000</td>
                                    {salaryHeads.map((head) => (
                                        <td>100</td>
                                    ))}
                                    <td>2021-01-01</td>
                                    <td>Remarks</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </HOC>
    )
}
