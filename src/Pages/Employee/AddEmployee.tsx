import {useState} from "react";
import {Card} from "../../Components/Card";
import {Steps} from "../../Components/Steps";
import {PersonalInformation} from "./Components/PersonalInformation";
import {__} from "@wordpress/i18n";
import {EmployeeType} from "../../Types/EmployeeType";
import {Button} from "../../Components/Button";
import {SalaryInformation} from "./Components/SalaryInformation";
import {ReviewInformation, SalaryInformationType} from "./Components/ReviewInformation";
import {SalaryHeadType} from "../../Types/SalaryHeadType";
import useFetchApi from "../../Helpers/useFetchApi";

export const AddEmployee = () => {
    // Get initial personal information from local storage
    let employeePersonalInformation = localStorage.getItem('Employee.personalInformation');
    // @ts-ignore
    let savedPersonalInformation = JSON.parse(employeePersonalInformation) as EmployeeType;

    let employeeSalaryInformation = localStorage.getItem('Employee.salaryInformation');
    // @ts-ignore
    let savedSalaryInformation = JSON.parse(employeeSalaryInformation) as SalaryInformationType;
    const {makePostRequest} = useFetchApi('/pay-check-mate/v1/payroll', {}, false);
    const [step, setStep] = useState(1);
    const [personalInformation, setPersonalInformation] = useState(savedPersonalInformation as EmployeeType);
    const [salaryInformation, setSalaryInformation] = useState(savedSalaryInformation);
    const handlePersonalInformation = (personalInformation: EmployeeType) => {
        setPersonalInformation(personalInformation);
        localStorage.setItem('Employee.personalInformation', JSON.stringify(personalInformation));
    };
    const handleSalaryInformation = (salary: string) => {
        // @ts-ignore
        setSalaryInformation(salary);
        localStorage.setItem('Employee.salaryInformation', JSON.stringify(salary));
    }
    const steps = [
        {label: 'Personal Info'},
        {label: 'Salary Info'},
        {label: 'Review'},
    ]

    const validatePersonalInformation = () => {
        if (personalInformation === null || Object.keys(personalInformation).length === 0) {
            alert(__('Please fill personal information', 'pcm'));
            return false;
        }
        if (personalInformation.designation_id === null || personalInformation.designation_id === 0) {
            alert(__('Please select designation', 'pcm'));
            return false;
        }
        if (personalInformation.department_id === null || personalInformation.department_id === 0) {
            alert(__('Please select department', 'pcm'));
            return false;
        }
        if (personalInformation.employee_id === null || personalInformation.employee_id === '') {
            alert(__('Please fill employee id', 'pcm'));
            return false;
        }
        if (personalInformation.first_name === null || personalInformation.first_name === '') {
            alert(__('Please fill first name', 'pcm'));
            return false;
        }
        if (personalInformation.last_name === null || personalInformation.last_name === '') {
            alert(__('Please fill last name', 'pcm'));
            return false;
        }
        if (personalInformation.email === null || personalInformation.email === '') {
            alert(__('Please fill email', 'pcm'));
            return false;
        }
        return true;
    }
    const validateSalaryInformation = () => {
        if (salaryInformation === null || Object.keys(salaryInformation).length === 0) {
            alert(__('Please fill salary information', 'pcm'));
            return false;
        }
        // @ts-ignore
        if (salaryInformation.basic_salary === null || salaryInformation.basic_salary === 0) {
            alert(__('Please fill basic salary', 'pcm'));
            return false;
        }
        // @ts-ignore
        if (salaryInformation.gross_salary === null || salaryInformation.gross_salary === 0) {
            alert(__('Please fill gross salary', 'pcm'));
            return false;
        }

        return true;
    }
    const handleSubmit = (e: any) => {
        e.preventDefault();
        // Validate form data
        if (!validatePersonalInformation()) {
            return false;
        }
        if (!validateSalaryInformation()) {
            return false;
        }

        savedPersonalInformation.status = 1;
        // Save data to database
        // @ts-ignore
        const _wpnonce = payCheckMate.pay_check_mate_nonce;
        const data = {
            '_wpnonce': _wpnonce,
            ...personalInformation,
            'salaryInformation': salaryInformation,
        }

        makePostRequest('/pay-check-mate/v1/employees', data).then(response => {
            console.log(response);
        })
    }

    // const employeeKeysToRemove = Object.keys(localStorage).filter(key => key.startsWith('Employee.'));
    // employeeKeysToRemove.forEach(key => localStorage.removeItem(key));
    return (
        <>
            <div>
                <Steps
                    steps={steps}
                    currentStep={step}
                    setStep={(step: number) => setStep(step)}
                />
                <Card>
                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <>
                                <h2 className="text-2xl font-medium mb-4 border-b-2 border-gray-500">
                                    {__('Personal Information', 'pcm')}
                                </h2>
                                <div className="mx-auto w-3/4">
                                    <PersonalInformation
                                        initialValues={savedPersonalInformation}
                                        setFormData={(personalInformation: EmployeeType) => handlePersonalInformation(personalInformation)}
                                    >
                                        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                                            <button
                                                type="button"
                                                className="text-sm font-semibold leading-6 text-gray-900"
                                            >
                                                Cancel
                                            </button>
                                            <Button
                                                onClick={() => setStep(2)}
                                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            >
                                                {__('Save & Continue', 'pcm')}
                                            </Button>
                                        </div>
                                    </PersonalInformation>
                                </div>
                            </>
                        )}

                        {step === 2 && (
                            <div>
                                <h2 className="text-2xl font-medium mb-4 border-b-2 border-gray-500">
                                    {__('Salary Information', 'pcm')}
                                </h2>
                                <div className="mx-auto w-3/4">
                                    <SalaryInformation
                                        initialValues={savedSalaryInformation}
                                        setSalaryData={(salary: string) => handleSalaryInformation(salary)}
                                    />
                                    <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="text-sm font-semibold leading-6 text-gray-900"
                                        >
                                            {__('Back', 'pcm')}
                                        </button>
                                        <Button
                                            onClick={() => setStep(3)}
                                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            {__('Save & Continue', 'pcm')}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {step === 3 && (
                            <>
                                <ReviewInformation
                                    personalInformation={savedPersonalInformation}
                                    salaryInformation={savedSalaryInformation}
                                />
                                <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                                    <Button
                                        type="submit"
                                        onClick={() => {
                                        }}
                                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        {__('Submit', 'pcm')}
                                    </Button>
                                </div>
                            </>
                        )}
                    </form>
                </Card>
            </div>
        </>
    )
};