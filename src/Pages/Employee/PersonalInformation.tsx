import {PhotoIcon, UserCircleIcon} from "@heroicons/react/24/outline";
import {FormInput} from "../../Components/FormInput";
import {__} from "@wordpress/i18n";
import {SelectBox} from "../../Components/SelectBox";
import {useEffect, useState} from "@wordpress/element";
import {DesignationType} from "../../Types/DesignationType";
import {DepartmentType} from "../../Types/DepartmentType";
import {SalaryResponseType, SelectBoxType} from "../../Types/SalaryHeadType";
import useFetchApi from "../../Helpers/useFetchApi";
import {EmployeeType} from "../../Types/EmployeeType";
import {Textarea} from "../../Components/Textarea";

export const PersonalInformation = ({setFormData, children}: any) => {
    const [designations, setDesignations] = useState<DesignationType[]>([]);
    const [departments, setDepartments] = useState<DepartmentType[]>([]);
    const [selectedDesignation, setSelectedDesignation] = useState<SelectBoxType>({} as SelectBoxType);
    const [selectedDepartment, setSelectedDepartment] = useState<SelectBoxType>({} as SelectBoxType);
    const [formValues, setFormValues] = useState({} as EmployeeType);

    const {
        makeGetRequest,
    } = useFetchApi<SalaryResponseType>('/pay-check-mate/v1/payroll', {}, false);

    useEffect(() => {
        const data = {
            'per_page': '-1',
        }
        makeGetRequest('/pay-check-mate/v1/designations', data).then((data: any) => {
            let designation = data.data.map((item: DesignationType) => {
                return {
                    id: item.id,
                    name: item.name,
                }
            })

            setDesignations(designation);
            setSelectedDesignation(designation[0])
        }).catch((e: unknown) => {
            console.log(e, 'error');
        })
        makeGetRequest('/pay-check-mate/v1/departments', data).then((data: any) => {
            let department = data.data.map((item: DepartmentType) => {
                return {
                    id: item.id,
                    name: item.name,
                }
            })

            setDepartments(department);
            setSelectedDepartment(department[0])
        }).catch((e: unknown) => {
            console.log(e, 'error');
        })
    }, []);

    const handleFormInputChange = (e: any) => {
        const {name, value} = e.target;
        setFormValues({...formValues, [name]: value});
    }

    const handleSubmit = (e: any) => {
        setFormData(formValues);
    }
    return (
        <>
            <div className="space-y-12">
                <form className="bg-white sm:rounded-xl md:col-span-2" onSubmit={handleSubmit}>
                    <div className="px-4 py-6 sm:p-8">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <FormInput required={true} label={__('First name', 'pcm')} name='first_name' id='first_name' value={formValues.first_name} onChange={handleFormInputChange} />
                            </div>

                            <div className="sm:col-span-3">
                                <FormInput required={true} label={__('Last name', 'pcm')} name='last_name' id='last_name' value={formValues.last_name} onChange={handleFormInputChange} />
                            </div>
                            <div className="sm:col-span-3">
                                <SelectBox required={true} title={__('Department', 'pcm')} options={departments} selected={selectedDepartment} setSelected={setSelectedDepartment}></SelectBox>
                            </div>
                            <div className="sm:col-span-3">
                                <SelectBox required={true} title={__('Designation', 'pcm')} options={designations} selected={selectedDesignation} setSelected={setSelectedDesignation}></SelectBox>
                            </div>
                            <div className="sm:col-span-3">
                                <FormInput label={__('Employee id', 'pcm')} name='employee_id' id='employee_id' value={formValues.employee_id} onChange={handleFormInputChange} />
                            </div>
                            <div className="sm:col-span-3">
                                <FormInput label={__('Email address', 'pcm')} name='email' id='email' value={formValues.email} onChange={handleFormInputChange} />
                            </div>
                            <div className="col-span-full">
                                <Textarea label={__("Address", 'pcm')} name='address' id='address' value={formValues.address} onChange={handleFormInputChange} />
                            </div>
                            <div className="col-span-full">
                                <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                                    Photo
                                </label>
                                <div className="mt-2 flex items-center gap-x-3">
                                    <UserCircleIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
                                    <FormInput type='file' label={__('', 'pcm')} name='photo' id='photo' value={formValues.phone} onChange={handleFormInputChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                    {children ? children : ''}
                </form>
            </div>
        </>
    )
}