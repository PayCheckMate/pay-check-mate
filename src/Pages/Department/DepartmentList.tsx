import {__} from "@wordpress/i18n";
import {Button} from "../../Components/Button";
import {PlusIcon} from "@heroicons/react/24/outline";
import {Table} from "../../Components/Table";
import React, {useState} from "@wordpress/element";
import {DepartmentStatus, DepartmentType} from "../../Types/DepartmentType";
import {useDispatch, useSelect} from "@wordpress/data";
import department from "../../Store/Department";
import {toast} from "react-toastify";
import useNotify from "../../Helpers/useNotify";
import {filtersType} from "../../Store/Store";
import {UserCapNames} from "../../Types/UserType";
import {userCan} from "../../Helpers/User";
import {CreateDepartment} from "./CreateDepartment";
import {Status} from "../../Components/Status";
import {applyFilters} from "../../Helpers/Hooks";
import {HOC} from "../../Components/HOC";

export const DepartmentList = () => {
    const dispatch = useDispatch();
    const per_page = '10';
    const {departments, loading, totalPages, filters, total} = useSelect((select) => select(department).getDepartments({per_page: per_page, page: 1}), []);
    const [formData, setFormData] = useState<DepartmentType>({} as DepartmentType);
    const [formError, setFormError] = useState({} as { [key: string]: string });
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(filters.page);

    let indigo = applyFilters('pay_check_mate.indigo', 'gray');
    let green = applyFilters('pay_check_mate.green', 'gray');
    let red = applyFilters('pay_check_mate.red', 'gray');

    const columns = [
        {title: 'Department name', dataIndex: 'name', sortable: true},
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
            title: 'Status', dataIndex: 'status',
            render: (text: string, record: DepartmentType) => {
                const status = parseInt(String(record.status))
                return (
                    <Status status={record.status} />
                )
            }
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text: string, record: DepartmentType) => (
                <div className="flex">
                    {userCan(UserCapNames.pay_check_mate_edit_department) && (
                        <button
                            className={"text-"+indigo+"-600 hover:text-"+indigo+"-900 font-semibold"}
                            onClick={() => handleModal(record)}
                        >
                            {__('Edit', 'pay-check-mate')}
                        </button>
                    )}
                    {userCan(UserCapNames.pay_check_mate_change_department_status) && (
                        <>
                            {parseInt(String(record.status)) === DepartmentStatus.Active && (
                                <>
                                    <span className="mx-2 text-gray-300">|</span>
                                    <button
                                        onClick={() => handleStatus(record.id, 0)}
                                        className={"text-"+red+"-600 hover:text-"+red+"-900 font-semibold"}
                                    >
                                        {__('Inactive', 'pay-check-mate')}
                                    </button>
                                </>
                            )}
                            {parseInt(String(record.status)) === DepartmentStatus.Inactive && (
                                <>
                                    <span className="mx-2 text-gray-300">|</span>
                                    <button
                                        onClick={() => handleStatus(record.id, 1)}
                                        className={"text-"+green+"-600 hover:text-"+green+"-900 font-semibold"}
                                    >
                                        {__('Active', 'pay-check-mate')}
                                    </button>
                                </>
                            )}
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
            useNotify(response, __('Department status updated successfully', 'pay-check-mate'));
        }).catch((error: any) => {
            console.log(error, 'error')
            toast.error(__('Something went wrong while updating department', 'pay-check-mate'), {
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

    const handleFilterChange = (filterObject: filtersType) => {
        dispatch(department).getDepartments(filterObject);
        setCurrentPage(filterObject.page);
    };


    return (
        <HOC role={UserCapNames.pay_check_mate_view_department_list}>
            <div>
                <div className="sm:flex sm:items-center mb-6">
                    <div className="sm:flex-auto">
                        <h1 className="heading text-base font-semibold leading-6 text-gray-900">
                            {__('Department list', 'pay-check-mate')}
                        </h1>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        {userCan(UserCapNames.pay_check_mate_add_department) && (
                            <Button
                                onClick={() => handleModal({} as DepartmentType)}
                                className="hover:text-white active:text-white"
                            >
                                <PlusIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                                {__('Add department', 'pay-check-mate')}
                            </Button>
                        )}
                        {(userCan(UserCapNames.pay_check_mate_add_department) && showModal) && (
                            <CreateDepartment
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
                    permissions={UserCapNames.pay_check_mate_view_department_list}
                    columns={columns}
                    total={total}
                    data={departments}
                    filters={filters}
                    isLoading={loading}
                    totalPage={totalPages}
                    per_page={parseInt(per_page)}
                    currentPage={currentPage}
                    onFilterChange={handleFilterChange}
                    search={true}
                />
            </div>
        </HOC>
    )
}
