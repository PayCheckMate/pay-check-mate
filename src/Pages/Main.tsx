import {Sidebar} from "../Components/Sidebar";
import {Route, Routes} from "react-router-dom";
import {Dashboard} from "./Dashboard";
import {EmployeeList} from "./EmployeeList";
import {userCan, userIs} from "../Helpers/User";
import {store as coreData} from '@wordpress/core-data'
import {useSelect} from '@wordpress/data'
import {AddEmployee} from "./AddEmployee";
import {DepartmentList} from "./Department/DepartmentList";
import {EmptyState} from "../Components/EmptyState";
import {Card} from "../Components/Card";
import {DesignationList} from "./Designation/DesignationList";

export default function Main() {
    useSelect((select) => {
        console.log(select(coreData).getCurrentUser())
    }, [])
    const userRole = userIs('administrator') || userIs('pay_check_mate_accountant') || userIs('pay_check_mate_employee');
    return (
        <>
            {userRole && (
                <div>
                    <Sidebar/>
                    <main className="pb-12 lg:pl-72">
                        <div className="sm:px-6 lg:px-2">
                            <Routes>
                                {userIs(['administrator', 'pay_check_mate_accountant']) && (<Route path="/" element={<Dashboard/>}/>)}
                                {userIs(['administrator', 'pay_check_mate_accountant', 'pay_check_mate_employee']) && (<Route path="employees" element={<EmployeeList/>}/>)}
                                {userIs(['administrator', 'pay_check_mate_accountant', 'pay_check_mate_employee']) && (<Route path="add-user" element={<AddEmployee/>}/>)}
                                <Route path='departments' element={<DepartmentList />}/>
                                <Route path='designations' element={<DesignationList />}/>
                                <Route path="*" element={<Card><EmptyState /></Card>} />
                            </Routes>
                        </div>
                    </main>
                </div>
            )}
        </>
    )
}
