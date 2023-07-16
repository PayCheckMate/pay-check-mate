export const SalaryPaySlip = () => {
    return (
        <div className="bg-white rounded-md shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <img
              src="https://picsum.photos/200"
              alt="Company Logo"
              className="w-10 h-10 mr-2"
          />
          <div>
            <h2 className="text-xl font-semibold">Company Name</h2>
            <p className="text-gray-500">Pay Slip</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Pay Period: July 2023</h3>
          <p className="text-gray-500">Generated on: August 1, 2023</p>
        </div>
      </div>
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2">Employee Details</h4>
        <div className="flex justify-between">
          <p className="text-gray-500">Employee Name:</p>
          <p>John Doe</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Employee ID:</p>
          <p>EMP001</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Department:</p>
          <p>Finance</p>
        </div>
      </div>
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2">Earnings</h4>
        <div className="flex justify-between">
          <p className="text-gray-500">Basic Salary:</p>
          <p>$5,000</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Overtime:</p>
          <p>$200</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Bonus:</p>
          <p>$500</p>
        </div>
      </div>
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2">Deductions</h4>
        <div className="flex justify-between">
          <p className="text-gray-500">Tax:</p>
          <p>$500</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Insurance:</p>
          <p>$100</p>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between">
          <p className="text-gray-500">Total Earnings:</p>
          <p>$5,700</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Total Deductions:</p>
          <p>$600</p>
        </div>
        <div className="flex justify-between mt-2">
          <h3 className="text-lg font-semibold">Net Salary:</h3>
          <h3>$5,100</h3>
        </div>
      </div>
    </div>
    );
};
