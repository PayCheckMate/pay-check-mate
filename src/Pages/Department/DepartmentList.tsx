import {__} from "@wordpress/i18n";
import {Button} from "../../Components/Button";
import {CheckCircleIcon} from "@heroicons/react/24/outline";
import {Table} from "../../Components/Table";
import {useEffect, useState} from "@wordpress/element";
import {DepartmentStatus, DepartmentType} from "../../Types/DepartmentType";
import useFetchApi from "../../Helpers/useFetchApi2";
import {Modal} from "../../Components/Modal";

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
                    <button className="text-green-600 hover:text-green-900">
                        {__('View', 'pcm')}
                    </button>
                    <span className="mx-2 text-gray-300">|</span>
                    <button className="text-indigo-600 hover:text-indigo-900">
                        {__('Edit', 'pcm')}
                    </button>
                    <span className="mx-2 text-gray-300">|</span>
                    <button onClick={() => deleteDepartment(record.id)} className="text-red-600 hover:text-red-900">
                        {__('Delete', 'pcm')}
                    </button>
                    {parseInt(String(record.status)) === DepartmentStatus.Active && (
                        <>
                            <span className="mx-2 text-gray-300">|</span>
                            <button onClick={() => inactive(record.id)} className="text-red-600 hover:text-red-900">
                                {__('Inactive', 'pcm')}
                            </button>
                        </>
                    )}
                    {parseInt(String(record.status)) === DepartmentStatus.Inactive && (
                        <>
                            <span className="mx-2 text-gray-300">|</span>
                            <button onClick={() => active(record.id)} className="text-green-600 hover:text-green-900">
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

    const inactive = (id: number) => {
        const status = DepartmentStatus.Inactive;
        const department_name = getDepartments(id)?.department_name;
        // @ts-ignore
        const _wpnonce = payCheckMate.pay_check_mate_nonce;
        const data = {id, department_name, status, _wpnonce};
        try {
            makePutRequest(`/pay-check-mate/v1/departments/${id}`, data, false).then((data: unknown) => {
                setDepartments(departments.map((department: DepartmentType) => {
                    if (department.id === id) {
                        department.status = status;
                    }
                    return department;
                }))
            }).catch((e: unknown) => {
                console.log(e);
            })
        } catch (error) {
            console.log(error); // Handle the error accordingly
        }
    }

    const active = (id: number) => {
        const status = DepartmentStatus.Active;
        const department_name = getDepartments(id)?.department_name;
        // @ts-ignore
        const _wpnonce = payCheckMate.pay_check_mate_nonce;
        const data = {id, department_name, status, _wpnonce};
        try {
            makePutRequest(`/pay-check-mate/v1/departments/${id}`, data, false).then((data: unknown) => {
                setDepartments(departments.map((department: DepartmentType) => {
                    if (department.id === id) {
                        department.status = status;
                    }
                    return department;
                }))
            }).catch((e: unknown) => {
                console.log(e);
            })
        } catch (error) {
            console.log(error); // Handle the error accordingly
        }
    }

    const handleButtonClick = () => {
        setShowModal(true)
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        const data = formData
        // @ts-ignore
        data._wpnonce = payCheckMate.pay_check_mate_nonce;
        console.log(data)
        try {
            makePostRequest('/pay-check-mate/v1/departments', data, false).then((data: DepartmentType) => {
                setDepartments([...models, formData])
                setShowModal(false)
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
                        <Button onClick={handleButtonClick} className="hover:text-white active:text-white">
                            <CheckCircleIcon className="w-5 h-5 mr-2 -ml-1 text-white" aria-hidden="true"/>
                            Add department
                        </Button>
                        {showModal && (
                            <Modal setShowModal={setShowModal} header={__('Add department', 'pcm')}>
                                {/*Create a form to save department*/}
                                <div className="mt-5 md:mt-0 md:col-span-2">
                                    <form onSubmit={handleSubmit}>
                                        <div className="shadow sm:rounded-md sm:overflow-hidden">
                                            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                                                <div className="grid grid-cols-3 gap-6">
                                                    <div className="col-span-3 sm:col-span-2">
                                                        <label htmlFor="department_name"
                                                                className="block text-sm font-medium text-gray-700">
                                                            {__('Department name', 'pcm')}
                                                        </label>
                                                        <div className="mt-1 flex rounded-md shadow-sm">
                                                            <input type="text" name="department_name"
                                                                     id="department_name"
                                                                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                                                        placeholder={__('Department name', 'pcm')}
                                                                        value={formData.department_name}
                                                                   onChange={(e) => setFormData({...formData, department_name: e.target.value})}
                                                            />
                                                        </div>
                                                        {/*{errors.department_name && (*/}
                                                        {/*    <p className="mt-2 text-sm text-red-500">*/}
                                                        {/*        {__('Department name is required', 'pcm')}*/}
                                                        {/*    </p>*/}
                                                        {/*)}*/}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                                <button type="submit"
                                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                                                    {__('Save', 'pcm')}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </Modal>
                        )}
                    </div>
                </div>
                <Table columns={columns} data={departments} isLoading={loading}/>
            </div>
        </>
    )
}