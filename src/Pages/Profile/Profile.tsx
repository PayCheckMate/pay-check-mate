import {EmployeeDetails} from "../Employee/EmployeeDetails";
import {UserType} from "../../Types/UserType";
import {__} from "@wordpress/i18n";
import {getCurrentEmployee} from "../../Helpers/Helpers";
import {EmployeeType} from "../../Types/EmployeeType";


export const Profile = () => {
    // @ts-ignore
    const currentUser = getCurrentEmployee() as EmployeeType;
    return (
        <>
            <EmployeeDetails employee_id={currentUser.employee_id} page_title={__('My Profile', 'pcm')}/>
        </>
    );
}
