import {Button} from "../../Components/Button";
import {CheckCircleIcon} from "@heroicons/react/24/outline";
import {Table} from "../../Components/Table";
import {__} from "@wordpress/i18n";
import {useEffect, useState} from "@wordpress/element";
import {Modal} from "../../Components/Modal";
import useFetchApi from "../../Helpers/useFetchApi";
import {EmployeeType} from "../../Types/EmployeeType";
import {filtersType} from "../../Store/Store";

export const EmployeeList = () => {
    const [showViewModal, setShowViewModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const per_page = 20;
    const {
        loading,
        models,
        totalPage,
        setFilterObject,
        filterObject,
        total
    } = useFetchApi<EmployeeType>('/pay-check-mate/v1/employees', {page: 1, per_page}, true);
    const [employees, setEmployees] = useState([] as EmployeeType[]);
    useEffect(() => {
        if (models) {
            setEmployees(models);
            setTotalPages(totalPage as number);
        }
    },[models, filterObject])

    const handleFilterChange = (filterObject: filtersType) => {
        setFilterObject(filterObject);
        setCurrentPage(filterObject.page);
    };

    const viewEmployee = (id: number) => {
        setShowViewModal(true);
    }

    const columns = [
        {
            title: 'Employee ID',
            dataIndex: 'employee_id',
            sortable: true,
        },
        {
            title: 'Name',
            dataIndex: 'first_name',
            sortable: true,
            render: (text: string, record: any) => {
                return (
                    <a href="#" className="text-indigo-600 hover:text-indigo-900">
                        {text}
                    </a>
                )
            }
        },
        {title: 'Email', dataIndex: 'email'},
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text: string, record: any) => {
                return (
                    <div className="flex">
                        <button onClick={() => viewEmployee(record.id)} className="text-green-600 hover:text-green-900">
                            {__('Salary increment', 'pcm')}
                        </button>
                        <span className="mx-2 text-gray-300">|</span>
                        <button className="text-indigo-600 hover:text-indigo-900">
                            {__('Edit info', 'pcm')}
                        </button>
                        <span className="mx-2 text-gray-300">|</span>
                        <button className="text-red-600 hover:text-red-900">
                            {__('Terminate', 'pcm')}
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
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <Button className="hover:text-white" path='/add-user'>
                            <CheckCircleIcon className="w-5 h-5 mr-2 -ml-1 text-white" aria-hidden="true"/>
                            {__('Add Employee', 'pcm')}
                        </Button>
                        {showModal && (
                            <Modal setShowModal={setShowModal}/>
                        )}
                    </div>
                </div>
                <Table
                    columns={columns}
                    total={total}
                    data={employees}
                    isLoading={loading}
                    totalPage={totalPages}
                    per_page={per_page}
                    currentPage={currentPage}
                    onFilterChange={handleFilterChange}
                />
            </div>
        </>
    )
}
