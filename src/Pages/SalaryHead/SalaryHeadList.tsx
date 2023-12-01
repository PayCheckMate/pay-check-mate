import {__} from "@wordpress/i18n";
import {Button} from "../../Components/Button";
import {CheckCircleIcon, PlusIcon} from "@heroicons/react/24/outline";
import {Table} from "../../Components/Table";
import {useState} from "@wordpress/element";
import {Modal} from "../../Components/Modal";
import {FormInput} from "../../Components/FormInput";
import {HeadType, SalaryHeadStatus, SalaryHeadType, SelectBoxType} from "../../Types/SalaryHeadType";
import {SelectBox} from "../../Components/SelectBox";
import {FormCheckBox} from "../../Components/FormCheckBox";
import {useDispatch, useSelect} from "@wordpress/data";
import salaryHead from "../../Store/SalaryHead";
import {toast} from "react-toastify";
import useNotify from "../../Helpers/useNotify";
import {validateRequiredFields} from "../../Helpers/Helpers";
import {filtersType} from "../../Store/Store";
import {UserCapNames} from "../../Types/UserType";
import {userCan} from "../../Helpers/User";
import {Status} from "../../Components/Status";
import {applyFilters} from "../../Helpers/Hooks";
import {HOC} from "../../Components/HOC";

const headType = [
    {id: HeadType.Earning, name: __('Earning', 'pay_check_mate')},
    {id: HeadType.Deduction, name: __('Deduction', 'pay_check_mate')},
]

const is_percentage = [
    {id: 0, name: __('No', 'pay_check_mate')},
    {id: 1, name: __('Yes', 'pay_check_mate')},
]

const is_variable = [
    {id: 0, name: __('No', 'pay_check_mate')},
    {id: 1, name: __('Yes', 'pay_check_mate')},
]

export const SalaryHeadList = () => {
    const dispatch = useDispatch();
    const per_page = '10';
    const {salaryHeads, loading, totalPages, filters, total} = useSelect((select) => select(salaryHead).getSalaryHeads({per_page: per_page, page: 1}), []);

    const [formData, setFormData] = useState<SalaryHeadType>({} as SalaryHeadType);
    const [formError, setFormError] = useState({} as { [key: string]: string});
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(filters.page);
    const [selectedHeadType, setSelectedHeadType] = useState<SelectBoxType>(headType[0] as SelectBoxType);
    const [isPercentage, setIsPercentage] = useState(is_percentage[0]);
    const [isVariable, setIsVariable] = useState(is_variable[0]);

    let indigo = applyFilters('pay_check_mate.indigo', 'gray');
    let green = applyFilters('pay_check_mate.green', 'gray');
    let red = applyFilters('pay_check_mate.red', 'gray');
    const columns = [
        {title: __('Salary Head', 'pay_check_mate'), dataIndex: 'head_name', sortable: true},
        {
            title: __('Head Type', 'pay_check_mate'), dataIndex: 'head_type', sortable: true,
            render: (text: string, record: SalaryHeadType) => {
                const headType = parseInt(String(record.head_type))
                return (
                    <span className={`${headType === HeadType.Earning ? `text-${green}-600` : `text-${red}-600`}`}>
                        {headType === HeadType.Earning ? __('Earning', 'pay_check_mate') : __('Deduction', 'pay_check_mate')}
                    </span>
                )
            }
        },
        {
            title: __('Head Amount', 'pay_check_mate'), dataIndex: 'head_amount',
            render: (text: string, record: SalaryHeadType) => {
                return (
                    <span>
                        {record.head_amount}
                        {parseInt(String(record.is_percentage)) === 1 ? ' %' : ''}
                        {parseInt(String(record.is_variable)) === 1 ? __(' and variable', 'pay_check_mate') : ''}
                    </span>
                )
            }

        },
        {
            title: __('Is Taxable', 'pay_check_mate'), dataIndex: 'is_taxable',
            render: (text: string, record: SalaryHeadType) => {
                const isTaxable = parseInt(String(record.is_taxable))
                return (
                    <span className={`${isTaxable === 1 ? `text-${green}-600` : `text-${red}-600`}`}>
                        {isTaxable === 1 ? __('Yes', 'pay_check_mate') : __('No', 'pay_check_mate')}
                    </span>
                )
            }
        },
        {
            title: __('Is Personal Savings', 'pay_check_mate'), dataIndex: 'is_personal_savings',
            render: (text: string, record: SalaryHeadType) => {
                const isPersonalSavings = parseInt(String(record.is_personal_savings))
                return (
                    <span className={`${isPersonalSavings === 1 ? `text-${green}-600` : `text-${red}-600`}`}>
                        {isPersonalSavings === 1 ? __('Yes', 'pay_check_mate') : __('No', 'pay_check_mate')}
                    </span>
                )
            }
        },
        {title: __('Priority', 'pay_check_mate'), dataIndex: 'priority', sortable: true},
        {
            title: __('Variable', 'pay_check_mate'), dataIndex: 'is_variable',
            render: (text: string, record: SalaryHeadType) => {
                return (
                    <span className={`${parseInt(String(record.is_variable)) === 1 ? `text-${green}-600` : `text-${red}-600`}`}>
                        {parseInt(String(record.is_variable)) === 1 ? __('Yes', 'pay_check_mate') : __('No', 'pay_check_mate')}
                    </span>
                )
            }
        },
        {
            title: __('Status', 'pay_check_mate'), dataIndex: 'status',
            render: (text: string, record: SalaryHeadType) => {
                const status = parseInt(String(record.status))
                return (
                    <Status status={record.status} />
                )
            }
        },
        {
            title: __('Action', 'pay_check_mate'),
            dataIndex: 'action',
            render: (text: string, record: SalaryHeadType) => (
                <div className="flex">
                    {userCan(UserCapNames.pay_check_mate_edit_salary_head) && (
                    <button
                        className={"text-"+indigo+"-600 hover:text-"+indigo+"-900 font-semibold"}
                        onClick={() => handleModal(record)}
                    >
                        {__('Edit', 'pay_check_mate')}
                    </button>
                    )}
                    {userCan(UserCapNames.pay_check_mate_change_salary_head_status) && (
                        <>
                            {parseInt(String(record.status)) === SalaryHeadStatus.Active && (
                                <>
                                    <span className="mx-2 text-gray-300">|</span>
                                    <button
                                        onClick={() => handleStatus(record.id, 0)}
                                        className={"text-"+red+"-600 hover:text-"+red+"-900 font-semibold"}
                                    >
                                        {__('Inactive', 'pay_check_mate')}
                                    </button>
                                </>
                            )}
                            {parseInt(String(record.status)) === SalaryHeadStatus.Inactive && (
                                <>
                                    <span className="mx-2 text-gray-300">|</span>
                                    <button
                                        onClick={() => handleStatus(record.id, 1)}
                                        className={"text-"+green+"-600 hover:text-"+green+"-900 font-semibold"}
                                    >
                                        {__('Active', 'pay_check_mate')}
                                    </button>
                                </>
                            )}
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
        const head = getSalaryHead(id);
        const head_name = head?.head_name;
        const head_type = head?.head_type;
        const head_amount = head?.head_amount;
        const is_percentage = head?.is_percentage;
        const is_variable = head?.is_variable;
        const is_taxable = head?.is_taxable;
        const priority = head?.priority;
        const is_personal_savings = head?.is_personal_savings;
        // @ts-ignore
        const _wpnonce = payCheckMate.pay_check_mate_nonce;
        const data = {id, head_name, status, head_type, is_percentage, is_variable, head_amount, is_taxable, priority, is_personal_savings, _wpnonce};
        dispatch(salaryHead).updateSalaryHead(data).then((response: any) => {
            useNotify(response, __('Salary head status updated successfully', 'pay_check_mate'));
        }).catch((error: any) => {
            console.log(error, 'error')
            toast.error(__('Something went wrong while creating salary head', 'pay_check_mate'), {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000
            });
        })
    }

    const handleModal = (data: SalaryHeadType) => {
        setFormError({});
        if (!data.head_type) {
            data = {
                ...data,
                head_type: HeadType.Earning,
                is_percentage: 1,
                is_taxable: 1,
                priority: 1,
                status: 1
            }
        }
        setSelectedHeadType({id: data.head_type, name: parseInt(String(data.head_type)) === HeadType.Earning ? __('Earning', 'pay_check_mate') : __('Deduction', 'pay_check_mate')})
        setIsPercentage({id: data.is_percentage, name: parseInt(String(data.is_percentage)) === 1 ? __('Yes', 'pay_check_mate') : __('No', 'pay_check_mate')})
        setFormData(data)
        setShowModal(true)
    };

    const handleFilterChange = (filterObject: filtersType) => {
        dispatch(salaryHead).getSalaryHeads(filterObject)
        setCurrentPage(filterObject.page);
    };

    const handleHeadType = (data: SelectBoxType) => {
        setSelectedHeadType(data);
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        const data = formData
        // @ts-ignore
        data._wpnonce = payCheckMate.pay_check_mate_nonce;
        // Handle required fields
        const requiredFields = ['head_name', 'head_amount', 'head_type'];
        const errors = validateRequiredFields(data, requiredFields, setFormError);
        if (Object.keys(errors).length > 0) {
            toast.error(__('Please fill all required fields', 'pay_check_mate'), {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000
            });

            return;
        }

        if (formData.id) {
            dispatch(salaryHead).updateSalaryHead(data).then((response: any) => {
                useNotify(response, __('Successfully updated salary head', 'pay_check_mate'));
            }).catch((error: any) => {
                console.log(error, 'error')
                toast.error(__('Something went wrong while updating salary head', 'pay_check_mate'), {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000
                });
            })

            setShowModal(false);
        } else {
            data.head_type = selectedHeadType.id as HeadType;
            data.is_percentage = isPercentage.id ? 1 : 0;
            data.is_variable = isVariable.id ? 1 : 0;
            data.is_taxable = formData.is_taxable ?? 1;
            data.priority = formData.priority ?? 1;
            data.is_personal_savings = formData.is_personal_savings ?? 0;
            // @ts-ignore
            dispatch(salaryHead).createSalaryHead(data).then((response: any) => {
                useNotify(response, __('Successfully created salary head', 'pay_check_mate'));
            }).catch((error: any) => {
                console.log(error, 'error')
                toast.error(__('Something went wrong while creating salary head', 'pay_check_mate'), {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000
                });
            });

            setShowModal(false);
        }
    }

    const handleInputChange = (event: any) => {
        const {name, value} = event.target;
        setFormData({...formData, [name]: value});
    }
    return (
        <HOC role={UserCapNames.pay_check_mate_view_salary_head_list}>
            <div>
                <div className="sm:flex sm:items-center mb-6">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">
                            {__('Salary Head list', 'pay_check_mate')}
                        </h1>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <Button
                            onClick={() => handleModal({} as SalaryHeadType)}
                            className="hover:text-white active:text-white"
                        >
                            <PlusIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                            {__('Add salary head', 'pay_check_mate')}
                        </Button>
                        {showModal && (
                            <Modal
                                setShowModal={setShowModal}
                                header={__('Add salary head', 'pay_check_mate')}
                                description={__('No need to add Basic as salary head. It will be added automatically.', 'pay_check_mate')}
                            >
                                <div className="mt-5 md:mt-0 md:col-span-2">
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                    >
                                        <FormInput
                                            label={__('Salary Head name', 'pay_check_mate')}
                                            name="head_name"
                                            id="head_name"
                                            required={true}
                                            value={formData.head_name}
                                            onChange={(e) =>
                                                handleInputChange(e)
                                            }
                                            error={formError.head_name}
                                        />
                                        <FormInput
                                            label={__('Head amount', 'pay_check_mate')}
                                            type="text"
                                            required={true}
                                            name="head_amount"
                                            id="head_amount"
                                            value={formData.head_amount}
                                            onChange={(e) =>
                                                handleInputChange(e)
                                            }
                                            error={formError.head_amount}
                                        />
                                        <div className="flex items-center justify-between">
                                            <FormCheckBox
                                                label={__('Is percentage?', 'pay_check_mate')}
                                                name="is_percentage"
                                                id="is_percentage"
                                                value={formData.is_percentage}
                                                checked={parseInt(String(formData.is_percentage)) === 1}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFormData({...formData, is_percentage: 1});
                                                        setIsPercentage({id: 1, name: 'Yes'})
                                                    } else {
                                                        setFormData({...formData, is_percentage: 0});
                                                        setIsPercentage({id: 0, name: 'No'})
                                                    }
                                                }}
                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                tooltip={__('If you want to add this head as percentage, please check this box.', 'pay_check_mate')}
                                            />
                                            <FormCheckBox
                                                label={__('Is changeable in every payroll?', 'pay_check_mate')}
                                                name="is_variable"
                                                id="is_variable"
                                                value={formData.is_variable}
                                                checked={parseInt(String(formData.is_variable)) === 1}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFormData({
                                                            ...formData,
                                                            is_variable: 1,
                                                            head_amount: 0
                                                        });
                                                        setIsVariable({id: 1, name: 'Yes'})
                                                    } else {
                                                        setFormData({...formData, is_variable: 0});
                                                        setIsVariable({id: 0, name: 'No'})
                                                    }
                                                }}
                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                tooltip={__('If you want to change this head amount in every payroll, please check this box. Eg: Bonus, Overtime, TA/DA, etc.', 'pay_check_mate')}
                                            />
                                        </div>
                                        <SelectBox
                                            title={__('Head type', 'pay_check_mate')}
                                            options={headType}
                                            selected={selectedHeadType}
                                            setSelected={(value: any) => {
                                                setSelectedHeadType(value);
                                                setFormData({...formData, head_type: value.id})
                                            }}
                                            required={true}
                                            error={formError.head_type}
                                        />
                                        <div className="flex items-center justify-between">
                                            <FormCheckBox
                                                label={__('Is Taxable', 'pay_check_mate')}
                                                name="is_taxable"
                                                id="is_taxable"
                                                value={formData.is_taxable}
                                                checked={parseInt(String(formData.is_taxable)) === 1}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFormData({...formData, is_taxable: 1});
                                                    } else {
                                                        setFormData({...formData, is_taxable: 0});
                                                    }
                                                }}
                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                tooltip={__("If this head is taxable, then check this. Eg: Basic, HRA, etc. Non-taxable: Mobile allowance, reimbursement, etc.", 'pay_check_mate')}
                                            />
                                            <FormCheckBox
                                                label={__('Is personal savings?', 'pay_check_mate')}
                                                name="is_personal_savings"
                                                id="is_personal_savings"
                                                value={formData.is_personal_savings}
                                                checked={parseInt(String(formData.is_personal_savings)) === 1}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFormData({...formData, is_personal_savings: 1});
                                                    } else {
                                                        setFormData({...formData, is_personal_savings: 0});
                                                    }
                                                }}
                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                tooltip={__("If this is a personal savings, then check this. Eg: PF, Gratuity, etc.", 'pay_check_mate')}
                                            />
                                        </div>
                                        <FormInput
                                            label={__('Priority', 'pay_check_mate')}
                                            type="number"
                                            name="priority"
                                            id="priority"
                                            value={formData.priority}
                                            onChange={(e) => handleInputChange(e)}
                                        />
                                        <div className="text-right">
                                            <Button
                                                className="mt-4"
                                                onClick={() => handleSubmit(event)}
                                            >
                                                {formData.id ? __('Update', 'pay_check_mate') : __('Add', 'pay_check_mate')}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </Modal>
                        )}
                    </div>
                </div>
                <Table
                    permissions={UserCapNames.pay_check_mate_view_salary_head_list}
                    columns={columns}
                    data={salaryHeads}
                    isLoading={loading}
                    totalPage={totalPages}
                    per_page={parseInt(per_page)}
                    total={total}
                    currentPage={currentPage}
                    filters={filters}
                    onFilterChange={(filter) => handleFilterChange(filter)}
                    search={true}
                />
            </div>
        </HOC>
    )
}
