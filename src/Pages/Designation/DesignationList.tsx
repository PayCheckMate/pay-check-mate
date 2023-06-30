import {__} from "@wordpress/i18n";
import {Button} from "../../Components/Button";
import {CheckCircleIcon} from "@heroicons/react/24/outline";
import {Table} from "../../Components/Table";
import React, {useState} from "@wordpress/element";
import {DesignationStatus, DesignationType} from "../../Types/DesignationType";
import {Modal} from "../../Components/Modal";
import {FormInput} from "../../Components/FormInput";
import {useDispatch, useSelect} from "@wordpress/data";
import designation from "../../Store/Designation";
import {toast} from "react-toastify";
import useNotify from "../../Helpers/useNotify";
import {validateRequiredFields} from "../../Helpers/Helpers";
import {filtersType} from "../../Store/Store";

export const DesignationList = () => {
    const dispatch = useDispatch();
    const per_page = '10';
    const {designations, loading, totalPages, filters, total} = useSelect((select) => select(designation).getDesignations({per_page: per_page, page: 1}), []);
    const [formData, setFormData] = useState<DesignationType>({} as DesignationType);
    const [formError, setFormError] = useState({} as { [key: string]: string });
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(filters.page);


    const columns = [
        {title: 'Designation name', dataIndex: 'name', sortable: true},
        {
            title: 'Status', dataIndex: 'status',
            render: (text: string, record: DesignationType) => {
                const status = parseInt(String(record.status))
                return (
                    <span className={`${status === DesignationStatus.Active ? 'text-green-600' : 'text-red-600'}`}>
                        {status === DesignationStatus.Active ? __('Active', 'pcm') : __('Inactive', 'pcm')}
                    </span>
                )
            }
        },
        {
            title: 'Created on', dataIndex: 'created_on',
            render: (text: string, record: DesignationType) => {
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
            render: (text: string, record: DesignationType) => (
                <div className="flex">
                    <button className="text-indigo-600 hover:text-indigo-900" onClick={() => handleModal(record)}>
                        {__('Edit', 'pcm')}
                    </button>
                    {parseInt(String(record.status)) === DesignationStatus.Active && (
                        <>
                            <span className="mx-2 text-gray-300">|</span>
                            <button onClick={() => handleStatus(record.id, 0)} className="text-red-600 hover:text-red-900">
                                {__('Inactive', 'pcm')}
                            </button>
                        </>
                    )}
                    {parseInt(String(record.status)) === DesignationStatus.Inactive && (
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

    const getDesignations = (id: number) => {
        return designations.find((designation: DesignationType) => designation.id === id);
    }

    const handleStatus = (id: number, status: number) => {
        const name = getDesignations(id)?.name;
        // @ts-ignore
        const _wpnonce = payCheckMate.pay_check_mate_nonce;
        const data = {id, name, status, _wpnonce};
        dispatch(designation).updateDesignation(data).then((response: any) => {
            useNotify(response, __('Designation status updated successfully', 'pcm'));
        }).catch((error: any) => {
            console.log(error)
            toast.error(__('Something went wrong while updating designation', 'pcm'), {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000
            });
        })
    }

    const handleModal = (data: DesignationType) => {
        if (data) {
            setFormData(data)
        }
        setShowModal(true)
        setFormError({})
    };

    const handleFilterChange = (filterObject: filtersType) => {
        dispatch(designation).getDesignations(filterObject)
        setCurrentPage(filterObject.page);
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
            dispatch(designation).updateDesignation(data).then((response: any) => {
                console.log(response)
                useNotify(response, __('Designation updated successfully', 'pcm'));
            }).catch((error: any) => {
                console.log(error)
                toast.error(__('Something went wrong while updating designation', 'pcm'), {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000
                });
            })

            setShowModal(false);
        } else {
            dispatch(designation).createDesignation(data).then((response: any) => {
                useNotify(response, __('Designation created successfully', 'pcm'));
            }).catch((error: any) => {
                console.log(error)
                toast.error(__('Something went wrong while creating designation', 'pcm'), {
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
                        <h1 className="text-base font-semibold leading-6 text-gray-900">
                            {__('Designation list', 'pcm')}
                        </h1>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <Button onClick={() => handleModal({} as DesignationType)} className="hover:text-white active:text-white">
                            <CheckCircleIcon className="w-5 h-5 mr-2 -ml-1 text-white" aria-hidden="true" />
                            {__('Add designation', 'pcm')}
                        </Button>
                        {showModal && (
                            <Modal setShowModal={setShowModal} header={__('Add designation', 'pcm')}>
                                {/*Create a form to save designation*/}
                                <div className="mt-5 md:mt-0 md:col-span-2">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <FormInput
                                            label={__('Designation name', 'pcm')}
                                            name="name"
                                            id="name"
                                            value={formData.name}
                                            error={formError.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            required={true}
                                        />
                                        <Button className="mt-4" onClick={() => handleSubmit(event)}>
                                            {__('Add designation', 'pcm')}
                                        </Button>
                                    </form>
                                </div>
                            </Modal>
                        )}
                    </div>
                </div>
                <Table
                    columns={columns}
                    total={total}
                    data={designations}
                    isLoading={loading}
                    totalPage={totalPages}
                    per_page={parseInt(per_page)}
                    currentPage={currentPage}
                    onFilterChange={handleFilterChange}
                />
            </div>
        </>
    )
}
