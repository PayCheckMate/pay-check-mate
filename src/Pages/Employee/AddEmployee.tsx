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

export const AddEmployee = () => {
    const [step, setStep] = useState(1);
    const [personalInformation, setPersonalInformation] = useState({} as EmployeeType);
    const [salaryInformation, setSalaryInformation] = useState({});
    // Get initial personal information from local storage
    let employeePersonalInformation = localStorage.getItem('Employee.personalInformation');
    // @ts-ignore
    let savedPersonalInformation = JSON.parse(employeePersonalInformation) as EmployeeType;

    let employeeSalaryInformation = localStorage.getItem('Employee.salaryInformation');
    // @ts-ignore
    let savedSalaryInformation = JSON.parse(employeeSalaryInformation) as SalaryInformationType;
    const handlePersonalInformation = (personalInformation: EmployeeType) => {
        setPersonalInformation(personalInformation);
        localStorage.setItem('Employee.personalInformation', JSON.stringify(personalInformation));
    };
    const handleSalaryInformation = (salary: string) => {
        setSalaryInformation(salary);
        localStorage.setItem('Employee.salaryInformation', JSON.stringify(salary));
    }
    const steps = [
        {label: 'Personal Info'},
        {label: 'Salary Info'},
        {label: 'Review'},
    ]
    const handleSubmit = (e: any) => {
        e.preventDefault();
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
                            <ReviewInformation personalInformation={savedPersonalInformation} salaryInformation={savedSalaryInformation} />
                        )}
                    </form>
                </Card>
            </div>
        </>
    )
};