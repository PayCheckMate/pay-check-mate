import React, {useEffect, useState} from "@wordpress/element";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Card} from "../../Components/Card";
import {Steps} from "../../Components/Steps";
import {PersonalInformation} from "./Components/PersonalInformation";
import {__} from "@wordpress/i18n";
import {EmployeeStatus, EmployeeType, SingleEmployeeResponseType} from "../../Types/EmployeeType";
import {Button} from "../../Components/Button";
import {SalaryInformation} from "./Components/SalaryInformation";
import {ReviewInformation, SalaryInformationType} from "./Components/ReviewInformation";
import useFetchApi from "../../Helpers/useFetchApi";
import {toast} from "react-toastify";
import {userCan} from "../../Helpers/User";
import {UserCapNames} from "../../Types/UserType";
import {PermissionDenied} from "../../Components/404";
import {FormInput} from "../../Components/FormInput";
import {validateRequiredFields} from "../../Helpers/Helpers";
import apiFetch from "@wordpress/api-fetch";
import {applyFilters} from "../../Helpers/Hooks";
import {HOC} from "../../Components/HOC";

type ResponseType = {
    data: EmployeeType,
    headers: any,
    status: number,
}
export const AddEmployee = () => {
    const employeeId = useParams().id;
    const {makePostRequest, makeGetRequest} = useFetchApi('/pay-check-mate/v1/payrolls', {}, false);

    const navigate = useNavigate();
    const [error, setError] = useState(false);
    let savedPersonalInformation = {} as EmployeeType
    let savedSalaryInformation = {} as SalaryInformationType
    if (!employeeId) {
        // Get initial personal information from local storage
        let employeePersonalInformation = localStorage.getItem('Employee.personalInformation');
        // @ts-ignore
        savedPersonalInformation = JSON.parse(employeePersonalInformation) as EmployeeType;

        let employeeSalaryInformation = localStorage.getItem('Employee.salaryInformation');
        // @ts-ignore
        savedSalaryInformation = JSON.parse(employeeSalaryInformation) as SalaryInformationType;
    }
    const [step, setStep] = useState(1);
    const [personalInformation, setPersonalInformation] = useState(savedPersonalInformation as EmployeeType);
    const [salaryInformation, setSalaryInformation] = useState(savedSalaryInformation);
    const [userId, setUserId] = useState(personalInformation?.user_id || '');
    useEffect(() => {
        if (employeeId) {
            makeGetRequest<SingleEmployeeResponseType>('/pay-check-mate/v1/employees/' + employeeId, {}, true).then((response) => {
                if (response.status === 200) {
                    const employeeKeysToRemove = Object.keys(localStorage).filter(key => key.startsWith('Employee.'));
                    employeeKeysToRemove.forEach(key => localStorage.removeItem(key));
                    const salaryInformation = {
                        ...response.data.salaryInformation,
                        // @ts-ignore
                        ...response.data.salaryInformation.salary_details,
                    };
                    delete salaryInformation.salary_details;
                    delete response.data.salaryInformation;
                    setPersonalInformation(response.data);
                    setSalaryInformation(salaryInformation as SalaryInformationType);
                } else {
                    toast.error(__('Something went wrong', 'pay-check-mate'));
                }
            }).catch(error => {
                toast.error(error.message);
            })
        }
    }, [])

    const handlePersonalInformation = (information: EmployeeType) => {
        setPersonalInformation((prevState) => {
            return {
                ...prevState,
                ...information
            }
        })
        localStorage.setItem('Employee.personalInformation', JSON.stringify(personalInformation));
    };
    const handleSalaryInformation = (salary: string) => {
        // @ts-ignore
        setSalaryInformation(salary);
        localStorage.setItem('Employee.salaryInformation', JSON.stringify(salary));
    }
    const steps = [
        {label: 'Personal Information'},
        {label: 'Salary Information'},
        {label: 'Review'},
    ]

    const validatePersonalInformation = () => {
        if (personalInformation === null || Object.keys(personalInformation).length === 0) {
            alert(__('Please fill personal information', 'pay-check-mate'));
            return false;
        }
        if (personalInformation.designation_id === null || personalInformation.designation_id === 0) {
            alert(__('Please select designation', 'pay-check-mate'));
            return false;
        }
        if (personalInformation.department_id === null || personalInformation.department_id === 0) {
            alert(__('Please select department', 'pay-check-mate'));
            return false;
        }
        if (personalInformation.employee_id === null || personalInformation.employee_id === '') {
            alert(__('Please fill employee id', 'pay-check-mate'));
            return false;
        }
        if (personalInformation.first_name === null || personalInformation.first_name === '') {
            alert(__('Please fill first name', 'pay-check-mate'));
            return false;
        }
        if (personalInformation.last_name === null || personalInformation.last_name === '') {
            alert(__('Please fill last name', 'pay-check-mate'));
            return false;
        }
        if (personalInformation.email === null || personalInformation.email === '') {
            alert(__('Please fill email', 'pay-check-mate'));
            return false;
        }
        return true;
    }
    const validateSalaryInformation = () => {
        if (salaryInformation === null || Object.keys(salaryInformation).length === 0) {
            alert(__('Please fill salary information', 'pay-check-mate'));
            return false;
        }
        // @ts-ignore
        if (salaryInformation.basic_salary === null || salaryInformation.basic_salary === 0) {
            alert(__('Please fill basic salary', 'pay-check-mate'));
            return false;
        }
        // @ts-ignore
        if (salaryInformation.gross_salary === null || salaryInformation.gross_salary === 0) {
            alert(__('Please fill gross salary', 'pay-check-mate'));
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

        // Save data to database
        // @ts-ignore
        const _wpnonce = payCheckMate.pay_check_mate_nonce;
        const data = {
            '_wpnonce': _wpnonce,
            ...personalInformation,
            status: 1,
            'salaryInformation': {
                ...salaryInformation,
                'basic_salary': salaryInformation.basic_salary,
                'gross_salary': salaryInformation.gross_salary,
                'remarks': salaryInformation.remarks,
                'salary_details': salaryInformation.salary_details,
                'active_from': salaryInformation.active_from,
            },
        }

        let url = '/pay-check-mate/v1/employees';
        if (employeeId) {
            url = '/pay-check-mate/v1/employees/' + employeeId;
            data.status = parseInt(String(personalInformation.status)) === EmployeeStatus.Active ? 1 : 0;
        }

        apiFetch({
            path: url,
            method: employeeId ? 'PUT' : 'POST',
            data: data,
        }).then((response: any) => {
            if (response.status === 201) {
                const employeeKeysToRemove = Object.keys(localStorage).filter(key => key.startsWith('Employee.'));
                employeeKeysToRemove.forEach(key => localStorage.removeItem(key));
                navigate('/employees');
                if (employeeId) {
                    toast.success(__('Employee updated successfully', 'pay-check-mate'));
                    return;
                }

                toast.success(__('Employee added successfully', 'pay-check-mate'));
            }
        }).catch(error => {
            const employeeKeysToRemove = Object.keys(localStorage).filter(key => key.startsWith('Employee.'));
            employeeKeysToRemove.forEach(key => localStorage.removeItem(key));
            navigate('/employees');
            const errorMessage = error.data ? error.data : error.message;
            toast.error(errorMessage);
        })
    }
    const handleImportEmployee = (e: any) => {
        e.preventDefault();

        const userId = e.target.value;
        setUserId(userId);

        if (userId === null || userId === '') {
            return false;
        }

        makeGetRequest<SingleEmployeeResponseType>('/pay-check-mate/v1/employees/user/' + userId, {}, true).then((response) => {
            if (response.status === 200) {
                setPersonalInformation((prevState) => {
                    return {
                        ...prevState,
                        ...response.data,
                    }
                })

                // @ts-ignore
                if (response.data.user_id === 0) {
                    toast.error(__('User not found', 'pay-check-mate'));
                    return;
                }
            } else {
                console.log(response, 'error')
                toast.error(__('Something went wrong', 'pay-check-mate'));
            }
        }).catch(error => {
            toast.error(error.message);
        })
    }
    const [salaryFormError, setSalaryFormError] = useState({} as { [key: string]: string });

    const goToReview = () => {
        const requiredFields = ['gross_salary', 'basic_salary', 'active_from'];
        const errors = validateRequiredFields(salaryInformation, requiredFields, setSalaryFormError);
        if (Object.keys(errors).length > 0) {
            return;
        }
        setStep(3)
    }
    let indigo = applyFilters('pay_check_mate.indigo', 'gray');

    return (
        <>
            {!userCan(UserCapNames.pay_check_mate_add_employee) ? (
                <Card>
                    <PermissionDenied />
                </Card>
            ) : (
                <HOC role={UserCapNames.pay_check_mate_add_employee}>
                    <Steps
                        steps={steps}
                        currentStep={step}
                        setStep={(step: number) => setStep(step)}
                    />
                    <Card>
                        <form onSubmit={handleSubmit}>
                            {step === 1 && (
                                <>
                                    <div className="flex items-center justify-between border-b-2 border-gray-500">
                                        <h2 className="text-2xl font-medium mb-4">
                                            {__('Personal Information', 'pay-check-mate')}
                                        </h2>
                                        {!employeeId && <FormInput
                                            type={"number"}
                                            label={__('Search from existing user', 'pay-check-mate')}
                                            placeholder={__("Enter user id", "pay-check-mate")}
                                            name="employee_id"
                                            id="user_id"
                                            value={userId}
                                            onChange={(e) => handleImportEmployee(e)}
                                            className="mb-4"
                                        />}
                                    </div>
                                    <div className="mx-auto w-3/4">
                                        <PersonalInformation
                                            initialValues={personalInformation}
                                            setFormData={(personalInformation: EmployeeType) => handlePersonalInformation(personalInformation)}
                                            nextStep={() => setStep(2)}
                                        />
                                    </div>
                                </>
                            )}

                            {step === 2 && (
                                <div>
                                    <div className="flex items-center justify-between border-b-2 border-gray-500">
                                        <h2 className="text-2xl font-medium mb-4">
                                            {__('Salary Information', 'pay-check-mate')}
                                        </h2>
                                        <div className="mt-1 text-sm text-gray-500">
                                            <Link
                                                to={'/salary-heads'}
                                                target={'_blank'}
                                                className={"font-medium text-" + indigo + "-600 hover:text-" + indigo + "-500"}
                                            >
                                                {__('Add Salary Heads', 'pay-check-mate')}
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="mx-auto w-3/4">
                                        <SalaryInformation
                                            initialValues={salaryInformation}
                                            setSalaryData={(salary: string) => handleSalaryInformation(salary)}
                                            formErrors={salaryFormError}
                                        />
                                        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="text-sm font-semibold leading-6 text-gray-900"
                                            >
                                                {__('Back', 'pay-check-mate')}
                                            </button>
                                            <Button
                                                onClick={() => goToReview()}
                                                className="btn-primary"
                                            >
                                                {__('Save & Continue', 'pay-check-mate')}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {step === 3 && (
                                <>
                                    {(personalInformation !== null && salaryInformation !== null) ? (
                                        <>
                                            <ReviewInformation
                                                personalInformation={personalInformation}
                                                salaryInformation={salaryInformation}
                                                setError={setError}
                                            />
                                            {!error && (
                                                <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                                                    <Button
                                                        type="submit"
                                                        onClick={() => {
                                                        }}
                                                        className="btn-primary"
                                                    >
                                                        {__('Submit', 'pay-check-mate')}
                                                    </Button>
                                                </div>
                                            )
                                            }
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-center justify-center gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                                                <div className="text-sm font-semibold leading-6 text-gray-900">
                                                    {__('Please fill all the information', 'pay-check-mate')}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setStep(1)}
                                                    className="text-sm font-semibold leading-6 text-gray-900"
                                                >
                                                    {__('Back', 'pay-check-mate')}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </form>
                    </Card>
                </HOC>
            )}
        </>
    )
};
