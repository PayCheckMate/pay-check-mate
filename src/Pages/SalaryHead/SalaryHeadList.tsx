import {__} from "@wordpress/i18n";
import {Button} from "../../Components/Button";
import {CheckCircleIcon} from "@heroicons/react/24/outline";
import {Table} from "../../Components/Table";
import React, {useEffect, useState} from "@wordpress/element";
import useFetchApi from "../../Helpers/useFetchApi2";
import {Modal} from "../../Components/Modal";
import {FormInput} from "../../Components/FormInput";
import {SalaryHeadStatus, SalaryHeadType} from "../../Types/SalaryHeadType";

export const SalaryHeadList = () => {
    const [formData, setFormData] = useState<SalaryHeadType>({} as SalaryHeadType);
    const [showModal, setShowModal] = useState(false);
    const [salaryHeads, setSalaryHeads] = useState<SalaryHeadType[]>([])
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const {
        models,
        loading,
        totalPage,
        makePutRequest,
        makePostRequest,
        setFilterObject,
    } = useFetchApi<SalaryHeadType>('/pay-check-mate/v1/salary-heads');
    useEffect(() => {
        if (models) {
            setSalaryHeads(models as SalaryHeadType[]);
            setTotalPages(totalPage as number);
        }
    }, [models]);

    const columns = [
        {title: 'Salary Head', dataIndex: 'head_name'},
        {
            title: 'Status', dataIndex: 'status',
            render: (text: string, record: SalaryHeadType) => {
                const status = parseInt(String(record.status))
                return (
                    <span className={`${status === SalaryHeadStatus.Active ? 'text-green-600' : 'text-red-600'}`}>
                        {status === SalaryHeadStatus.Active ? __('Active', 'pcm') : __('Inactive', 'pcm')}
                    </span>
                )
            }
        },
        {
            title: 'Created on', dataIndex: 'created_on',
            render: (text: string, record: SalaryHeadType) => {
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
            render: (text: string, record: SalaryHeadType) => (
                <div className="flex">
                    <button className="text-indigo-600 hover:text-indigo-900" onClick={()=>handleModal(record)}>
                        {__('Edit', 'pcm')}
                    </button>
                    {parseInt(String(record.status)) === SalaryHeadStatus.Active && (
                        <>
                            <span className="mx-2 text-gray-300">|</span>
                            <button onClick={() => handleStatus(record.id, 0)} className="text-red-600 hover:text-red-900">
                                {__('Inactive', 'pcm')}
                            </button>
                        </>
                    )}
                    {parseInt(String(record.status)) === SalaryHeadStatus.Inactive && (
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

    const getSalaryHead = (id: number) => {
        return salaryHeads.find((salaryHead: SalaryHeadType) => salaryHead.id === id);
    }

    const handleStatus = (id: number, status: number) => {
        const head_name = getSalaryHead(id)?.head_name;
        // @ts-ignore
        const _wpnonce = payCheckMate.pay_check_mate_nonce;
        const data = {id, head_name, status, _wpnonce};
        try {
            makePutRequest(`/pay-check-mate/v1/salary-heads/${id}`, data, false).then((data: unknown) => {
                if (data) {
                    setSalaryHeads(models.map((salaryHead: SalaryHeadType) => {
                        if (salaryHead.id === id) {
                            salaryHead.status = status;
                        }
                        return salaryHead;
                    }))
                }
            }).catch((e: unknown) => {
                console.log(e);
            })
        } catch (error) {
            console.log(error); // Handle the error accordingly
        }
    }

    const handleModal = (data: SalaryHeadType) => {
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
                makePutRequest(`/pay-check-mate/v1/salary-heads/${formData.id}`, data, false).then((data: SalaryHeadType) => {
                    setSalaryHeads(models.map((salaryHead: SalaryHeadType) => {
                        if (salaryHead.id === formData.id) {
                            salaryHead.head_name = formData.head_name;
                        }
                        return salaryHead;
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
                makePostRequest('/pay-check-mate/v1/salary-heads', data, false).then((data: SalaryHeadType) => {
                    setSalaryHeads([...models, formData])
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
                            {__('Salary Head list', 'pcm')}
                        </h1>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <Button onClick={()=>handleModal({} as SalaryHeadType)} className="hover:text-white active:text-white">
                            <CheckCircleIcon className="w-5 h-5 mr-2 -ml-1 text-white" aria-hidden="true" />
                            {__('Add salary head', 'pcm')}
                        </Button>
                        {showModal && (
                            <Modal setShowModal={setShowModal} header={__('Add salary head', 'pcm')}>
                                {/*Create a form to save salary head*/}
                                <div className="mt-5 md:mt-0 md:col-span-2">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <FormInput label={__('Salary Head name', 'pcm')} name="head_name" id="head_name" value={formData.head_name} onChange={(e) => setFormData({...formData, head_name: e.target.value})} />
                                        <Button className="mt-4" onClick={()=>handleSubmit(event)}>
                                            {__('Add salary head', 'pcm')}
                                        </Button>
                                    </form>
                                </div>
                            </Modal>
                        )}
                    </div>
                </div>
                <Table
                    columns={columns}
                    data={salaryHeads}
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