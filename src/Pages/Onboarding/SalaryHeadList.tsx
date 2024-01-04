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
import {Card} from "../../Components/Card";

const headType = [
    {id: HeadType.Earning, name: __('Earning', 'pay-check-mate')},
    {id: HeadType.Deduction, name: __('Deduction', 'pay-check-mate')},
]

const is_percentage = [
    {id: 0, name: __('No', 'pay-check-mate')},
    {id: 1, name: __('Yes', 'pay-check-mate')},
]

const is_variable = [
    {id: 0, name: __('No', 'pay-check-mate')},
    {id: 1, name: __('Yes', 'pay-check-mate')},
]

export const SalaryHeadList = () => {
    const dispatch = useDispatch();
    const per_page = '100';
    const {salaryHeads, loading, totalPages, filters, total} = useSelect((select) => select(salaryHead).getSalaryHeads({per_page: per_page, page: 1}), []);

    const [formData, setFormData] = useState<SalaryHeadType>({} as SalaryHeadType);
    const [formError, setFormError] = useState({} as { [key: string]: string});
    const [currentPage, setCurrentPage] = useState(filters.page);
    const [selectedHeadType, setSelectedHeadType] = useState<SelectBoxType>(headType[0] as SelectBoxType);
    const [isPercentage, setIsPercentage] = useState(is_percentage[0]);
    const [isVariable, setIsVariable] = useState(is_variable[0]);

    let green = applyFilters('pay_check_mate.green', 'gray');
    let red = applyFilters('pay_check_mate.red', 'gray');
    const columns = [
        {title: __('Salary Head', 'pay-check-mate'), dataIndex: 'head_name'},
        {
            title: __('Head Type', 'pay-check-mate'), dataIndex: 'head_type',
            render: (text: string, record: SalaryHeadType) => {
                const headType = parseInt(String(record.head_type))
                return (
                    <span className={`${headType === HeadType.Earning ? `text-${green}-600` : `text-${red}-600`}`}>
                        {headType === HeadType.Earning ? __('Earning', 'pay-check-mate') : __('Deduction', 'pay-check-mate')}
                    </span>
                )
            }
        },
        {
            title: __('Head Amount', 'pay-check-mate'), dataIndex: 'head_amount',
            render: (text: string, record: SalaryHeadType) => {
                return (
                    <span>
                        {record.head_amount}
                        {parseInt(String(record.is_percentage)) === 1 ? ' %' : ''}
                        {parseInt(String(record.is_variable)) === 1 ? __(' and variable', 'pay-check-mate') : ''}
                    </span>
                )
            }

        },
        {
            title: __('Is Taxable', 'pay-check-mate'), dataIndex: 'is_taxable',
            render: (text: string, record: SalaryHeadType) => {
                const isTaxable = parseInt(String(record.is_taxable))
                return (
                    <span className={`${isTaxable === 1 ? `text-${green}-600` : `text-${red}-600`}`}>
                        {isTaxable === 1 ? __('Yes', 'pay-check-mate') : __('No', 'pay-check-mate')}
                    </span>
                )
            }
        },
        {
            title: __('Is Personal Savings', 'pay-check-mate'), dataIndex: 'is_personal_savings',
            render: (text: string, record: SalaryHeadType) => {
                const isPersonalSavings = parseInt(String(record.is_personal_savings))
                return (
                    <span className={`${isPersonalSavings === 1 ? `text-${green}-600` : `text-${red}-600`}`}>
                        {isPersonalSavings === 1 ? __('Yes', 'pay-check-mate') : __('No', 'pay-check-mate')}
                    </span>
                )
            }
        },
        {title: __('Priority', 'pay-check-mate'), dataIndex: 'priority'},
        {
            title: __('Variable', 'pay-check-mate'), dataIndex: 'is_variable',
            render: (text: string, record: SalaryHeadType) => {
                return (
                    <span className={`${parseInt(String(record.is_variable)) === 1 ? `text-${green}-600` : `text-${red}-600`}`}>
                        {parseInt(String(record.is_variable)) === 1 ? __('Yes', 'pay-check-mate') : __('No', 'pay-check-mate')}
                    </span>
                )
            }
        },
    ]

    const handleFilterChange = (filterObject: filtersType) => {
        dispatch(salaryHead).getSalaryHeads(filterObject)
        setCurrentPage(filterObject.page);
    };


    const handleSubmit = (event: any) => {
        event.preventDefault();
        const data = formData
        // @ts-ignore
        data._wpnonce = payCheckMate.pay_check_mate_nonce;
        // Handle required fields
        const requiredFields = ['head_name', 'head_amount', 'head_type'];
        const errors = validateRequiredFields(data, requiredFields, setFormError);
        if (Object.keys(errors).length > 0) {
            toast.error(__('Please fill all required fields', 'pay-check-mate'), {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000
            });

            return;
        }

        data.head_type = selectedHeadType.id as HeadType;
        data.is_percentage = isPercentage.id ? 1 : 0;
        data.is_variable = isVariable.id ? 1 : 0;
        data.is_taxable = formData.is_taxable ?? 1;
        data.priority = formData.priority ?? 1;
        data.is_personal_savings = formData.is_personal_savings ?? 0;
        // @ts-ignore
        dispatch(salaryHead).createSalaryHead(data).then((response: any) => {
            useNotify(response, __('Successfully created salary head', 'pay-check-mate'));
            setFormData({} as SalaryHeadType)
        }).catch((error: any) => {
            console.log(error, 'error')
            toast.error(__('Something went wrong while creating salary head', 'pay-check-mate'), {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000
            });
        });
    }

    const handleInputChange = (event: any) => {
        const {name, value} = event.target;
        setFormData({...formData, [name]: value});
    }
    return (
        <HOC role={UserCapNames.pay_check_mate_add_department}>
            <div className="sm:flex-auto mb-6">
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                    {__('Create Salary Head', 'pay-check-mate')}
                </h1>
            </div>
            <div className="grid grid-cols-2 gap-8">
                <div className="text-base">
                    <Card>
                        <div className="mt-5 md:mt-0 md:col-span-2">
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >
                                <FormInput
                                    label={__('Salary Head name', 'pay-check-mate')}
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
                                    label={__('Head amount', 'pay-check-mate')}
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
                                        label={__('Is percentage?', 'pay-check-mate')}
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
                                        tooltip={__('If you want to add this head as percentage, please check this box.', 'pay-check-mate')}
                                    />
                                    <FormCheckBox
                                        label={__('Is changeable in every payroll?', 'pay-check-mate')}
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
                                        tooltip={__('If you want to change this head amount in every payroll, please check this box. Eg: Bonus, Overtime, TA/DA, etc.', 'pay-check-mate')}
                                    />
                                </div>
                                <SelectBox
                                    title={__('Head type', 'pay-check-mate')}
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
                                        label={__('Is Taxable', 'pay-check-mate')}
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
                                        tooltip={__("If this head is taxable, then check this. Eg: Basic, HRA, etc. Non-taxable: Mobile allowance, reimbursement, etc.", 'pay-check-mate')}
                                    />
                                    <FormCheckBox
                                        label={__('Is personal savings?', 'pay-check-mate')}
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
                                        tooltip={__("If this is a personal savings, then check this. Eg: PF, Gratuity, etc.", 'pay-check-mate')}
                                    />
                                </div>
                                <FormInput
                                    label={__('Priority', 'pay-check-mate')}
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
                                        {formData.id ? __('Update', 'pay-check-mate') : __('Add', 'pay-check-mate')}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </Card>
                    </div>
                <Card>
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
                        pagination={false}
                    />
                </Card>
                </div>
        </HOC>
    )
}
