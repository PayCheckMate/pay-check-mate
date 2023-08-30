import React from "@wordpress/element";
import {Sidebar} from "./Sidebar";
import {Route, Routes} from "react-router-dom";
import {Dashboard} from "./Dashboard";
import {userIs} from "../Helpers/User";
import {DepartmentList} from "./Department/DepartmentList";
import {DesignationList} from "./Designation/DesignationList";
import {SalaryHeadList} from "./SalaryHead/SalaryHeadList";
import {EmployeeList} from "./Employee/EmployeeList";

import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {PayrollList} from "./Payroll/PayrollList";
import {PaySlipList} from "./Payroll/PaySlip/PaySlipList";
import {Profile} from "./Profile/Profile";
import {PayrollRegister} from "./Reports/PayrollRegister";
import {PayrollLedger} from "./Reports/PayrollLedger";
import {NavigationType} from "../Types/NavigationType";
import {__} from "@wordpress/i18n";
import {BanknotesIcon, ChartPieIcon, CogIcon, DocumentTextIcon, HomeIcon, RocketLaunchIcon, UserGroupIcon, UserIcon} from "@heroicons/react/24/outline";
import {applyFilters} from "../Helpers/Hooks";
import {Card} from "../Components/Card";
import {NotFound} from "../Components/404";
import {AddEmployee} from "./Employee/AddEmployee";
import {EmployeeDetails} from "./Employee/EmployeeDetails";
import {PaySlipDetails} from "./Payroll/PaySlip/PaySlipDetails";
import CreatePayroll from "./Payroll/CreatePayroll";
import {addAction} from "../Helpers/Hooks";
import ViewPayroll from "./Payroll/ViewPayroll";
import {NeedPro} from "../Components/NeedPro/NeedPro";
import {ImportEmployee} from "./Employee/ImportEmployee";

addAction('pcm_notification', 'pcm_notification', (message: string, type: string = 'success') => {
    // @ts-ignore
    toast[type](message);
});
export default function Main() {
    let navigations: NavigationType[] = [
        {key: 'dashboard', title: __('Dashboard', 'pcm'), href: '/', icon: HomeIcon, current: false, roles: ['pay_check_mate_accountant', 'pay_check_mate_employee'], component: Dashboard},
        {key: 'employees', title: __('Employees', 'pcm'), href: 'employees', icon: UserGroupIcon, current: false, roles: ['pay_check_mate_accountant'], component: EmployeeList},
        {key: 'profile', title: __('Profile', 'pcm'), href: 'profile', icon: UserIcon, current: false, roles: ['pay_check_mate_employee'], component: Profile},
        {key: 'payslip', title: __('Pay Slip', 'pcm'), href: 'pay-slip', icon: DocumentTextIcon, current: false, roles: ['pay_check_mate_accountant', 'pay_check_mate_employee'], component: PaySlipList},
        {key: 'payroll', title: __('Payroll', 'pcm'), href: 'payroll', icon: RocketLaunchIcon, current: false, roles: ['pay_check_mate_accountant'], component: PayrollList},
        {key: '[need_pro]pro/payroll-salary-payment', title: __('Payroll Importer (PRO)', 'pcm'), href: 'pro/payroll-salary-payment', icon: BanknotesIcon, current: false, roles: ['pay_check_mate_admin', 'pay_check_mate_accountant', 'pay_check_mate_employee'], component: NeedPro},
        {key: '[need_pro]pro/loans', title: __('Loans (PRO)', 'pcm'), href: 'pro/loans', icon: BanknotesIcon, current: false, roles: ['pay_check_mate_admin', 'pay_check_mate_accountant', 'pay_check_mate_employee'], component: NeedPro},
        {key: '[need_pro]pro/final-payment', title: __('Final Payment (PRO)', 'pcm'), href: 'pro/final-payment', icon: BanknotesIcon, current: false, roles: ['pay_check_mate_admin', 'pay_check_mate_accountant', 'pay_check_mate_employee'], component: NeedPro},
        {key: 'settings', title: __('Settings', 'pcm'), href: 'settings', icon: CogIcon, current: false, roles: ['pay_check_mate_accountant'],
            children: [
                {key: 'departments', title: __('Departments', 'pcm'), href: 'departments', current: false, roles: ['pay_check_mate_accountant'], component: DepartmentList},
                {key: 'designations', title: __('Designations', 'pcm'), href: 'designations', current: false, roles: ['pay_check_mate_accountant'], component: DesignationList},
                {key: 'salary_heads', title: __('Salary Heads', 'pcm'), href: 'salary-heads', current: false, roles: ['pay_check_mate_accountant'], component: SalaryHeadList},
                {key: '[need_pro]pro/setup-gratuity', title: __('Setup Gratuity (PRO)', 'pcm'), href: 'pro/setup-gratuity', current: false, roles: ['pay_check_mate_admin', 'pay_check_mate_accountant'], icon: null, component: NeedPro},
                {key: '[need_pro]pro/setup-loans', title: __('Setup Loans (PRO)', 'pcm'), href: 'pro/setup-loans', current: false, roles: ['pay_check_mate_admin', 'pay_check_mate_accountant'], icon: null, component: NeedPro},
                {key: '[need_pro]pro/setup-pf', title: __('Setup P.F. (PRO)', 'pcm'), href: 'pro/setup-pf', current: false, roles: ['pay_check_mate_admin', 'pay_check_mate_accountant'], icon: null, component: NeedPro}
            ]
        },
        {key: 'reports', title: __('Reports', 'pcm'), href: 'reports', icon: ChartPieIcon, current: false, roles: ['pay_check_mate_accountant'],
            children: [
                {key: 'payroll_register', title: __('Payroll Register', 'pcm'), href: 'reports/payroll-register', current: false, roles: ['pay_check_mate_accountant'], icon: null, component: PayrollRegister},
                {key: 'payroll_ledger', title: __('Payroll Ledger', 'pcm'), href: 'reports/payroll-ledger', current: false, roles: ['pay_check_mate_accountant'], icon: null, component: PayrollLedger},
                {key: '[need_pro]pro/pf-register', title: __('P.F. Register (PRO)', 'pcm'), href: 'pro/pf-register', current: false, roles: ['pay_check_mate_admin', 'pay_check_mate_accountant'], icon: null, component: NeedPro},
                {key: '[need_pro]pro/pf-ledger', title: __('P.F. Ledger (PRO)', 'pcm'), href: 'pro/pf-ledger', current: false, roles: ['pay_check_mate_admin', 'pay_check_mate_accountant'], icon: null, component: NeedPro },
                {key: '[need_pro]pro/gratuity-register', title: __('Gratuity Register (PRO)', 'pcm'), href: 'pro/gratuity-register', current: false, roles: ['pay_check_mate_admin', 'pay_check_mate_accountant'], icon: null, component: NeedPro},
                {key: '[need_pro]pro/gratuity-ledger', title: __('Gratuity Ledger (PRO)', 'pcm'), href: 'pro/gratuity-ledger', current: false, roles: ['pay_check_mate_admin', 'pay_check_mate_accountant'], icon: null, component: NeedPro},
                {key: '[need_pro]pro/loan-register', title: __('Loan Register (PRO)', 'pcm'), href: 'pro/loan-register', current: false, roles: ['pay_check_mate_admin', 'pay_check_mate_accountant'], icon: null, component: NeedPro},
                {key: '[need_pro]pro/loan-ledger', title: __('Loan Ledger (PRO)', 'pcm'), href: 'pro/loan-ledger', current: false, roles: ['pay_check_mate_admin', 'pay_check_mate_accountant'], icon: null, component: NeedPro},
            ]
        },
    ] as NavigationType[];

    navigations = applyFilters('pcm.sidebar_navigations', navigations);
    let paths = [
        {key: 'add-employee', href: 'add-employee', roles: ['pay_check_mate_accountant', 'pay_check_mate_employee'], component: AddEmployee},
        {key: 'employee-edit', href: '/employee/edit/:id', roles: ['pay_check_mate_accountant', 'pay_check_mate_employee'], component: AddEmployee},
        {key: 'employee-details', href: '/employee/:id', roles: ['pay_check_mate_accountant', 'pay_check_mate_employee'], component: EmployeeDetails},
        {key: 'pay-slip-details', href: 'pay-slip/view/:id', roles: ['pay_check_mate_accountant', 'pay_check_mate_employee'], component: PaySlipDetails},
        {key: 'view-payroll', href: 'payroll/:id', roles: ['pay_check_mate_accountant'], component: ViewPayroll},
        {key: 'edit-payroll', href: 'payroll/edit/:id', roles: ['pay_check_mate_accountant'], component: CreatePayroll},
        {key: 'create-payroll', href: 'generate-payroll', roles: ['pay_check_mate_accountant'], component: CreatePayroll},
        {key: 'import-employee', href: 'import-employee', roles: ['pay_check_mate_accountant'], component: ImportEmployee}
    ];
    paths = applyFilters('pcm.routes', paths);

    const userRole = userIs('administrator') || userIs('pay_check_mate_accountant') || userIs('pay_check_mate_employee');
    return (
        <>
            {userRole && (
                <div>
                    <Sidebar navigations={navigations}/>
                    <main className="pb-12 lg:pl-72">
                        <div className="sm:px-6 lg:px-2">
                            <Routes>
                                <Route path="*" element={<Card><NotFound /></Card>} />
                                {navigations.map((navigation, index) => {
                                        if (navigation.children) {
                                            return navigation.children.map((child, index) => {
                                                const component = typeof child.component === 'function'
                                                return (
                                                    component ? userIs(child.roles) && (<Route key={index} path={child.href} element={<child.component/>}/>) : <Route path="*" element={<Card><NotFound /></Card>} />
                                                )
                                            })
                                        }else {
                                            const component = typeof navigation.component === 'function'
                                            return (
                                                component ? userIs(navigation.roles) && (<Route key={index} path={navigation.href} element={<navigation.component/>}/>) : <Route path="*" element={<Card><NotFound /></Card>} />
                                            )
                                        }
                                    })
                                }

                                {paths.map((path, index) => {
                                        const component = typeof path.component === 'function'
                                        return (
                                            component ? userIs(path.roles) && (<Route key={index} path={path.href} element={<path.component/>}/>) : <Route path="*" element={<Card><NotFound /></Card>} />
                                        )
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
                    {applyFilters('pcm.theme_switcher', '') }
                </div>
            )}
        </>
    )
}
