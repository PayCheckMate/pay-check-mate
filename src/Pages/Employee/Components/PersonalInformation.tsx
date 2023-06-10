import {PhotoIcon, UserCircleIcon} from "@heroicons/react/24/outline";
import {FormInput} from "../../../Components/FormInput";
import {__} from "@wordpress/i18n";
import {SelectBox} from "../../../Components/SelectBox";
import {useEffect, useState} from "@wordpress/element";
import {DesignationType} from "../../../Types/DesignationType";
import {DepartmentType} from "../../../Types/DepartmentType";
import {SalaryResponseType, SelectBoxType} from "../../../Types/SalaryHeadType";
import useFetchApi from "../../../Helpers/useFetchApi";
import {EmployeeType} from "../../../Types/EmployeeType";
import {Textarea} from "../../../Components/Textarea";

export const PersonalInformation = ({setFormData, initialValues = {}, children}: any) => {
    if (initialValues === null) {
        initialValues = {} as EmployeeType;
    }
    const [designations, setDesignations] = useState<DesignationType[]>([]);
    const [departments, setDepartments] = useState<DepartmentType[]>([]);
    const [selectedDesignation, setSelectedDesignation] = useState<SelectBoxType>({} as SelectBoxType);
    const [selectedDepartment, setSelectedDepartment] = useState<SelectBoxType>({} as SelectBoxType);
    const [formValues, setFormValues] = useState(initialValues as EmployeeType);

    const {makeGetRequest} = useFetchApi<SalaryResponseType>('/pay-check-mate/v1/payroll', {}, false);

    useEffect(() => {
        const data = {
            'per_page': '-1',
        }
        makeGetRequest('/pay-check-mate/v1/designations', data).then((data: any) => {
            let designation = data.data.map((item: DesignationType) => {
                return {
                    id:   item.id,
                    name: item.name,
                }
            })

            setDesignations(designation);
            const designationId = initialValues.designation_id ? initialValues.designation_id : designation[0].id;
            setSelectedDesignation(designation.find((item: SelectBoxType) => item.id === designationId) as SelectBoxType);
        }).catch((e: unknown) => {
            console.log(e, 'error');
        })
        makeGetRequest('/pay-check-mate/v1/departments', data).then((data: any) => {
            let department = data.data.map((item: DepartmentType) => {
                return {
                    id:   item.id,
                    name: item.name,
                }
            })

            setDepartments(department);
            const departmentId = initialValues.department_id ? initialValues.department_id : department[0].id;
            setSelectedDepartment(department.find((item: SelectBoxType) => item.id === departmentId) as SelectBoxType);
        }).catch((e: unknown) => {
            console.log(e, 'error');
        })
    }, []);

    const handleFormInputChange = (e: any) => {
        const {name, value} = e.target;
        setFormValues({...formValues, [name]: value});
        if (name === 'department_id') {
            const department = departments.find((item: SelectBoxType) => parseInt(String(item.id)) === parseInt(value)) as SelectBoxType;
            localStorage.setItem('Employee.department', JSON.stringify(department));
        }
        if (name === 'designation_id') {
            const designation = designations.find((item: SelectBoxType) => parseInt(String(item.id)) === parseInt(value)) as SelectBoxType;
            localStorage.setItem('Employee.designation', JSON.stringify(designation));
        }
        setFormData({...formValues, [name]: value});
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
                                    value={formValues.first_name}
                                    onChange={handleFormInputChange}
                                />
                            </div>

                            <div className="sm:col-span-3">
                                <FormInput
                                    required={true}
                                    label={__('Last name', 'pcm')}
                                    name="last_name"
                                    id="last_name"
                                    value={formValues.last_name}
                                    onChange={handleFormInputChange}
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <SelectBox
                                    required={true}
                                    title={__('Department', 'pcm')}
                                    options={departments}
                                    selected={selectedDepartment}
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
                                    setSelected={(selectedDesignation) => {
                                        setSelectedDesignation(selectedDesignation)
                                        handleFormInputChange({target: {name: 'designation_id', value: selectedDesignation.id}})
                                    }}
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <FormInput
                                    label={__('Employee id', 'pcm')}
                                    name="employee_id"
                                    id="employee_id"
                                    value={formValues.employee_id}
                                    onChange={handleFormInputChange}
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <FormInput
                                    label={__('Email address', 'pcm')}
                                    name="email"
                                    id="email"
                                    value={formValues.email}
                                    onChange={handleFormInputChange}
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <FormInput
                                    type='date'
                                    label={__('Joining date', 'pcm')}
                                    name="joining_date"
                                    id="joining_date"
                                    value={formValues.joining_date}
                                    onChange={handleFormInputChange}
                                />
                            </div>
                            <div className="col-span-full">
                                <Textarea
                                    label={__("Address", 'pcm')}
                                    name="address"
                                    id="address"
                                    value={formValues.address}
                                    onChange={handleFormInputChange}
                                />
                            </div>
                            <div className="col-span-full">
                                <label
                                    htmlFor="photo"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Photo
                                </label>
                                <div className="mt-2 flex items-center gap-x-3">
                                    <UserCircleIcon
                                        className="h-12 w-12 text-gray-300"
                                        aria-hidden="true"
                                    />
                                    <FormInput
                                        type="file"
                                        label=""
                                        name="photo"
                                        id="photo"
                                        value={formValues.phone}
                                        onChange={handleFormInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {children ? children : ''}
                </div>
            </div>
        </>
    )
}