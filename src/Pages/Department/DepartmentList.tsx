import {__} from "@wordpress/i18n";
import {Button} from "../../Components/Button";
import {CheckCircleIcon} from "@heroicons/react/24/outline";
import {Table} from "../../Components/Table";
import React from "@wordpress/element";
import {DepartmentStatus, DepartmentType} from "../../Types/DepartmentType";

export const DepartmentList = () => {
    const departments: DepartmentType[] = [
        {id: 1, department_name: __('Human Resource', 'wp-payroll'), status: DepartmentStatus.Active, created_on: '2021-09-01 12:00:00', updated_at: ''},
        {id: 2, department_name: __('Accounts', 'wp-payroll'), status: DepartmentStatus.Active, created_on: '2021-09-01 12:00:00', updated_at: ''},
        {id: 3, department_name: __('Marketing', 'wp-payroll'), status: DepartmentStatus.Inactive, created_on: '2021-09-01 12:00:00', updated_at: ''},
        {id: 4, department_name: __('Content', 'wp-payroll'), status: DepartmentStatus.Active, created_on: '2021-09-01 12:00:00', updated_at: ''},
        {id: 5, department_name: __('Design', 'wp-payroll'), status: DepartmentStatus.Active, created_on: '2021-09-01 12:00:00', updated_at: ''},
        {id: 6, department_name: __('Engineering', 'wp-payroll'), status: DepartmentStatus.Active, created_on: '2021-09-01 12:00:00', updated_at: ''},
    ]
    const columns = [
        {title: 'Department name', dataIndex: 'department_name'},
        {title: 'Status', dataIndex: 'status',
            render: (text: string, record: DepartmentType) => {
                return (
                    <span className={`${record.status === DepartmentStatus.Active ? 'text-green-600' : 'text-red-600'}`}>
                        {record.status === DepartmentStatus.Active ? __('Active', 'wp-payroll') : __('Inactive', 'wp-payroll')}
                    </span>
                )
            }
        },
        {title: 'Created on', dataIndex: 'created_on',
            render: (text: string, record: DepartmentType) => {
                return (
                    <span>
                        {record.created_on}
                    </span>
                )
            }
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text: string, record: DepartmentType) => (
                <div className="flex">
                    <button className="text-green-600 hover:text-green-900">
                        {__('View', 'wp-payroll')}
                    </button>
                    <span className="mx-2 text-gray-300">|</span>
                    <button className="text-indigo-600 hover:text-indigo-900">
                        {__('Edit', 'wp-payroll')}
                    </button>
                    <span className="mx-2 text-gray-300">|</span>
                    <button className="text-red-600 hover:text-red-900">
                        {__('Delete', 'wp-payroll')}
                    </button>
                </div>
            )
        }
    ]
    return (
        <>
            <div>
                <div className="sm:flex sm:items-center mb-6">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">Department list</h1>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <Button className="hover:text-white active:text-white" path='#'>
                            <CheckCircleIcon className="w-5 h-5 mr-2 -ml-1 text-white" aria-hidden="true"/>
                            Add department
                        </Button>
                    </div>
                </div>
                <Table columns={columns} data={departments}/>
            </div>
        </>
    )
}