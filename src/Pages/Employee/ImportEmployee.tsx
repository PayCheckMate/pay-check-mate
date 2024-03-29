import {HOC} from "../../Components/HOC";
import {UserCapNames} from "../../Types/UserType";
import {Card} from "../../Components/Card";
import {__} from "@wordpress/i18n";
import {useSelect} from "@wordpress/data";
import salaryHead from "../../Store/SalaryHead";
import {Button} from "../../Components/Button";
import {ArrowDownTrayIcon} from "@heroicons/react/24/outline";
import * as XLSX from 'xlsx';
import {SelectBox} from "../../Components/SelectBox";
import {useEffect, useState} from "@wordpress/element";
import {SelectBoxType} from "../../Types/SalaryHeadType";
import DragAndDrop from "../../Components/DragAndDrop";
import apiFetch from "@wordpress/api-fetch";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {getNonce} from "../../Helpers/Helpers";

export const ImportEmployee = () => {
    const navigate = useNavigate();
    const {salaryHeads} = useSelect((select) => select(salaryHead).getSalaryHeads({per_page: '-1', status: '1', order_by: 'head_type', order: 'ASC'}), []);
    const [fileData, setFileData] = useState([] as any[]);
    const [employees, setEmployees] = useState([] as any[]);
    const [downloadOptions, setDownloadOptions] = useState([
        {id: 1, name: 'CSV'},
        {id: 2, name: 'Excel'}
    ] as SelectBoxType[]);
    const [selectedOption, setSelectedOption] = useState(downloadOptions[0]);



    // Adding header row to Excel
    const headerRow = salaryHeads.map((head) => head.head_name + (head.head_type_text ? ` (${head.head_type_text})` : ''));
    const headers = [
        __('First name', 'pay-check-mate'),
        __('Last name', 'pay-check-mate'),
        __('Designation id', 'pay-check-mate'),
        __('Department id', 'pay-check-mate'),
        __('Employee id', 'pay-check-mate'),
        __('User id', 'pay-check-mate'),
        __('Email', 'pay-check-mate'),
        __('Phone', 'pay-check-mate'),
        __('Bank name', 'pay-check-mate'),
        __('Bank account number', 'pay-check-mate'),
        __('Tax number', 'pay-check-mate'),
        __('Joining date', 'pay-check-mate'),
        __('Address', 'pay-check-mate'),
        __('Gross salary', 'pay-check-mate'),
        __('Basic salary', 'pay-check-mate'),
        __('Salary active from', 'pay-check-mate'),
        __('Remarks', 'pay-check-mate'),
        ...headerRow,
    ]

    const totalHeadRowToBe = headers.length;
    const getSampleData = () => {
        const data = [];
        data.push(headers);

        // Adding data row to Excel and/or CSV
        const dataRow = [
            'John', 'Doe', '1', '1', '1', '1', 'johndoe@example.com', '1234567890', 'Bank name', '1234567890', '1234567890', '2021-01-01', 'Address',
            '10000', '1000', '2021-01-01', 'Remarks', ...Array(salaryHeads.length).fill('100')
        ];

        data.push(dataRow);


        return data;
    }

    useEffect(() => {
        setEmployees([]); // Reset employees when CSV or Excel data changes
        if (fileData.length > 0) {
            setEmployees(prevEmployees => {
                return prevEmployees.concat(
                    fileData.filter((data: any) => {
                        if (data.length !== totalHeadRowToBe) {
                            toast.error(__('File is not formatted properly. Please check the sample file.', 'pay-check-mate'));
                            setFileData([]);
                            return false;
                        }
                        // Remove header row.
                        return data[0] !== 'First name'
                    })
                );
            });
        }
    }, [fileData]);

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
        a.download = 'sample_employee_' + new Date().toISOString().slice(0, 10) + '.csv';
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


    const formatEmployeeData = (employees: any[]) => {
        return employees.map((employee) => {
            const [firstName, lastName, designationId, departmentId, employeeId, userId, email, phone, bankName, bankAccountNumber,
                taxNumber, joiningDate, address, grossSalary, basicSalary, activeFrom, remarks, ...salaryDetails] = employee;

            const personalInformation = {
                'first_name': firstName,
                'last_name': lastName,
                'designation_id': designationId,
                'department_id': departmentId,
                'employee_id': employeeId,
                'user_id': userId,
                'email': email,
                'phone': phone,
                'bank_name': bankName,
                'bank_account_number': bankAccountNumber,
                'tax_number': taxNumber,
                'joining_date': joiningDate,
                'address': address,
            };

            // Format salary details with salary head id as key
            const formattedSalaryDetails = {} as any
            salaryHeads.map((head, index) => {
                formattedSalaryDetails[head.id] = parseInt(String(salaryDetails[index])) || 0;
            });
            const salaryInformation = {
                'basic_salary': parseInt(String(basicSalary)),
                'gross_salary': parseInt(String(grossSalary)),
                'remarks': remarks,
                'active_from': activeFrom,
                ...formattedSalaryDetails,
            };

            return {
                ...personalInformation,
                status: 1,
                'salaryInformation': salaryInformation,
                _wpnonce: getNonce(),
            };
        });
    };

    const saveBulkEmployees = () => {
        const formattedEmployees = formatEmployeeData(employees);
        apiFetch({
            path: '/pay-check-mate/v1/employees/bulk',
            method: 'POST',
            data: formattedEmployees,
        }).then((response: any) => {
            if (response.success) {
                setEmployees([]);
                setFileData([]);
                toast.success(response.data);
                navigate('/employees');
            } else {
                setEmployees([]);
                setFileData([]);
                toast.error(response.data);
            }
        }).catch((error: any) => {
            setEmployees([]);
            setFileData([]);
            toast.error(error.data);
        });
    }
    return (
        <HOC role={UserCapNames.pay_check_mate_add_employee}>
            <div>
                <div className="sm:flex-auto mb-6">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">
                        {__('Import Employee', 'pay-check-mate')}
                    </h1>
                </div>
                <Card>
                    <div className="payroll-table-container">
                        <div className="flex justify-between mb-6 gap-4">
                            <div>
                                <p className="text-base leading-6 text-gray-900">
                                    {__('Import employee data in CSV or Excel format following the structure of sample file. The fields are aligned with your salary heads.', 'pay-check-mate')}
                                </p>
                                <p className="text-gray-600">
                                    {__('Note: The first row of the CSV file must be the column name.', 'pay-check-mate')}
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
                                    <ArrowDownTrayIcon
                                        className="w-5 h-5 mr-2 -ml-1 text-white"
                                        aria-hidden="true"
                                    />
                                    {__('Download sample file', 'pay-check-mate')}
                                </Button>
                            </div>
                        </div>
                        <div>
                            <DragAndDrop setFileData={(data: any) => setFileData(data)} />
                        </div>
                    </div>
                    <div className="flex justify-end mt-12">
                        {employees.length > 0 && (
                            <div className="payroll-table-container h-full">
                                <table className="payroll-table">
                                <thead>
                                    <tr>
                                        <th>{__('SL', 'pay-check-mate')}</th>
                                        {headers.map((header) => <th key={header}>{header}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map((employee, index) => (
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
                    {employees.length > 0 && (
                        <>
                            <div className="flex items-center justify-end gap-x-6 py-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEmployees([]);
                                        setFileData([]);
                                    }}
                                    className="text-sm font-semibold leading-6 text-gray-900 btn-cancel"
                                >
                                    {__('Reset', 'pay-check-mate')}
                                </button>
                                <Button
                                    onClick={() => saveBulkEmployees()}
                                    className="btn-primary"
                                >
                                    {__('Import', 'pay-check-mate')}
                                </Button>
                            </div>
                        </>
                    )}
                </Card>
            </div>
        </HOC>
    )
}
