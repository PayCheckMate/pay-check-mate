import {Button} from "../Components/Button";
import {CheckCircleIcon} from "@heroicons/react/24/outline";
import {Table} from "../Components/Table";
import {__} from "@wordpress/i18n";
import React, {useState} from "@wordpress/element";
import {Modal} from "../Components/Modal";

const people = [
    {name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member'},
    {name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton2@example.com', role: 'Member'},
    {name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton21@example.com', role: 'Member'},
    {name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton11@example.com', role: 'Member'},
    {name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton12312@example.com', role: 'Member'},
    {name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton1211@example.com', role: 'Member'},
    {name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton1231242@example.com', role: 'Member'},
    // More people...
]

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        render: (text: string, record: any) => {
            return (
                <a href="#" className="text-indigo-600 hover:text-indigo-900">
                    {text}
                </a>
            )
        }
    },
    {title: 'Title', dataIndex: 'title'},
    {title: 'Email', dataIndex: 'email'},
    {title: 'Role', dataIndex: 'role'},
    {
        title: 'Action',
        dataIndex: 'action',
        render: (text: string, record: any) => {
            return (
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
            );
        },
    },
];

export const EmployeeList = () => {
    const [showModal, setShowModal] = useState(false);
    return (
        <div className="">
            <div className="sm:flex sm:items-center mb-6">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">Employee list</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all the users in your account including their name, title, email and role.
                        <Button onClick={() => setShowModal(true)}>Open Modal</Button>
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <Button className="hover:text-white" path='/add-user'>
                        <CheckCircleIcon className="w-5 h-5 mr-2 -ml-1 text-white" aria-hidden="true"/>
                        Add user
                    </Button>
                    {showModal && (
                        <Modal setShowModal={setShowModal} />
                    )}
                </div>
            </div>
            <Table columns={columns} data={people}/>
        </div>
    )
}
