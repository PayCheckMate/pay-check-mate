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
import {GeneralSettings} from "./Settings/GeneralSettings";
import { Onboarding } from "./Onboarding/Onboarding";

addAction('pay_check_mate_notification', 'pay_check_mate_notification', (message: string, type: string = 'success') => {
    // @ts-ignore
    toast[type](message);
});
export default function Main() {
    let navigations: NavigationType[] = [
        {key: 'dashboard', title: __('Dashboard', 'pay-check-mate'), href: '/', icon: HomeIcon, current: false, roles: ['pay_check_mate_admin', 'pay_check_mate_accountant', 'pay_check_mate_employee'], component: Dashboard},
        {key: 'employees', title: __('Employees', 'pay-check-mate'), href: 'employees', icon: UserGroupIcon, current: false, roles: ['pay_check_mate_accountant'], component: EmployeeList},
        {key: 'profile', title: __('Profile', 'pay-check-mate'), href: 'profile', icon: UserIcon, current: false, roles: ['pay_check_mate_employee'], component: Profile},
        {key: 'payslip', title: __('Pay Slip', 'pay-check-mate'), href: 'pay-slip', icon: DocumentTextIcon, current: false, roles: ['pay_check_mate_accountant', 'pay_check_mate_employee'], component: PaySlipList},
        {key: 'payroll', title: __('Payroll', 'pay-check-mate'), href: 'payroll', icon: RocketLaunchIcon, current: false, roles: ['pay_check_mate_accountant'], component: PayrollList},
        {key: '[need_pro]pro/payroll-salary-payment', title: __('Payroll Importer (PRO)', 'pay-check-mate'), href: 'pro/payroll-salary-payment', icon: BanknotesIcon, current: false, roles: ['pay_check_mate_admin', 'pay_check_mate_accountant'], component: NeedPro},
        {key: '[need_pro]pro/loans', title: __('Loans (PRO)', 'pay-check-mate'), href: 'pro/loans', icon: BanknotesIcon, current: false, roles: ['pay_check_mate_admin', 'pay_check_mate_accountant'], component: NeedPro},
        {key: '[need_pro]pro/final-payment', title: __('Final Payment (PRO)', 'pay-check-mate'), href: 'pro/final-payment', icon: BanknotesIcon, current: false, roles: ['pay_check_mate_admin', 'pay_check_mate_accountant'], component: NeedPro},
        {key: 'settings', title: __('Settings', 'pay-check-mate'), href: 'settings', icon: CogIcon, current: false, roles: ['pay_check_mate_accountant'],
            children: [
                {key: 'general', title: __('General', 'pay-check-mate'), href: 'general', current: false, roles: ['pay_check_mate_admin'], component: GeneralSettings},
                {key: 'departments', title: __('Departments', 'pay-check-mate'), href: 'departments', current: false, roles: ['pay_check_mate_accountant'], component: DepartmentList},
                {key: 'designations', title: __('Designations', 'pay-check-mate'), href: 'designations', current: false, roles: ['pay_check_mate_accountant'], component: DesignationList},
                {key: 'salary_heads', title: __('Salary Heads', 'pay-check-mate'), href: 'salary-heads', current: false, roles: ['pay_check_mate_accountant'], component: SalaryHeadList},
                {key: '[need_pro]pro/setup-gratuity', title: __('Setup Gratuity (PRO)', 'pay-check-mate'), href: 'pro/setup-gratuity', current: false, roles: ['pay_check_mate_admin', 'pay_check_mate_accountant'], icon: null, component: NeedPro},
                {key: '[need_pro]pro/setup-loans', title: __('Setup Loans (PRO)', 'pay-check-mate'), href: 'pro/setup-loans', current: false, roles: ['pay_check_mate_admin', 'pay_check_mate_accountant'], icon: null, component: NeedPro},
                {key: '[need_pro]pro/setup-pf', title: __('Setup P.F. (PRO)', 'pay-check-mate'), href: 'pro/setup-pf', current: false, roles: ['pay_check_mate_admin', 'pay_check_mate_accountant'], icon: null, component: NeedPro},
                // {key: 'onboarding', title: __('Onboarding', 'pay-check-mate'), href: 'onboarding', current: false, roles: ['pay_check_mate_admin'], component: Onboarding},
            ]
        },
        {key: 'reports', title: __('Reports', 'pay-check-mate'), href: 'reports', icon: ChartPieIcon, current: false, roles: ['pay_check_mate_accountant'],
            children: [
                {key: 'payroll_register', title: __('Payroll Register', 'pay-check-mate'), href: 'reports/payroll-register', current: false, roles: ['pay_check_mate_accountant'], icon: null, component: PayrollRegister},
                {key: 'payroll_ledger', title: __('Payroll Ledger', 'pay-check-mate'), href: 'reports/payroll-ledger', current: false, roles: ['pay_check_mate_accountant'], icon: null, component: PayrollLedger},
                {key: '[need_pro]pro/pf-register', title: __('P.F. Register (PRO)', 'pay-check-mate'), href: 'pro/pf-register', current: false, roles: ['pay_check_mate_admin', 'pay_check_mate_accountant'], icon: null, component: NeedPro},
                {key: '[need_pro]pro/pf-ledger', title: __('P.F. Ledger (PRO)', 'pay-check-mate'), href: 'pro/pf-ledger', current: false, roles: ['pay_check_mate_admin', 'pay_check_mate_accountant'], icon: null, component: NeedPro },
                {key: '[need_pro]pro/gratuity-register', title: __('Gratuity Register (PRO)', 'pay-check-mate'), href: 'pro/gratuity-register', current: false, roles: ['pay_check_mate_admin', 'pay_check_mate_accountant'], icon: null, component: NeedPro},
                {key: '[need_pro]pro/gratuity-ledger', title: __('Gratuity Ledger (PRO)', 'pay-check-mate'), href: 'pro/gratuity-ledger', current: false, roles: ['pay_check_mate_admin', 'pay_check_mate_accountant'], icon: null, component: NeedPro},
                {key: '[need_pro]pro/loan-register', title: __('Loan Register (PRO)', 'pay-check-mate'), href: 'pro/loan-register', current: false, roles: ['pay_check_mate_admin', 'pay_check_mate_accountant'], icon: null, component: NeedPro},
                {key: '[need_pro]pro/loan-ledger', title: __('Loan Ledger (PRO)', 'pay-check-mate'), href: 'pro/loan-ledger', current: false, roles: ['pay_check_mate_admin', 'pay_check_mate_accountant'], icon: null, component: NeedPro},
            ]
        },
    ] as NavigationType[];

    navigations = applyFilters('pay_check_mate.sidebar_navigations', navigations);
    let paths = [
        {key: 'add-employee', href: 'add-employee', roles: ['pay_check_mate_accountant', 'pay_check_mate_employee'], component: AddEmployee},
        {key: 'employee-edit', href: '/employee/edit/:id', roles: ['pay_check_mate_accountant', 'pay_check_mate_employee'], component: AddEmployee},
        {key: 'employee-details', href: '/employee/:id', roles: ['pay_check_mate_accountant', 'pay_check_mate_employee'], component: EmployeeDetails},
        {key: 'pay-slip-details', href: 'pay-slip/view/:id', roles: ['pay_check_mate_accountant', 'pay_check_mate_employee'], component: PaySlipDetails},
        {key: 'view-payroll', href: 'payroll/:id', roles: ['pay_check_mate_accountant'], component: ViewPayroll},
        {key: 'edit-payroll', href: 'payroll/edit/:id', roles: ['pay_check_mate_accountant'], component: CreatePayroll},
        {key: 'create-payroll', href: 'generate-payroll', roles: ['pay_check_mate_accountant'], component: CreatePayroll},
        {key: 'import-employee', href: 'import-employee', roles: ['pay_check_mate_accountant'], component: ImportEmployee},
        {key: 'onboarding', href: 'onboarding', roles: ['pay_check_mate_admin'], component: Onboarding}
    ];
    paths = applyFilters('pay_check_mate.routes', paths);

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
                </div>
            )}
        </>
    )
}
