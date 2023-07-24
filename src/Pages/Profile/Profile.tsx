import {EmployeeDetails} from "../Employee/EmployeeDetails";
import {UserType} from "../../Types/UserType";


export const Profile = () => {
    // @ts-ignore
    const currentUser = payCheckMate.currentUser as UserType;
    return (
        <>
            <EmployeeDetails employee_id={currentUser.data.employee.employee_id} />
        </>
    );
}
