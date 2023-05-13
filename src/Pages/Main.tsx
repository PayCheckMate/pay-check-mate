import {Sidebar} from "../Components/Sidebar";
import {Route, Routes} from "react-router-dom";
import {Dashboard} from "./Dashboard";
import {EmployeeList} from "./EmployeeList";
import {userCan, userIs} from "../Helpers/User";

export default function Main() {
    const userRole = userIs('administrator') || userIs('wp_payroll_accountant') || userIs('wp_payroll_employee');
    return (
        <>
            {userRole && (
                <div>
                    <Sidebar/>
                    <main className="pb-12 lg:pl-72">
                        <div className="px-4 sm:px-6 lg:px-2">
                            <Routes>
                                {userIs('wp_payroll_accountant') && (<Route path="/" element={<Dashboard/>}/>)}
                                <Route path="/employees" element={<EmployeeList/>}/>
                            </Routes>
                        </div>
                    </main>
                </div>
            )}
        </>
    )
}
