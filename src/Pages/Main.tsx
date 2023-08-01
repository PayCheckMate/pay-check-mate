import React from "@wordpress/element";
import {Sidebar} from "./Sidebar";
import {Route, Routes} from "react-router-dom";
import {Dashboard} from "./Dashboard";
import {userIs} from "../Helpers/User";
import {DepartmentList} from "./Department/DepartmentList";
import {DesignationList} from "./Designation/DesignationList";
import {SalaryHeadList} from "./SalaryHead/SalaryHeadList";
import {EmployeeList} from "./Employee/EmployeeList";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {PayrollList} from "./Payroll/PayrollList";
import {PaySlipList} from "./Payroll/PaySlip/PaySlipList";
import {Profile} from "./Profile/Profile";
import PayrollReport from "./Reports/PayrollReport";
import {NavigationType} from "../Types/NavigationType";
import {__} from "@wordpress/i18n";
import {BanknotesIcon, ChartPieIcon, CogIcon, CurrencyDollarIcon, HomeIcon, UserGroupIcon, UserPlusIcon} from "@heroicons/react/24/outline";
import {applyFilters} from "../Helpers/Hooks";
import {Card} from "../Components/Card";
import {NotFound} from "../Components/404";

export default function Main() {
    let navigations: NavigationType[] = [
        {key: 'dashboard', title: __('Dashboard', 'pcm'), href: '/', icon: HomeIcon, current: false, roles: ['pay_check_mate_accountant', 'pay_check_mate_employee'], component: Dashboard},
        {key: 'employees', title: __('Employees', 'pcm'), href: 'employees', icon: UserGroupIcon, current: false, roles: ['pay_check_mate_accountant'], component: EmployeeList},
        {key: 'profile', title: __('Profile', 'pcm'), href: 'profile', icon: UserPlusIcon, current: false, roles: ['pay_check_mate_employee'], component: Profile},
        {key: 'payslip', title: __('Pay Slip', 'pcm'), href: 'pay-slip', icon: BanknotesIcon, current: false, roles: ['pay_check_mate_accountant', 'pay_check_mate_employee'], component: PaySlipList},
        {key: 'payroll', title: __('Payroll', 'pcm'), href: 'payroll', icon: CurrencyDollarIcon, current: false, roles: ['pay_check_mate_accountant'], component: PayrollList},
        {key: 'settings', title: __('Settings', 'pcm'), href: 'settings', icon: CogIcon, current: false, roles: ['pay_check_mate_accountant'],
            children: [
                {key: 'departments', title: __('Departments', 'pcm'), href: 'departments', current: false, roles: ['pay_check_mate_accountant'], component: DepartmentList},
                {key: 'designations', title: __('Designations', 'pcm'), href: 'designations', current: false, roles: ['pay_check_mate_accountant'], component: DesignationList},
                {key: 'salary_heads', title: __('Salary Heads', 'pcm'), href: 'salary-heads', current: false, roles: ['pay_check_mate_accountant'], component: SalaryHeadList},
            ]
        },
        {key: 'reports', title: __('Reports', 'pcm'), href: 'reports', icon: ChartPieIcon, current: false, roles: ['pay_check_mate_accountant'],
            children: [
                {key: 'payroll_report', title: __('Payroll', 'pcm'), href: 'reports/payroll-report', current: false, roles: ['pay_check_mate_accountant'], icon: null, component: PayrollReport},
            ]
        },
    ] as NavigationType[];

    navigations = applyFilters('pcm.sidebar_navigations', navigations);
    const userRole = userIs('administrator') || userIs('pay_check_mate_accountant') || userIs('pay_check_mate_employee');
    return (
        <>
            {userRole && (
                <div>
                    <Sidebar navigations={navigations}/>
                    <main className="pb-12 lg:pl-72">
                        <div className="sm:px-6 lg:px-2">
                            <Routes>
                            {navigations.map((navigation, index) => {
                                    if (navigation.children) {
                                        return navigation.children.map((child, index) => {
                                            const component = typeof child.component === 'function'
                                            return (
                                                component ? <Route path={child.href} element={<child.component/>}/> : <Route path="*" element={<Card><NotFound /></Card>} />
                                            )
                                        })
                                    }else {
                                        const component = typeof navigation.component === 'function'
                                        return (
                                            component ? <Route path={navigation.href} element={<navigation.component/>}/> : <Route path="*" element={<Card><NotFound /></Card>} />
                                        )
                                    }
                                })
                            }
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
