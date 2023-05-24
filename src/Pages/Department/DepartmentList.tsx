import {__} from "@wordpress/i18n";
import {Button} from "../../Components/Button";
import {CheckCircleIcon} from "@heroicons/react/24/outline";
import {Table} from "../../Components/Table";
import {useEffect, useState} from "@wordpress/element";
import {DepartmentStatus, DepartmentType} from "../../Types/DepartmentType";
import useFetchApi from "../../Helpers/useFetchApi";
import {data} from "autoprefixer";

export const DepartmentList = () => {
    const [departments, setDepartments] = useState<DepartmentType[]>([])
    // @ts-ignore
    const {models, loading, makeDeleteRequest, makePutRequest} = useFetchApi('/pay-check-mate/v1/departments');
    useEffect(() => {
        if (models) {
            setDepartments(models as DepartmentType[]);
        }
    }, [models]);

    const columns = [
        {title: 'Department name', dataIndex: 'department_name'},
        {title: 'Status', dataIndex: 'status',
            render: (text: string, record: DepartmentType) => {
            const status = parseInt(String(record.status))
                return (
                    <span className={`${status === DepartmentStatus.Active ? 'text-green-600' : 'text-red-600'}`}>
                        {status === DepartmentStatus.Active ? __('Active', 'pcm') : __('Inactive', 'pcm')}
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
                        {__('View', 'pcm')}
                    </button>
                    <span className="mx-2 text-gray-300">|</span>
                    <button className="text-indigo-600 hover:text-indigo-900">
                        {__('Edit', 'pcm')}
                    </button>
                    <span className="mx-2 text-gray-300">|</span>
                    <button onClick={()=>deleteDepartment(record.id)} className="text-red-600 hover:text-red-900">
                        {__('Delete', 'pcm')}
                    </button>
                    <span className="mx-2 text-gray-300">|</span>
                    <button onClick={()=>inactive(record.id)} className="text-red-600 hover:text-red-900">
                        {__('Inactive', 'pcm')}
                    </button>
                </div>
            )
        }
    ]

    const deleteDepartment = (id: number) => {
        try {
            makeDeleteRequest(`/pay-check-mate/v1/departments/${id}`, false).then((data: unknown) => {
                setDepartments(departments.filter((department: DepartmentType) => department.id !== id))
            }).catch((e: unknown) => {
                console.log(e);
            })
        } catch (error) {
            console.log(error); // Handle the error accordingly
        }
        // apiFetch({path: `/pay-check-mate/v1/departments/${id}`, method: 'DELETE'}).then((data: unknown) => {
        //     setDepartments(departments.filter((department: DepartmentType) => department.id !== id))
        // });
    }

    const inactive = (id: number) => {
        const status = DepartmentStatus.Inactive;
        const department_name = departments.find((department: DepartmentType) => department.id === id)?.department_name;
        // @ts-ignore
        const _wpnonce = payCheckMate.pay_check_mate_nonce;
        console.log(_wpnonce)
        const data = {id, department_name, status, _wpnonce};
        try {
            makePutRequest(`/pay-check-mate/v1/departments/${id}`, data, false).then((data: unknown) => {
                setDepartments(departments.map((department: DepartmentType) => {
                    // if (department.id === id) {
                    //     department.status = status;
                    // }
                    return department;
                }))
            }).catch((e: unknown) => {
                console.log(e);
            })
        }catch (error) {
            console.log(error); // Handle the error accordingly
        }
    }
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
                <Table columns={columns} data={departments} isLoading={loading}/>
            </div>
        </>
    )
}