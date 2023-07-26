import {SelectBox} from "../../Components/SelectBox";
import {SelectBoxType} from "../../Types/SalaryHeadType";
import {__} from "@wordpress/i18n";
import {Button} from "../../Components/Button";
import {CheckCircleIcon} from "@heroicons/react/24/outline";
import {SalaryInformation} from "./Components/SalaryInformation";
import {useState} from "@wordpress/element";
import {SalaryInformationType} from "./Components/ReviewInformation";
import {validateRequiredFields} from "../../Helpers/Helpers";
import useFetchApi from "../../Helpers/useFetchApi";
import {EmployeeStatus, EmployeeType} from "../../Types/EmployeeType";
import {toast} from "react-toastify";
import {userCan, userIs} from "../../Helpers/User";
import {UserCapNames} from "../../Types/UserType";
import {Card} from "../../Components/Card";
import {PermissionDenied} from "../../Components/404";
import {SalaryPurposeType} from "../../Types/SalaryHistoryType";
import {useSelect} from "@wordpress/data";
import designation from "../../Store/Designation";

export const Increment = ({employee, setData=()=>{}}: { employee: EmployeeType, setData?: ()=>void }) => {
    if (!employee) {
        toast.error(__('Employee not found.', 'pcm'));
        return null;
    }
    if (employee.status === EmployeeStatus.Inactive) {
        toast.error(__('Employee is inactive. Please active employee first.', 'pcm'));
        return null;
    }
    const [salaryData, setSalaryData] = useState({} as any);
    const handleSalaryInformation = (salary: string) => {
        setSalaryData(salary)
    }
    const purposeOptions = [
        {id: 2, name: __('Salary Increment', 'pcm')},
        {id: 3, name: __('Promotion', 'pcm')}
    ] as SelectBoxType[];
    const {designations} = useSelect((select) => select(designation).getDesignations({per_page: '-1', status: '1'}), []);
    const [selectedPurpose, setSelectedPurpose] = useState({} as SelectBoxType);
    const [selectedDesignation, setSelectedDesignation] = useState<SelectBoxType>({} as SelectBoxType);
    const {makePostRequest} = useFetchApi('', {}, false);
    const [formError, setFormError] = useState({} as { [key: string]: string });
    const submitSalaryIncrement = () => {
        if (salaryData.purpose === SalaryPurposeType.Promotion && !salaryData.designation_id) {
            setFormError((prevState) => ({
                ...prevState,
                designation_id: __('Designation is required.', 'pcm')
            }));
            return;
        }
        const requiredFields = ['gross_salary', 'basic_salary', 'active_from', 'purpose'];
        const errors = validateRequiredFields(salaryData, requiredFields, setFormError);
        if (Object.keys(errors).length > 0) {
            return;
        }

        // @ts-ignore
        const _wpnonce = payCheckMate.pay_check_mate_nonce;
        let data = {
            '_wpnonce': _wpnonce,
            employee_id: employee.employee_id,
            designation_id: salaryData.designation_id,
            basic_salary: salaryData.basic_salary,
            gross_salary: salaryData.gross_salary,
            active_from: salaryData.active_from,
            remarks: salaryData.remarks,
            salary_purpose: salaryData.purpose,
        }

        // Delete all fields from salaryData that are included in data.
        Object.keys(data).forEach((key) => {
            // Check if key exists in salaryData.
            if (!salaryData.hasOwnProperty(key)) {
                // @ts-ignore
                delete salaryData[key];
            }
        });

        data = {
            ...data, ...{
                salary_details: salaryData,
            }
        };
        makePostRequest('/pay-check-mate/v1/salary-increment', data, false)
            .then((response) => {
                    setSalaryData({} as SalaryInformationType);
                    toast.success(__('Salary Incremented Successfully.', 'pcm'));
                    setData();
                }
            ).catch((error) => {
            toast.error(error.message);
        })

    }
    return (
        <>
            {!userCan(UserCapNames.pay_check_mate_add_employee) ? (
                <Card>
                    <PermissionDenied />
                </Card>
            ) : (
                <SalaryInformation
                    initialValues={{}}
                    formErrors={formError}
                    setSalaryData={(salary: string) => handleSalaryInformation(salary)}
                >
                    <div className="sm:col-span-3">
                        <SelectBox
                            required={true}
                            options={purposeOptions}
                            selected={selectedPurpose}
                            setSelected={(purpose) => {
                                // @ts-ignore
                                setSalaryData((prevState) => ({
                                    ...prevState,
                                    purpose: purpose.id,
                                }));
                                setSelectedPurpose(purpose);
                            }}
                            error={formError.purpose}
                            title={__('Purpose', 'pcm')}
                        />
                    </div>
                    {salaryData.purpose === SalaryPurposeType.Promotion && (
                        <div className="sm:col-span-3">
                            <SelectBox
                                required={true}
                                options={designations}
                                selected={selectedDesignation}
                                setSelected={(designation) => {
                                    // @ts-ignore
                                    setSalaryData((prevState) => ({
                                        ...prevState,
                                        designation_id: designation.id,
                                    }));
                                    setSelectedDesignation(designation)
                                }}
                                error={formError.designation_id}
                                title={__('Set Designation', 'pcm')}
                            />
                        </div>
                    )}
                    <div className="mt-10 flex justify-end">
                        <Button
                            className="hover:text-white"
                            onClick={() => submitSalaryIncrement()}
                        >
                            <CheckCircleIcon
                                className="w-5 h-5 mr-2 -ml-1 text-white"
                                aria-hidden="true"
                            />
                            {__('Add Salary', 'pcm')}
                        </Button>
                    </div>
                </SalaryInformation>
            )}
        </>
    )
}
