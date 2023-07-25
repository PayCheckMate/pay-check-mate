import {EmployeeDetails} from "../Employee/EmployeeDetails";
import {UserType} from "../../Types/UserType";
import {__} from "@wordpress/i18n";


export const Profile = () => {
    // @ts-ignore
    const currentUser = payCheckMate.currentUser as UserType;
    return (
        <>
            <EmployeeDetails employee_id={currentUser.data.employee.employee_id} page_title={__('My Profile', 'pcm')}/>
        </>
    );
}
