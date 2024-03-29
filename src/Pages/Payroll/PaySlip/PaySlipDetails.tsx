import React from 'react';
import {Card} from "../../../Components/Card";
import {ArrowLeftIcon, PrinterIcon} from "@heroicons/react/24/outline";
import {handlePrint} from "../../../Helpers/Helpers";
import {Link, Navigate, useLocation} from "react-router-dom";
import {useSelect} from "@wordpress/data";
import salaryHead from "../../../Store/SalaryHead";
import {HeadType} from "../../../Types/SalaryHeadType";
import {__} from "@wordpress/i18n";
import department from "../../../Store/Department";
import designation from "../../../Store/Designation";
import {PrintButton} from "../../../Components/PrintButton";
import {useEffect, useState} from "@wordpress/element";
import {SettingsType} from "../../../Types/Settings";
import apiFetch from "@wordpress/api-fetch";
import {useSettings} from "../../../Helpers/useSettings";

export const PaySlipDetails = () => {
    const location = useLocation()
    const state = location.state
    if (!state || !state.data) {
        // Go back to the payslip list page
        return <Navigate to={'/pay-slip'} />
    }

    const data = state.data as any
    const employee = data.employee_information as any
    const {salaryHeads} = useSelect(select => select(salaryHead).getSalaryHeads({per_page: '-1', page: 1, order_by: 'head_type', order: 'asc'}), []);
    const {departments} = useSelect(select => select(department).getDepartments({per_page: '-1', page: 1, order_by: 'id', order: 'asc'}), []);
    const {designations} = useSelect(select => select(designation).getDesignations({per_page: '-1', page: 1, order_by: 'id', order: 'asc'}), []);
    const earnings = salaryHeads.filter((salaryHead: any) => parseInt(String(salaryHead.head_type)) === HeadType.Earning);
    const deductions = salaryHeads.filter((salaryHead: any) => parseInt(String(salaryHead.head_type)) === HeadType.Deduction);
    let totalEarning = 0;
    let totalDeduction = 0;
    const {settingsData} = useSettings();

    return (
        <Card>
            <div className="flex justify-between no-print">
                <>
                    <Link to={'/pay-slip'} className="text-blue-500 hover:text-blue-700 mr-2">
                        {/*Back icon*/}
                        <ArrowLeftIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
                    </Link>
                </>
                <>
                    <PrintButton onClick={() => handlePrint('printable')} />
                </>
            </div>
            <div
                className="p-8"
                id="printable"
            >
                <div className="flex items-center justify-between mb-8">
                    <div className="items-center">
                          <img
                              src={settingsData.company_logo}
                              alt="Company Logo"
                              className="w-20"
                          />
                            <h2 className="text-2xl font-bold">{settingsData.company_name}</h2>
                            <p className="text-gray-500">{__('Address:', 'pay-check-mate')} {settingsData.company_address}</p>
                            <p className="text-gray-500">{__('Phone:', 'pay-check-mate')} {settingsData.company_phone}</p>
                            <p className="text-gray-500">{__('Email:', 'pay-check-mate')} {settingsData.company_email}</p>
                            <p className="text-gray-500">{__('Website:', 'pay-check-mate')} {settingsData.company_website}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">{__('Employee Name:', 'pay-check-mate')} {employee.first_name} {employee.last_name}</p>
                        <p className="text-gray-500">{__('Employee ID:', 'pay-check-mate')} {employee.employee_id}</p>
                        <p className="text-gray-500">{__('Department:', 'pay-check-mate')} {departments.find((department: any) => department.id === employee.department_id)?.name}</p>
                        <p className="text-gray-500">{__('Designation:', 'pay-check-mate')} {designations.find((designation: any) => designation.id === employee.designation_id)?.name}</p>
                        <p className="text-gray-500">{__('Pay Slip for:', 'pay-check-mate')} {new Date(data.payroll_date).toLocaleDateString('default', {
                                year: 'numeric',
                                month: 'short',
                            })}
                        </p>
                    </div>
                  </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-lg font-bold">
                          {__('Earnings', 'pay-check-mate')}
                        </h3>
                        <table className="table-auto w-full">
                            <thead>
                            <tr>
                                <th className="border px-4 py-2">
                                    {__('Description', 'pay-check-mate')}
                                </th>
                                <th className="border px-4 py-2">
                                    {__('Amount', 'pay-check-mate')}
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {earnings.map((earning: any) => {
                                if (parseInt(String(earning.is_taxable)) === 0) return;
                                totalEarning += data.salary_details[earning.id] ? data.salary_details[earning.id] : 0;
                                return (
                                    <tr>
                                        <td className="border px-4 py-2">{earning.head_name}</td>
                                        <td className="border px-4 py-2 text-right">
                                            {data.salary_details[earning.id] ? data.salary_details[earning.id] : 0}
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Deductions</h3>
                        <table className="table-auto w-full">
                            <thead>
                            <tr>
                                <th className="border px-4 py-2">Description</th>
                                <th className="border px-4 py-2">Amount</th>
                            </tr>
                            </thead>
                            <tbody>
                                {deductions.map((deduction: any) => {
                                    if (parseInt(String(deduction.is_taxable)) === 0) return;
                                    totalDeduction += data.salary_details[deduction.id] ? data.salary_details[deduction.id] : 0;
                                    return (
                                        <tr>
                                        <td className="border px-4 py-2">{deduction.head_name}</td>
                                        <td className="border px-4 py-2 text-right">
                                            {data.salary_details[deduction.id] ? data.salary_details[deduction.id] : 0}
                                        </td>
                                    </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="pt-4">
                    <div className="flex justify-between">
                        <p className="text-gray-500">
                            {__('Basic Salary:', 'pay-check-mate')}
                        </p>
                        <p>
                            {data.basic_salary || 0}
                        </p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-gray-500">
                            {__('Total Earnings:', 'pay-check-mate')}
                        </p>
                        <p>{totalEarning}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-gray-500">
                            {__('Total Deductions:', 'pay-check-mate')}
                        </p>
                        <p>{totalDeduction}</p>
                    </div>
                    <div className="flex justify-between mt-2 border-t border-gray-200">
                        <h3 className="text-lg font-semibold">
                            {__('Net Pay:', 'pay-check-mate')}
                        </h3>
                        <h3>{(parseInt(data.basic_salary) + totalEarning) - totalDeduction}</h3>
                    </div>
                  </div>
            </div>
        </Card>
    );
};
