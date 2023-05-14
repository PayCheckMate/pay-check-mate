import {Card} from "../Components/Card";
import {Link} from "react-router-dom";
import {Button} from "../Components/Button";
import {CheckCircleIcon} from "@heroicons/react/24/outline";
import {Table} from "../Components/Table";
import {__} from "@wordpress/i18n";

const people = [
    { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
    { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton2@example.com', role: 'Member' },
    { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton21@example.com', role: 'Member' },
    { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton11@example.com', role: 'Member' },
    { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton12312@example.com', role: 'Member' },
    { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton1211@example.com', role: 'Member' },
    { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton1231242@example.com', role: 'Member' },
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
    { title: 'Title', dataIndex: 'title' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Role', dataIndex: 'role' },
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
    return (
        <div className="">
            <div className="sm:flex sm:items-center mb-6">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">Employee list</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all the users in your account including their name, title, email and role.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <Button path='/add-user'>
                        <CheckCircleIcon className="w-5 h-5 mr-2 -ml-1 text-white" aria-hidden="true"/>
                            Add user
                    </Button>
                </div>
            </div>
            <Table columns={columns} data={people} />
                {/*<table className="min-w-full divide-y divide-gray-300">*/}
                {/*    <thead className="bg-gray-50">*/}
                {/*    <tr>*/}
                {/*        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">*/}
                {/*            Name*/}
                {/*        </th>*/}
                {/*        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">*/}
                {/*            Title*/}
                {/*        </th>*/}
                {/*        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">*/}
                {/*            Email*/}
                {/*        </th>*/}
                {/*        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">*/}
                {/*            Role*/}
                {/*        </th>*/}
                {/*        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">*/}
                {/*            <span className="sr-only">Edit</span>*/}
                {/*        </th>*/}
                {/*    </tr>*/}
                {/*    </thead>*/}
                {/*    <tbody className="divide-y divide-gray-200 bg-white">*/}
                {/*    {people.map((person) => (*/}
                {/*        <tr key={person.email}>*/}
                {/*            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">*/}
                {/*                {person.name}*/}
                {/*            </td>*/}
                {/*            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.title}</td>*/}
                {/*            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.email}</td>*/}
                {/*            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.role}</td>*/}
                {/*            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">*/}
                {/*                <a href="#" className="text-indigo-600 hover:text-indigo-900">*/}
                {/*                    Edit<span className="sr-only">, {person.name}</span>*/}
                {/*                </a>*/}
                {/*            </td>*/}
                {/*        </tr>*/}
                {/*    ))}*/}
                {/*    </tbody>*/}
                {/*</table>*/}
        </div>
    )
}
