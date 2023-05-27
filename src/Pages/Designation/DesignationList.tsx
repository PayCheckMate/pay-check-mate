import {__} from "@wordpress/i18n";
import {Button} from "../../Components/Button";
import {CheckCircleIcon} from "@heroicons/react/24/outline";
import {Table} from "../../Components/Table";
import React, {useEffect, useState} from "@wordpress/element";
import {DesignationStatus, DesignationType} from "../../Types/DesignationType";
import useFetchApi from "../../Helpers/useFetchApi2";
import {Modal} from "../../Components/Modal";
import {FormInput} from "../../Components/FormInput";

export const DesignationList = () => {
    const [formData, setFormData] = useState<DesignationType>({} as DesignationType);
    const [showModal, setShowModal] = useState(false);
    const [designations, setDesignations] = useState<DesignationType[]>([])
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const {
        models,
        loading,
        totalPage,
        makeDeleteRequest,
        makePutRequest,
        makePostRequest,
        setFilterObject,
    } = useFetchApi<DesignationType>('/pay-check-mate/v1/designations');
    useEffect(() => {
        if (models) {
            setDesignations(models as DesignationType[]);
            setTotalPages(totalPage as number);
        }
    }, [models]);

    const columns = [
        {title: 'Designation name', dataIndex: 'designation_name'},
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
                    <button className="text-indigo-600 hover:text-indigo-900" onClick={()=>handleModal(record)}>
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

    const deleteDepartment = (id: number) => {
        try {
            makeDeleteRequest(`/pay-check-mate/v1/designations/${id}`, false).then((data: unknown) => {
                setDesignations(models.filter((designation: DesignationType) => designation.id !== id))
            }).catch((e: unknown) => {
                console.log(e);
            })
        } catch (error) {
            console.log(error); // Handle the error accordingly
        }
    }

    const getDesignations = (id: number) => {
        return designations.find((designation: DesignationType) => designation.id === id);
    }

    const handleStatus = (id: number, status: number) => {
        const designation_name = getDesignations(id)?.designation_name;
        // @ts-ignore
        const _wpnonce = payCheckMate.pay_check_mate_nonce;
        const data = {id, designation_name, status, _wpnonce};
        try {
            makePutRequest(`/pay-check-mate/v1/designations/${id}`, data, false).then((data: unknown) => {
                if (data) {
                    setDesignations(models.map((designation: DesignationType) => {
                        if (designation.id === id) {
                            designation.status = status;
                        }
                        return designation;
                    }))
                }
            }).catch((e: unknown) => {
                console.log(e);
            })
        } catch (error) {
            console.log(error); // Handle the error accordingly
        }
    }

    const handleModal = (data: DesignationType) => {
        if (data) {
            setFormData(data)
        }
        setShowModal(true)
    };

    const handlePageChange = (page: number) => {
        setFilterObject({ 'per_page': 10, 'page': page }); // Update the filter object with the new page value
        setCurrentPage(page);
    };


    const handleSubmit = (event: any) => {
        event.preventDefault();
        const data = formData
        // @ts-ignore
        data._wpnonce = payCheckMate.pay_check_mate_nonce;
        if (formData.id) {
            try {
                makePutRequest(`/pay-check-mate/v1/designations/${formData.id}`, data, false).then((data: DesignationType) => {
                    setDesignations(models.map((designation: DesignationType) => {
                        if (designation.id === formData.id) {
                            designation.designation_name = formData.designation_name;
                        }
                        return designation;
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
                makePostRequest('/pay-check-mate/v1/designations', data, false).then((data: DesignationType) => {
                    setDesignations([...models, formData])
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
                        <h1 className="text-base font-semibold leading-6 text-gray-900">
                            {__('Designation list', 'pcm')}
                        </h1>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <Button onClick={()=>handleModal({} as DesignationType)} className="hover:text-white active:text-white">
                            <CheckCircleIcon className="w-5 h-5 mr-2 -ml-1 text-white" aria-hidden="true" />
                            {__('Add designation', 'pcm')}
                        </Button>
                        {showModal && (
                            <Modal setShowModal={setShowModal} header={__('Add designation', 'pcm')}>
                                {/*Create a form to save designation*/}
                                <div className="mt-5 md:mt-0 md:col-span-2">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <FormInput label={__('Department name', 'pcm')} name="designation_name" id="designation_name" value={formData.designation_name} onChange={(e) => setFormData({...formData, designation_name: e.target.value})} />
                                        <Button className="mt-4" onClick={()=>handleSubmit(event)}>
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
                    data={designations}
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