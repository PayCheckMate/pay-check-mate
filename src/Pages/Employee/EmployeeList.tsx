import {Button} from "../../Components/Button";
import {CheckCircleIcon} from "@heroicons/react/24/outline";
import {Table} from "../../Components/Table";
import {__} from "@wordpress/i18n";
import React, {useEffect, useState} from "@wordpress/element";
import {Modal} from "../../Components/Modal";
import useFetchApi from "../../Helpers/useFetchApi";
import {EmployeeType} from "../../Types/EmployeeType";

export const EmployeeList = () => {
    const [showViewModal, setShowViewModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const {
        loading,
        models,
        totalPage,
        setFilterObject,
        filterObject,
    } = useFetchApi<EmployeeType>('/pay-check-mate/v1/employees', {page: 1, per_page: 10}, true);
    const [employees, setEmployees] = useState([] as EmployeeType[]);
    useEffect(() => {
        if (models) {
            setEmployees(models);
            setTotalPages(totalPage as number);
        }
    },[models, filterObject])

    const handlePageChange = (page: number) => {
        setFilterObject({'per_page': 10, 'page': page}); // Update the filter object with the new page value
        setCurrentPage(page);
    };

    const viewEmployee = (id: number) => {
        setShowViewModal(true);
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'employee_first_name',
            render: (text: string, record: any) => {
                return (
                    <a href="#" className="text-indigo-600 hover:text-indigo-900">
                        {text}
                    </a>
                )
            }
        },
        {title: 'Email', dataIndex: 'employee_email'},
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text: string, record: any) => {
                return (
                    <div className="flex">
                        <button onClick={() => viewEmployee(record.id)} className="text-green-600 hover:text-green-900">
                            {__('View', 'pcm')}
                        </button>
                        <span className="mx-2 text-gray-300">|</span>
                        <button className="text-indigo-600 hover:text-indigo-900">
                            {__('Edit', 'pcm')}
                        </button>
                        <span className="mx-2 text-gray-300">|</span>
                        <button className="text-red-600 hover:text-red-900">
                            {__('Delete', 'pcm')}
                        </button>
                    </div>
                );
            },
        },
    ];
    const [showModal, setShowModal] = useState(false);
    return (
        <>
            {showViewModal && <Modal setShowModal={setShowViewModal}/>}
            <div>
                <div className="sm:flex sm:items-center mb-6">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">
                            {__('Employee List', 'pcm')}
                        </h1>
                        <p className="mt-2 text-sm text-gray-700">
                            A list of all the users in your account including their name, title, email and role.
                            {/*<Button onClick={() => setShowModal(true)}>Open Modal</Button>*/}
                        </p>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <Button className="hover:text-white" path='/add-user'>
                            <CheckCircleIcon className="w-5 h-5 mr-2 -ml-1 text-white" aria-hidden="true"/>
                            {__('Add user', 'pcm')}
                        </Button>
                        {showModal && (
                            <Modal setShowModal={setShowModal}/>
                        )}
                    </div>
                </div>
                <Table
                    columns={columns}
                    data={employees}
                    isLoading={loading}
                    totalPage={totalPages}
                    pageSize={10}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>
        </>
    )
}
