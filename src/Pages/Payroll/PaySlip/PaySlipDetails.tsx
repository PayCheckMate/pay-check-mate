import React from 'react';
import {Card} from "../../../Components/Card";
import {PrinterIcon} from "@heroicons/react/24/outline";
import {handlePrint} from "../../../Helpers/Helpers";

export const PaySlipDetails = () => {
    // Sample data for demonstration
    const companyName = 'ABC Company';
    const companyLogo = 'https://picsum.photos/200';
    const employeeName = 'John Doe';
    const employeeId = 'EMP001';
    const salary = 5000;
    const deductions = 1000;

    return (
        <Card>
            <div className="flex justify-end no-print">
                <PrinterIcon className="h-6 w-6 text-gray-500 cursor-pointer" onClick={() => handlePrint('printable')} />
            </div>
            <div className="p-8" id='printable'>
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                          <img
                              src={companyLogo}
                              alt="Company Logo"
                              className="w-12 h-12 mr-4"
                          />
                        <h2 className="text-xl font-bold">{companyName}</h2>
                    </div>
                    <div>
                        <p>Employee Name: {employeeName}</p>
                        <p>Employee ID: {employeeId}</p>
                    </div>
                  </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <h3 className="text-lg font-bold">Earnings</h3>
                      <table className="table-auto w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-2">Description</th>
                        <th className="px-4 py-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border px-4 py-2">Basic Salary</td>
                        <td className="border px-4 py-2 text-right">${salary}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                  <div>
                      <h3 className="text-lg font-bold">Deductions</h3>
                  <table className="table-auto w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-2">Description</th>
                        <th className="px-4 py-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border px-4 py-2">Tax</td>
                        <td className="border px-4 py-2">${deductions}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            </Card>
    );
};
