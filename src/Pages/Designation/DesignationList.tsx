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
import {UserCapNames} from "../../Types/UserType";
import {userCan} from "../../Helpers/User";
import {CreateDesignation} from "./CreateDesignation";
import {Status} from "../../Components/Status";

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
            title: 'Status', dataIndex: 'status',
            render: (text: string, record: DesignationType) => {
                const status = parseInt(String(record.status))
                return (
                    <Status status={record.status} />
                )
            }
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text: string, record: DesignationType) => (
                <div className="flex">
                    {userCan(UserCapNames.pay_check_mate_edit_designation) && (
                        <button
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={() => handleModal(record)}
                        >
                        {__('Edit', 'pcm')}
                    </button>
                    )}
                    {userCan(UserCapNames.pay_check_mate_change_designation_status) && (
                        <>
                            {parseInt(String(record.status)) === DesignationStatus.Active && (
                                <>
                                    <span className="mx-2 text-gray-300">|</span>
                                    <button
                                        onClick={() => handleStatus(record.id, 0)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        {__('Inactive', 'pcm')}
                                    </button>
                                </>
                            )}
                            {parseInt(String(record.status)) === DesignationStatus.Inactive && (
                                <>
                                    <span className="mx-2 text-gray-300">|</span>
                                    <button
                                        onClick={() => handleStatus(record.id, 1)}
                                        className="text-green-600 hover:text-green-900"
                                    >
                                        {__('Active', 'pcm')}
                                    </button>
                                </>
                            )}
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
            console.log(error, 'error')
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
                        <Button
                            onClick={() => handleModal({} as DesignationType)}
                            className="hover:text-white active:text-white"
                        >
                            <CheckCircleIcon
                                className="w-5 h-5 mr-2 -ml-1 text-white"
                                aria-hidden="true"
                            />
                            {__('Add designation', 'pcm')}
                        </Button>
                        {showModal && (
                            <CreateDesignation
                                showModal={showModal}
                                setShowModal={setShowModal}
                                formData={formData}
                                setFormData={setFormData}
                                formError={formError}
                                setFormError={setFormError}
                            />
                        )}
                    </div>
                </div>
                <Table
                    permissions={UserCapNames.pay_check_mate_view_designation_list}
                    columns={columns}
                    total={total}
                    data={designations}
                    isLoading={loading}
                    filters={filters}
                    totalPage={totalPages}
                    per_page={parseInt(per_page)}
                    currentPage={currentPage}
                    onFilterChange={handleFilterChange}
                    search={true}
                />
            </div>
        </>
    )
}
