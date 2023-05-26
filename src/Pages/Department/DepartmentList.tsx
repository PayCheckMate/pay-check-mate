import {__} from "@wordpress/i18n";
import {Button} from "../../Components/Button";
import {CheckCircleIcon} from "@heroicons/react/24/outline";
import {Table} from "../../Components/Table";
import {useEffect, useState} from "@wordpress/element";
import {DepartmentStatus, DepartmentType} from "../../Types/DepartmentType";
import useFetchApi from "../../Helpers/useFetchApi2";
import {Modal} from "../../Components/Modal";
import {FormInput} from "../../Components/FormInput";

export const DepartmentList = () => {
    const [formData, setFormData] = useState<DepartmentType>({} as DepartmentType);
    const [showModal, setShowModal] = useState(false);
    const [departments, setDepartments] = useState<DepartmentType[]>([])
    // @ts-ignore
    const {
        models,
        loading,
        makeDeleteRequest,
        makePutRequest,
        makePostRequest
    } = useFetchApi<DepartmentType>('/pay-check-mate/v1/departments');
    useEffect(() => {
        if (models) {
            setDepartments(models as DepartmentType[]);
        }
    }, [models]);

    const columns = [
        {title: 'ID', dataIndex: 'id'},
        {title: 'Department name', dataIndex: 'department_name'},
        {
            title: 'Status', dataIndex: 'status',
            render: (text: string, record: DepartmentType) => {
                const status = parseInt(String(record.status))
                return (
                    <span className={`${status === DepartmentStatus.Active ? 'text-green-600' : 'text-red-600'}`}>
                        {status === DepartmentStatus.Active ? __('Active', 'pcm') : __('Inactive', 'pcm')}
                    </span>
                )
            }
        },
        {
            title: 'Created on', dataIndex: 'created_on',
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
                    {/*<button className="text-green-600 hover:text-green-900">*/}
                    {/*    {__('View', 'pcm')}*/}
                    {/*</button>*/}
                    {/*<span className="mx-2 text-gray-300">|</span>*/}
                    <button className="text-indigo-600 hover:text-indigo-900" onClick={()=>handleModal(record)}>
                        {__('Edit', 'pcm')}
                    </button>
                    {/*<span className="mx-2 text-gray-300">|</span>*/}
                    {/*<button onClick={() => deleteDepartment(record.id)} className="text-red-600 hover:text-red-900">*/}
                    {/*    {__('Delete', 'pcm')}*/}
                    {/*</button>*/}
                    {parseInt(String(record.status)) === DepartmentStatus.Active && (
                        <>
                            <span className="mx-2 text-gray-300">|</span>
                            <button onClick={() => handleStatus(record.id, 0)} className="text-red-600 hover:text-red-900">
                                {__('Inactive', 'pcm')}
                            </button>
                        </>
                    )}
                    {parseInt(String(record.status)) === DepartmentStatus.Inactive && (
                        <>
                            <span className="mx-2 text-gray-300">|</span>
                            <button onClick={() => handleStatus(record.id, 1)} className="text-green-600 hover:text-green-900">
                                {__('Active', 'pcm')}
                            </button>
                        </>
                    )}
                </div>
            )
        }
    ]

    const deleteDepartment = (id: number) => {
        try {
            makeDeleteRequest(`/pay-check-mate/v1/departments/${id}`, false).then((data: unknown) => {
                setDepartments(models.filter((department: DepartmentType) => department.id !== id))
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

    const getDepartments = (id: number) => {
        return departments.find((department: DepartmentType) => department.id === id);
    }

    const handleStatus = (id: number, status: number) => {
        const department_name = getDepartments(id)?.department_name;
        // @ts-ignore
        const _wpnonce = payCheckMate.pay_check_mate_nonce;
        const data = {id, department_name, status, _wpnonce};
        try {
            makePutRequest(`/pay-check-mate/v1/departments/${id}`, data, false).then((data: unknown) => {
                if (data) {
                    setDepartments(models.map((department: DepartmentType) => {
                        if (department.id === id) {
                            department.status = status;
                        }
                        return department;
                    }))
                }
            }).catch((e: unknown) => {
                console.log(e);
            })
        } catch (error) {
            console.log(error); // Handle the error accordingly
        }
    }

    const handleModal = (data: DepartmentType) => {
        if (data) {
            setFormData(data)
        }
        setShowModal(true)
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        const data = formData
        // @ts-ignore
        data._wpnonce = payCheckMate.pay_check_mate_nonce;
        if (formData.id) {
            try {
                makePutRequest(`/pay-check-mate/v1/departments/${formData.id}`, data, false).then((data: DepartmentType) => {
                    setDepartments(models.map((department: DepartmentType) => {
                        if (department.id === formData.id) {
                            department.department_name = formData.department_name;
                        }
                        return department;
                    }))
                    setShowModal(false)
                }).catch((e: unknown) => {
                    console.log(e);
                })
            } catch (error) {
                console.log(error); // Handle the error accordingly
            }
        } else {
            try {
                makePostRequest('/pay-check-mate/v1/departments', data, false).then((data: DepartmentType) => {
                    setDepartments([...models, formData])
                    setShowModal(false)
                }).catch((e: unknown) => {
                    console.log(e);
                })
            } catch (error) {
                console.log(error); // Handle the error accordingly
            }
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
                        <Button onClick={()=>handleModal({} as DepartmentType)} className="hover:text-white active:text-white">
                            <CheckCircleIcon className="w-5 h-5 mr-2 -ml-1 text-white" aria-hidden="true" />
                            Add department
                        </Button>
                        {showModal && (
                            <Modal setShowModal={setShowModal} header={__('Add department', 'pcm')}>
                                {/*Create a form to save department*/}
                                <div className="mt-5 md:mt-0 md:col-span-2">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <FormInput label={__('Department name', 'pcm')} name="department_name" id="department_name" value={formData.department_name} onChange={(e) => setFormData({...formData, department_name: e.target.value})} />
                                        <Button className="mt-4" onClick={()=>handleSubmit(event)}>
                                            {__('Add department', 'pcm')}
                                        </Button>
                                    </form>
                                </div>
                            </Modal>
                        )}
                    </div>
                </div>
                <Table columns={columns} data={departments} isLoading={loading} />
            </div>
        </>
    )
}