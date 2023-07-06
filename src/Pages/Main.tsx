import {Sidebar} from "./Sidebar";
import {Route, Routes} from "react-router-dom";
import {Dashboard} from "./Dashboard";
import {userIs} from "../Helpers/User";
import {AddEmployee} from "./Employee/AddEmployee";
import {DepartmentList} from "./Department/DepartmentList";
import {EmptyState} from "../Components/EmptyState";
import {Card} from "../Components/Card";
import {DesignationList} from "./Designation/DesignationList";
import {SalaryHeadList} from "./SalaryHead/SalaryHeadList";
import {EmployeeList} from "./Employee/EmployeeList";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {PayrollList} from "./Payroll/PayrollList";
import CreatePayroll from "./Payroll/CreatePayroll";
import ViewPayroll from "./Payroll/ViewPayroll";

export default function Main() {
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
                                {userIs(['administrator', 'pay_check_mate_accountant', 'pay_check_mate_employee']) && (<Route path='departments' element={<DepartmentList />}/>)}
                                {userIs(['administrator', 'pay_check_mate_accountant', 'pay_check_mate_employee']) && (<Route path='designations' element={<DesignationList />}/>)}
                                {userIs(['administrator', 'pay_check_mate_accountant', 'pay_check_mate_employee']) && (<Route path='salary-heads' element={<SalaryHeadList />}/>)}
                                {userIs(['administrator', 'pay_check_mate_accountant', 'pay_check_mate_employee']) && (<Route path='payroll' element={<PayrollList />}/>)}
                                {userIs(['administrator', 'pay_check_mate_accountant', 'pay_check_mate_employee']) && (<Route path='payroll/:id' element={<ViewPayroll />}/>)}
                                {userIs(['administrator', 'pay_check_mate_accountant', 'pay_check_mate_employee']) && (<Route path='generate-payroll' element={<CreatePayroll />}/>)}
                                {userIs(['administrator', 'pay_check_mate_accountant', 'pay_check_mate_employee']) && (<Route path="*" element={<Card><EmptyState /></Card>} />)}
                            </Routes>
                            <div>
                                <ToastContainer
                                    newestOnTop={false}
                                    closeOnClick
                                    rtl={false}
                                    pauseOnFocusLoss={false}
                                    draggable={false}
                                    pauseOnHover
                                    theme="light"
                                />
                            </div>
                        </div>
                    </main>
                </div>
            )}
        </>
    )
}
