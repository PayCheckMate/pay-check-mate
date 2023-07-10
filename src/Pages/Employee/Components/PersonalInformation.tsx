import {FormInput} from "../../../Components/FormInput";
import {__} from "@wordpress/i18n";
import {SelectBox} from "../../../Components/SelectBox";
import {useEffect, useState} from "@wordpress/element";
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
export const PersonalInformation = ({setFormData, initialValues = {}, children, nextStep}: any) => {
    const employeeId = useParams().id;

    if (initialValues === null) {
        initialValues = {} as EmployeeType;
    }
    const {designations} = useSelect((select) => select(designation).getDesignations({per_page: '-1', status: '1'}), []);
    const [selectedDesignation, setSelectedDesignation] = useState<SelectBoxType>({} as SelectBoxType);

    const {departments} = useSelect((select) => select(department).getDepartments({per_page: '-1', status: '1'}), []);
    const [selectedDepartment, setSelectedDepartment] = useState<SelectBoxType>({} as SelectBoxType);

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
        if (designations.length <= 0) return;
        let selectOptions = designations.map((item: DesignationType) => {
            return {
                id: item.id,
                name: item.name,
            }
        })
        // @ts-ignore
        selectOptions = [
            {
                id: null,
                name: __('Select one', 'pcm'),
            }
            // @ts-ignore
        ].concat(selectOptions);
        const designationId = initialValues.designation_id ? initialValues.designation_id : selectOptions[0].id;
        setSelectedDesignation(selectOptions.find((item: SelectBoxType) => item.id === designationId) as SelectBoxType);
    }, [designations]);

    useEffect(() => {
        if (departments.length <= 0) return;

        let department = departments.map((item: DepartmentType) => {
            return {
                id: item.id,
                name: item.name,
            }
        })
        // @ts-ignore

        department = [
            {
                id: null,
                name: __('Select one', 'pcm'),
            }
            // @ts-ignore
        ].concat(department);
        const departmentId = initialValues.department_id ? initialValues.department_id : department[0].id;
        setSelectedDepartment(department.find((item: SelectBoxType) => item.id === departmentId) as SelectBoxType);

    }, [departments]);

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
    return (
        <>
            <div className="space-y-12">
                <div className="bg-white sm:rounded-xl md:col-span-2">
                    <div className="px-4 py-6 sm:p-8">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <FormInput
                                    required={true}
                                    label={__('First name', 'pcm')}
                                    name="first_name"
                                    id="first_name"
                                    value={formValues.first_name || initialValues.first_name}
                                    onChange={handleFormInputChange}
                                    error={formError.first_name}
                                />
                            </div>

                            <div className="sm:col-span-3">
                                <FormInput
                                    required={true}
                                    label={__('Last name', 'pcm')}
                                    name="last_name"
                                    id="last_name"
                                    value={formValues.last_name || initialValues.last_name}
                                    onChange={handleFormInputChange}
                                    error={formError.last_name}
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <SelectBox
                                    required={true}
                                    title={__('Department', 'pcm')}
                                    options={departments}
                                    selected={selectedDepartment}
                                    error={formError.department_id}
                                    setSelected={(selectedDepartment) => {
                                        setSelectedDepartment(selectedDepartment)
                                        handleFormInputChange({target: {name: 'department_id', value: selectedDepartment.id}})
                                    }}
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <SelectBox
                                    required={true}
                                    title={__('Designation', 'pcm')}
                                    options={designations}
                                    selected={selectedDesignation}
                                    error={formError.designation_id}
                                    setSelected={(selectedDesignation) => {
                                        setSelectedDesignation(selectedDesignation)
                                        handleFormInputChange({target: {name: 'designation_id', value: selectedDesignation.id}})
                                    }}
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <FormInput
                                    label={__('Employee id', 'pcm')}
                                    required={true}
                                    name="employee_id"
                                    id="employee_id"
                                    value={formValues.employee_id || initialValues.employee_id}
                                    onChange={handleFormInputChange}
                                    error={formError.employee_id}
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <FormInput
                                    required={true}
                                    label={__('Email address', 'pcm')}
                                    name="email"
                                    id="email"
                                    value={formValues.email || initialValues.email}
                                    onChange={handleFormInputChange}
                                    error={formError.email}
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <FormInput
                                    required={true}
                                    type="date"
                                    label={__('Joining date', 'pcm')}
                                    name="joining_date"
                                    id="joining_date"
                                    value={formValues.joining_date || initialValues.joining_date}
                                    onChange={handleFormInputChange}
                                    error={formError.joining_date}
                                />
                            </div>
                            <div className="col-span-full">
                                <Textarea
                                    label={__("Address", 'pcm')}
                                    name="address"
                                    id="address"
                                    value={formValues.address || initialValues.address}
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
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            {__('Save & Continue', 'pcm')}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}
