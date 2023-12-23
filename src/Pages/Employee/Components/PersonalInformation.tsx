import {FormInput} from "../../../Components/FormInput";
import {__} from "@wordpress/i18n";
import {SelectBox} from "../../../Components/SelectBox";
import React, {useEffect, useState} from "@wordpress/element";
import {DesignationType} from "../../../Types/DesignationType";
import {DepartmentType} from "../../../Types/DepartmentType";
import {SelectBoxType} from "../../../Types/SalaryHeadType";
import useFetchApi from "../../../Helpers/useFetchApi";
import {EmployeeType} from "../../../Types/EmployeeType";
import {Textarea} from "../../../Components/Textarea";
import {Button} from "../../../Components/Button";
import {validateRequiredFields} from "../../../Helpers/Helpers";
import {useSelect} from "@wordpress/data";
import department from "../../../Store/Department";
import designation from "../../../Store/Designation";
import {useParams} from "react-router-dom";
import {CreateDepartment} from "../../Department/CreateDepartment";
import {CreateDesignation} from "../../Designation/CreateDesignation";
import {applyFilters} from "../../../Helpers/Hooks";

type PersonalInformationPropTypes = {
    setFormData: (formData: EmployeeType) => void;
    initialValues?: EmployeeType;
    children?: any;
    nextStep: () => void;
}

export const PersonalInformation = ({setFormData, initialValues = {} as EmployeeType, children, nextStep}: PersonalInformationPropTypes) => {
    const employeeId = useParams().id;

    if (initialValues === null) {
        initialValues = {} as EmployeeType;
    }

    const defaultDesignation = {
        id: 'select_one',
        name: __('Select one', 'pay-check-mate'),
    }
    const defaultDepartment = {
        id: 'select_one',
        name: __('Select one', 'pay-check-mate'),
    }

    const {designations} = useSelect((select) => select(designation).getDesignations({per_page: '-1', status: '1'}), []);
    const [selectedDesignation, setSelectedDesignation] = useState<SelectBoxType>(designations.find((designation: DesignationType) => {
        return designation.id === initialValues.designation_id
    }) || defaultDesignation as SelectBoxType);

    const {departments} = useSelect((select) => select(department).getDepartments({per_page: '-1', status: '1'}), []);
    const [selectedDepartment, setSelectedDepartment] = useState<SelectBoxType>(departments.find((department: DepartmentType) => {
        return department.id === initialValues.department_id
    }) || defaultDepartment as SelectBoxType);

    const [formValues, setFormValues] = useState(initialValues as EmployeeType);
    const [formError, setFormError] = useState({} as { [key: string]: string});

    // If this is new employee then set employee id.
    if (!employeeId) {
        const {models} = useFetchApi<EmployeeType>('/pay-check-mate/v1/employees', {'per_page': '1', 'order_by': 'employee_id', 'order': 'desc'});

        // Get last employee id and set next employee id.
        useEffect(() => {
            if (models.length > 0) {
                const employeeId = String(parseInt(models[0].employee_id) + 1);
                setFormValues((prevState: EmployeeType) => ({
                    ...prevState,
                    employee_id: employeeId,
                }));

                setFormData({...formValues, employee_id: employeeId});
            }
        }, [models]);
    }

    useEffect(() => {
        setFormValues((prevState: EmployeeType) => ({
            ...prevState,
            ...initialValues
        }));
    }, [initialValues]);


    const handleFormInputChange = (e: any) => {
        const {name, value} = e.target;
        setFormValues({...formValues, [name]: value});
        setFormData({...formValues, [name]: value});
    }

    const handleNextStep = () => {
        const requiredFields = ['first_name', 'last_name', 'department_id', 'designation_id', 'employee_id', 'joining_date', 'email' ];
        const errors = validateRequiredFields(formValues, requiredFields, setFormError);
        if (Object.keys(errors).length > 0) {
            return;
        }
        nextStep();
    }

    const [showDepartmentModal, setShowDepartmentModal] = useState(false);
    const [showDesignationModal, setShowDesignationModal] = useState(false);
    const [departmentData, setDepartmentData] = useState<DepartmentType>({} as DepartmentType);
    const [designationData, setDesignationData] = useState<DesignationType>({} as DesignationType);
    let indigo = applyFilters('pay_check_mate.indigo', 'gray');

    return (
        <>
            {showDepartmentModal && (
                <CreateDepartment
                    showModal={showDepartmentModal}
                    setShowModal={setShowDepartmentModal}
                    formData={departmentData}
                    setFormData={setDepartmentData}
                    formError={formError}
                    setFormError={setFormError}
                />
            )}
            {showDesignationModal && (
                <CreateDesignation
                    showModal={showDesignationModal}
                    setShowModal={setShowDesignationModal}
                    formData={designationData}
                    setFormData={setDesignationData}
                    formError={formError}
                    setFormError={setFormError}
                />
            )}
            <div className="space-y-12">
                <div className="bg-white sm:rounded-xl md:col-span-2">
                    <div className="px-4 py-6 sm:p-8">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <FormInput
                                    required={true}
                                    label={__('First name', 'pay-check-mate')}
                                    name="first_name"
                                    id="first_name"
                                    value={formValues.first_name || initialValues.first_name || ''}
                                    onChange={handleFormInputChange}
                                    error={formError.first_name}
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <FormInput
                                    required={true}
                                    label={__('Last name', 'pay-check-mate')}
                                    name="last_name"
                                    id="last_name"
                                    value={formValues.last_name || initialValues.last_name || ''}
                                    onChange={handleFormInputChange}
                                    error={formError.last_name}
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <SelectBox
                                    required={true}
                                    title={__('Department', 'pay-check-mate')}
                                    options={departments}
                                    selected={selectedDepartment}
                                    error={formError.department_id}
                                    setSelected={(selectedDepartment) => {
                                        setSelectedDepartment(selectedDepartment)
                                        handleFormInputChange({target: {name: 'department_id', value: selectedDepartment.id}})
                                    }}
                                />
                                <div className="mt-1 text-sm text-gray-500">
                                    <span onClick={() => setShowDepartmentModal(true)} className={"font-medium text-"+indigo+"-600 hover:text-"+indigo+"-500 cursor-pointer"}>
                                        {__('Create a new department', 'pay-check-mate')}
                                    </span>
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <SelectBox
                                    required={true}
                                    title={__('Designation', 'pay-check-mate')}
                                    options={designations}
                                    selected={selectedDesignation}
                                    error={formError.designation_id}
                                    setSelected={(selectedDesignation) => {
                                        setSelectedDesignation(selectedDesignation)
                                        handleFormInputChange({target: {name: 'designation_id', value: selectedDesignation.id}})
                                    }}
                                />
                                <div className="mt-1 text-sm text-gray-500">
                                    <span onClick={() => setShowDesignationModal(true)} className={"font-medium text-"+indigo+"-600 hover:text-"+indigo+"-500 cursor-pointer"}>
                                        {__('Create a new designation', 'pay-check-mate')}
                                    </span>
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <FormInput
                                    label={__('Employee id', 'pay-check-mate')}
                                    required={true}
                                    name="employee_id"
                                    id="employee_id"
                                    value={formValues.employee_id || initialValues.employee_id || ''}
                                    onChange={handleFormInputChange}
                                    error={formError.employee_id}
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <FormInput
                                    required={true}
                                    label={__('Email address', 'pay-check-mate')}
                                    name="email"
                                    id="email"
                                    value={formValues.email || initialValues.email || ''}
                                    onChange={handleFormInputChange}
                                    error={formError.email}
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <FormInput
                                    label={__('Phone number', 'pay-check-mate')}
                                    name="phone"
                                    id="phone"
                                    value={formValues.phone || initialValues.phone || ''}
                                    onChange={handleFormInputChange}
                                    error={formError.phone}
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <FormInput
                                    label={__('Bank name', 'pay-check-mate')}
                                    name="bank_name"
                                    id="bank_name"
                                    value={formValues.bank_name || initialValues.bank_name || ''}
                                    onChange={handleFormInputChange}
                                    error={formError.bank_name}
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <FormInput
                                    label={__('Bank account number', 'pay-check-mate')}
                                    name="bank_account_number"
                                    id="bank_account_number"
                                    value={formValues.bank_account_number || initialValues.bank_account_number || ''}
                                    onChange={handleFormInputChange}
                                    error={formError.bank_account_number}
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <FormInput
                                    label={__('Tax number', 'pay-check-mate')}
                                    name="tax_number"
                                    id="tax_number"
                                    value={formValues.tax_number || initialValues.tax_number || ''}
                                    onChange={handleFormInputChange}
                                    error={formError.tax_number}
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <FormInput
                                    required={true}
                                    type="date"
                                    label={__('Joining date', 'pay-check-mate')}
                                    name="joining_date"
                                    id="joining_date"
                                    value={formValues.joining_date || initialValues.joining_date || ''}
                                    onChange={handleFormInputChange}
                                    error={formError.joining_date}
                                />
                            </div>
                            <div className="col-span-full">
                                <Textarea
                                    label={__("Address", 'pay-check-mate')}
                                    name="address"
                                    id="address"
                                    value={formValues.address || initialValues.address || ''}
                                    onChange={handleFormInputChange}
                                />
                            </div>
                        </div>
                    </div>
                    {children ? children : ''}
                    <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                        <button
                            type="button"
                            className="text-sm font-semibold leading-6 text-gray-900"
                        >
                            Cancel
                        </button>
                        <Button
                            onClick={() => handleNextStep()}
                            className="btn-primary"
                        >
                            {__('Save & Continue', 'pay-check-mate')}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}
