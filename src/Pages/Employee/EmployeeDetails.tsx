import {useParams} from "react-router-dom";
import {useEffect, useState} from "@wordpress/element";
import {EmployeeType, SingleEmployeeResponseType} from "../../Types/EmployeeType";
import {SalaryInformationType} from "./Components/ReviewInformation";
import {toast} from "react-toastify";
import {__} from "@wordpress/i18n";
import useFetchApi from "../../Helpers/useFetchApi";
import {useSelect} from "@wordpress/data";
import salaryHead from "../../Store/SalaryHead";
import {userCan} from "../../Helpers/User";
import {UserCapNames} from "../../Types/UserType";
import {Card} from "../../Components/Card";
import {PermissionDenied} from "../../Components/404";

export const EmployeeDetails = () => {
    const {makeGetRequest} = useFetchApi('', {}, false);
    const employeeId = useParams().id;
    const [personalInformation, setPersonalInformation] = useState({} as EmployeeType);
    const [salaryInformation, setSalaryInformation] = useState({} as SalaryInformationType);
    const {salaryHeads} = useSelect(select => select(salaryHead).getSalaryHeads(), []);

    useEffect(() => {
        if (employeeId){
            makeGetRequest<SingleEmployeeResponseType>('/pay-check-mate/v1/employees/' + employeeId, {}, true).then((response) => {
                if (response.status === 200) {
                    const employeeKeysToRemove = Object.keys(localStorage).filter(key => key.startsWith('Employee.'));
                    employeeKeysToRemove.forEach(key => localStorage.removeItem(key));
                    const salaryInformation = {
                        ...response.data.salaryInformation,
                        // @ts-ignore
                        ...JSON.parse(response.data.salaryInformation.salary_details),
                    };
                    delete salaryInformation.salary_details;
                    delete response.data.salaryInformation;
                    setPersonalInformation(response.data);
                    setSalaryInformation(salaryInformation as SalaryInformationType);
                } else {
                    toast.error(__('Something went wrong', 'pcm'));
                }
            });
        }
    }, [employeeId])
    return (
        <>
            {!userCan(UserCapNames.pay_check_mate_view_employee_details) ? (
                <Card>
                    <PermissionDenied />
                </Card>
            ) : (
                <div>
                    <h1>Employee Details</h1>
                    <div className="flex">
                        <div className="w-1/2">
                            <h3>Personal Information</h3>
                            <div className="flex justify-between">
                                <div>
                                    <p>Employee ID</p>
                                    <p>First Name</p>
                                    <p>Last Name</p>
                                    <p>Joining Date</p>
                                    <p>Address</p>
                                </div>
                                <div>
                                    <p>{personalInformation.employee_id}</p>
                                    <p>{personalInformation.first_name}</p>
                                    <p>{personalInformation.last_name}</p>
                                    <p>{new Date(personalInformation.joining_date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}</p>
                                    <p>{personalInformation.address}</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-1/2">
                            <h3>Salary Information</h3>
                            <div className="flex justify-between">
                                <div>
                                    <p>
                                        {__('Basic Salary', 'pcm')}
                                    </p>
                                    {salaryHeads && salaryHeads.map((salaryHead) => {
                                        return <p>{salaryHead.head_name}</p>
                                    })}
                                    <hr className={'my-2 w-full'}/>
                                    <p>
                                        {__('Total Salary', 'pcm')}
                                    </p>
                                </div>
                                <div>
                                    <p>{salaryInformation.basic_salary}</p>
                                    {salaryHeads && salaryHeads.map((salaryHead) => {
                                        if (salaryInformation[salaryHead.id]) {
                                            return <p>{salaryInformation[salaryHead.id]}</p>
                                        }
                                    })}
                                    <hr className={'my-2 w-full'}/>
                                    <p>{salaryInformation.gross_salary}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
