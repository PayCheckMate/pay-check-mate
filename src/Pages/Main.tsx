import {Sidebar} from "../Components/Sidebar";
import {Route, Routes} from "react-router-dom";
import {Dashboard} from "./Dashboard";
import {EmployeeList} from "./EmployeeList";
import {userCan, userIs} from "../Helpers/User";
import {store as coreData} from '@wordpress/core-data'
import {useSelect} from '@wordpress/data'
import {AddEmployee} from "./AddEmployee";
import {DepartmentList} from "./Department/DepartmentList";

export default function Main() {
    useSelect((select) => {
        console.log(select(coreData).getCurrentUser())
    }, [])
    const userRole = userIs('administrator') || userIs('wp_payroll_accountant') || userIs('wp_payroll_employee');
    return (
        <>
            {userRole && (
                <div>
                    <Sidebar/>
                    <main className="pb-12 lg:pl-72">
                        <div className="sm:px-6 lg:px-2">
                            <Routes>
                                {userIs(['administrator', 'wp_payroll_accountant']) && (<Route path="/" element={<Dashboard/>}/>)}
                                {userIs(['administrator', 'wp_payroll_accountant', 'wp_payroll_employee']) && (<Route path="employees" element={<EmployeeList/>}/>)}
                                {userIs(['administrator', 'wp_payroll_accountant', 'wp_payroll_employee']) && (<Route path="add-user" element={<AddEmployee/>}/>)}
                                <Route path='departments' element={<DepartmentList />}/>
                                <Route path="*" element={<h1>Not Found</h1>}/>
                            </Routes>
                        </div>
                    </main>
                </div>
            )}
        </>
    )
}
