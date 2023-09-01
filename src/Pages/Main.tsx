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
    const isPro = applyFilters('pcm.is_pro', false);
    const button = isPro ?
        <button
            onClick={()=>{}}
            title={__('B&W Theme', 'pcm')}
            className="fixed z-90 bottom-10 right-8 bg-indigo-200 w-16 h-16 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:bg-indigo-500 hover:drop-shadow-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 512 512"><path fill="#FFE46A" d="M411.111 183.926c0-87.791-68.91-158.959-153.914-158.959S103.283 96.136 103.283 183.926c0 39.7 14.093 75.999 37.392 103.856h-.001l33.666 61.027c8.793 16.28 12.057 26.792 26.792 26.792h109.774c14.736 0 19.071-11.07 26.792-26.792l36.022-61.027h-.002c23.299-27.857 37.393-64.156 37.393-103.856z"/><path fill="#FFF0B7" d="M112.805 203.285c0-90.721 68.378-165.701 157.146-177.719a150.851 150.851 0 0 0-13.319-.599c-85.004 0-153.914 71.169-153.914 158.959c0 28.89 7.469 55.974 20.512 79.319c-6.75-18.749-10.425-38.932-10.425-59.96z"/><path fill="#FFDA00" d="M411.111 184.266c0-31.445-8.843-60.755-24.097-85.428a160.416 160.416 0 0 1 4.917 39.416c0 104.454-101.138 189.522-227.481 192.967l9.89 17.929c8.793 16.28 12.057 26.792 26.792 26.792h109.774c14.736 0 19.071-11.07 26.792-26.792l36.022-61.027h-.002c23.299-27.858 37.393-64.157 37.393-103.857z"/><path fill="#FAAF63" d="M321.905 211.203c.149-.131.297-.251.447-.395c2.787-2.667 5.082-6.921 3.161-10.867c-7.879-16.176-31.97-21.308-49.524-15.951c-.889.271-1.751.566-2.588.885c-9.562-5.583-21.434-6.925-32.001-3.569a35.399 35.399 0 0 0-3.678 1.394c-5.785-3.38-12.552-5.066-19.294-4.414c-14.112 1.365-26.375 12.81-28.805 26.752l-1.112.688c9.617 15.541 34.93 60.071 36.552 79.233c2.045 24.174.002 89.793-.019 90.453l11.994.379c.086-2.723 2.086-66.978-.019-91.844c-.938-11.087-7.722-28.758-20.164-52.521c-5.807-11.092-11.445-20.83-14.858-26.576c2.36-7.646 9.61-13.848 17.586-14.619c2.429-.235 4.893.037 7.251.729a22.68 22.68 0 0 0-2.32 3.638c-4.047 7.935-2.356 17.898 3.933 23.176c3.725 3.125 9.137 4.276 14.127 3c4.647-1.188 8.239-4.242 9.854-8.379c1.451-3.718 1.328-8.01-.367-12.756a30.665 30.665 0 0 0-4.05-7.655a28.134 28.134 0 0 1 13.61.744c-1.715 1.975-3.027 4.173-3.89 6.556c-1.844 5.101-1.029 11.163 2.128 15.822c2.721 4.016 6.856 6.403 11.348 6.551c.15.005.301.008.45.008c3.935 0 7.67-1.692 10.562-4.797c3.397-3.647 5.126-8.71 4.624-13.544c-.319-3.073-1.412-6.079-3.172-8.867c12.236-2.223 24.205 1.911 29.383 8.186c-3.125 5.2-9.542 16.11-16.178 28.785c-12.441 23.764-19.227 41.435-20.164 52.521c-2.104 24.866-.104 89.121-.019 91.844l11.994-.379c-.021-.66-2.064-66.275-.019-90.453c1.459-17.251 22.113-55.046 33.237-73.758zm-80.657-3.171c-.279.716-1.331 1.035-1.647 1.116c-1.25.319-2.665.086-3.442-.565c-2.015-1.691-2.453-5.599-.957-8.532a11.21 11.21 0 0 1 1.85-2.583c1.611 1.828 2.892 3.926 3.707 6.208c.665 1.86.843 3.449.489 4.356zm32.19.654c-.351.375-1.065.992-1.839.976c-.831-.027-1.489-.819-1.808-1.289c-.993-1.467-1.312-3.527-.776-5.009c.618-1.71 1.811-3.109 3.203-4.235c1.55 1.751 2.501 3.634 2.688 5.434c.144 1.371-.447 3.027-1.468 4.123z"/><path fill="#6B83A5" d="M315.932 402.701H197.897c-6.6 0-12 5.4-12 12v6.957c0 6.6 5.4 12 12 12h38.122c-11.367 4.229-23.369 14.285-23.369 25.946v4.68c9.123 10.254 17.619 28.081 33.802 28.081h21.89c12.748 0 21.804-13.762 32.836-28.081v-4.68c0-11.661-11.451-21.717-22.548-25.946h37.302c6.6 0 12-5.4 12-12v-6.957c0-6.6-5.4-12-12-12z"/><path fill="#ABBDDB" d="M324.406 402.701H189.423c-6.6 0-12-5.4-12-12v-6.957c0-6.6 5.4-12 12-12h134.983c6.6 0 12 5.4 12 12v6.957c0 6.6-5.4 12-12 12zm-7.007 49.915v-6.957c0-6.6-5.4-12-12-12H208.43c-6.6 0-12 5.4-12 12v6.957c0 6.6 5.4 12 12 12h96.969c6.6 0 12-5.4 12-12z"/></svg>
        </button> : '';
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
                    {applyFilters('pcm.theme_switcher', button) }
                </div>
            )}
        </>
    )
}
