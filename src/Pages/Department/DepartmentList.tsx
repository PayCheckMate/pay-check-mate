import {__} from "@wordpress/i18n";
import {Button} from "../../Components/Button";
import {CheckCircleIcon} from "@heroicons/react/24/outline";
import {Table} from "../../Components/Table";
import React, {useState} from "@wordpress/element";
import {DepartmentStatus, DepartmentType} from "../../Types/DepartmentType";
import {Modal} from "../../Components/Modal";
import {FormInput} from "../../Components/FormInput";
import {useDispatch, useSelect} from "@wordpress/data";
import department from "../../Store/Department";
import {toast} from "react-toastify";
import useNotify from "../../Helpers/useNotify";
import {validateRequiredFields} from "../../Helpers/useValidateRequiredFields";

export const DepartmentList = () => {
    const dispatch = useDispatch();
    const per_page = '10';
    const {departments, loading, totalPages, filters} = useSelect((select) => select(department).getDepartments({per_page: per_page, page: 1}), []);
    const [formData, setFormData] = useState<DepartmentType>({} as DepartmentType);
    const [formError, setFormError] = useState({} as { [key: string]: string});
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(filters.page);


    const columns = [
        {title: 'Department name', dataIndex: 'name'},
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
                    <button className="text-indigo-600 hover:text-indigo-900" onClick={() => handleModal(record)}>
                        {__('Edit', 'pcm')}
                    </button>
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

    const getDepartments = (id: number) => {
        return departments.find((department: DepartmentType) => department.id === id);
    }

    const handleStatus = (id: number, status: number) => {
        const name = getDepartments(id)?.name;
        // @ts-ignore
        const _wpnonce = payCheckMate.pay_check_mate_nonce;
        const data = {id, name, status, _wpnonce};
        dispatch(department).updateDepartment(data).then((response: any) => {
            useNotify(response, __('Department status updated successfully', 'pcm'));
        }).catch((error: any) => {
            console.log(error)
            toast.error(__('Something went wrong while updating department', 'pcm'), {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000
            });
        })
    }

    const handleModal = (data: DepartmentType) => {
        if (data) {
            setFormData(data)
        }
        setShowModal(true)
        setFormError({})
    };

    const handlePageChange = (page: number) => {
        dispatch(department).getDepartments({per_page: per_page, page: page});
        setCurrentPage(page);
    };


    const handleSubmit = (event: any) => {
        event.preventDefault();
        const data = formData
        // @ts-ignore
        data._wpnonce = payCheckMate.pay_check_mate_nonce;
        // Handle required fields
        const requiredFields = ['name'];
        const errors = validateRequiredFields(data, requiredFields, setFormError);
        if (Object.keys(errors).length > 0) {
            toast.error(__('Please fill all required fields', 'pcm'), {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: false
            });

            return;
        }

        if (formData.id) {
            dispatch(department).updateDepartment(data).then((response: any) => {
                console.log(response)
                useNotify(response, __('Department updated successfully', 'pcm'));
            }).catch((error: any) => {
                console.log(error)
                toast.error(__('Something went wrong while updating department', 'pcm'), {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000
                });
            })

            setShowModal(false);
        } else {
            dispatch(department).createDepartment(data).then((response: any) => {
                useNotify(response, __('Department created successfully', 'pcm'));
            }).catch((error: any) => {
                console.log(error)
                toast.error(__('Something went wrong while creating department', 'pcm'), {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000
                });
            })
            setShowModal(false);
        }
    }
    return (
        <>
            <div>
                <div className="sm:flex sm:items-center mb-6">
                    <div className="sm:flex-auto">
                        <h1 className="heading text-base font-semibold leading-6 text-gray-900">
                            {__('Department list', 'pcm')}
                        </h1>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <Button onClick={() => handleModal({} as DepartmentType)} className="hover:text-white active:text-white">
                            <CheckCircleIcon className="w-5 h-5 mr-2 -ml-1 text-white" aria-hidden="true" />
                            {__('Add department', 'pcm')}
                        </Button>
                        {showModal && (
                            <Modal setShowModal={setShowModal} header={__('Add department', 'pcm')}>
                                {/*Create a form to save department*/}
                                <div className="mt-5 md:mt-0 md:col-span-2">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <FormInput
                                            label={__('Department name', 'pcm')}
                                            name="name"
                                            id="name"
                                            value={formData.name}
                                            error={formError.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            required={true}
                                        />
                                        <Button className="mt-4" onClick={() => handleSubmit(event)}>
                                            {formData.id ? __('Update', 'pcm') : __('Save', 'pcm')}
                                        </Button>
                                    </form>
                                </div>
                            </Modal>
                        )}
                    </div>
                </div>
                <Table
                    columns={columns}
                    data={departments}
                    isLoading={loading}
                    totalPage={totalPages}
                    pageSize={parseInt(per_page)}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>
        </>
    )
}
