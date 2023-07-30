import {Fragment, useState} from '@wordpress/element'
import {BanknotesIcon, Bars3Icon, ChartPieIcon, CogIcon, CurrencyDollarIcon, HomeIcon, UserGroupIcon, UserPlusIcon, XMarkIcon} from "@heroicons/react/24/outline";
import {Dialog, Transition} from "@headlessui/react";
import {NavigationType} from "../Types/NavigationType";
import {NavbarLink} from "../Components/NavbarLink";
import {__} from "@wordpress/i18n";
import {applyFilters} from "../Helpers/Hooks";


let navigation: NavigationType[] = [
    {key: 'dashboard', title: __('Dashboard', 'pcm'), href: '/', icon: HomeIcon, current: false, roles: ['pay_check_mate_accountant', 'pay_check_mate_employee']},
    {key: 'employees', title: __('Employees', 'pcm'), href: 'employees', icon: UserGroupIcon, current: false, roles: ['pay_check_mate_accountant']},
    {key: 'profile', title: __('Profile', 'pcm'), href: 'profile', icon: UserPlusIcon, current: false, roles: ['pay_check_mate_employee']},
    {key: 'payslip', title: __('Pay Slip', 'pcm'), href: 'pay-slip', icon: BanknotesIcon, current: false, roles: ['pay_check_mate_accountant', 'pay_check_mate_employee']},
    {key: 'payroll', title: __('Payroll', 'pcm'), href: 'payroll', icon: CurrencyDollarIcon, current: false, roles: ['pay_check_mate_accountant']},
    {key: 'settings', title: __('Settings', 'pcm'), href: 'settings', icon: CogIcon, current: false, roles: ['pay_check_mate_accountant'],
        children: [
            {key: 'departments', title: __('Departments', 'pcm'), href: 'departments', current: false, roles: ['pay_check_mate_accountant']},
            {key: 'designations', title: __('Designations', 'pcm'), href: 'designations', current: false, roles: ['pay_check_mate_accountant']},
            {key: 'salary_heads', title: __('Salary Heads', 'pcm'), href: 'salary-heads', current: false, roles: ['pay_check_mate_accountant']},
        ]
    },
    {key: 'reports', title: __('Reports', 'pcm'), href: 'reports', icon: ChartPieIcon, current: false, roles: ['pay_check_mate_accountant'],
        children: [
            {key: 'payroll_report', title: __('Payroll', 'pcm'), href: 'reports/payroll-report', current: false, roles: ['pay_check_mate_accountant'], icon: null},
        ]
    },
] as NavigationType[];

navigation = applyFilters('pcm.sidebar_navigations', navigation);

export const Sidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    return (
        <>
            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog as="div" className="relative lg:hidden z-[99999]" onClose={setSidebarOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-900/80" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                        <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                                            <span className="sr-only">
                                                {__('Close sidebar', 'pcm')}
                                            </span>
                                            <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                        </button>
                                    </div>
                                </Transition.Child>
                                {/* Sidebar component, swap this element with another sidebar if you like */}
                                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
                                    <nav className="flex mt-16 flex-1 flex-col">
                                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                            <li>
                                                <ul role="list" className="-mx-2 space-y-1">
                                                    <NavbarLink
                                                        navigation={navigation}
                                                    />
                                                </ul>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Static sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col z-[9999]">
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 mt-10">
                    <nav className="flex mt-16 flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul role="list" className="-mx-2 space-y-1 mt-2.5">
                                    <NavbarLink
                                        navigation={navigation}
                                    />
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
                <button type="button" className="-m-2.5 p-2.5 text-gray-400 lg:hidden" onClick={() => setSidebarOpen(true)}>
                    <span className="sr-only">
                        {__('Open sidebar', 'pcm')}
                    </span>
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
            </div>
        </>
    )
}
