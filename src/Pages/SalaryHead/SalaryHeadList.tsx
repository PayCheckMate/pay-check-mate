import {__} from "@wordpress/i18n";
import {Button} from "../../Components/Button";
import {CheckCircleIcon} from "@heroicons/react/24/outline";
import {Table} from "../../Components/Table";
import React, {useEffect, useState} from "@wordpress/element";
import useFetchApi from "../../Helpers/useFetchApi";
import {Modal} from "../../Components/Modal";
import {FormInput} from "../../Components/FormInput";
import {HeadType, SalaryHeadStatus, SalaryHeadType, SelectBoxType} from "../../Types/SalaryHeadType";
import {SelectBox} from "../../Components/SelectBox";
import {FormCheckBox} from "../../Components/FormCheckBox";

const headType = [
    {id: HeadType.Earning, name: __('Earning', 'pcm')},
    {id: HeadType.Deduction, name: __('Deduction', 'pcm')},
]

const is_percentage = [
    {id: 0, name: __('No', 'pcm')},
    {id: 1, name: __('Yes', 'pcm')},
]

const is_variable = [
    {id: 0, name: __('No', 'pcm')},
    {id: 1, name: __('Yes', 'pcm')},
]

export const SalaryHeadList = () => {
    const [formData, setFormData] = useState<SalaryHeadType>({} as SalaryHeadType);
    const [showModal, setShowModal] = useState(false);
    const [salaryHeads, setSalaryHeads] = useState<SalaryHeadType[]>([])
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedHeadType, setSelectedHeadType] = useState<SelectBoxType>(headType[0] as SelectBoxType);
    const [isPercentage, setIsPercentage] = useState(is_percentage[0]);
    const [isVariable, setIsVariable] = useState(is_variable[0]);
    const {
              models,
              loading,
              totalPage,
              makePutRequest,
              makePostRequest,
              setFilterObject,
          } = useFetchApi<SalaryHeadType>('/pay-check-mate/v1/salary-heads', {'per_page': 20, 'orderby': 'id', 'order': 'asc'});
    useEffect(() => {
        if (models) {
            setSalaryHeads(models as SalaryHeadType[]);
            setTotalPages(totalPage as number);
        }
    }, [models]);

    const columns = [
        {title: __('Salary Head', 'pcm'), dataIndex: 'head_name'},
        {
            title:  __('Head Type', 'pcm'), dataIndex: 'head_type',
            render: (text: string, record: SalaryHeadType) => {
                const headType = parseInt(String(record.head_type))
                return (
                    <span className={`${headType === HeadType.Earning ? 'text-green-600' : 'text-red-600'}`}>
                        {headType === HeadType.Earning ? __('Earning', 'pcm') : __('Deduction', 'pcm')}
                    </span>
                )
            }
        },
        {
            title:  __('Head Amount', 'pcm'), dataIndex: 'head_amount',
            render: (text: string, record: SalaryHeadType) => {
                return (
                    <span>
                        {record.head_amount}
                        {parseInt(String(record.is_percentage)) === 1 ? ' %' : ''}
                        {parseInt(String(record.is_variable)) === 1 ? __(' and variable', 'pcm') : ''}
                    </span>
                )
            }

        },
        {
            title:  __('Is Taxable', 'pcm'), dataIndex: 'is_taxable',
            render: (text: string, record: SalaryHeadType) => {
                const isTaxable = parseInt(String(record.is_taxable))
                return (
                    <span className={`${isTaxable === 1 ? 'text-green-600' : 'text-red-600'}`}>
                        {isTaxable === 1 ? __('Yes', 'pcm') : __('No', 'pcm')}
                    </span>
                )
            }
        },
        {
            title:  __('Is Personal Savings', 'pcm'), dataIndex: 'is_personal_savings',
            render: (text: string, record: SalaryHeadType) => {
                const isPersonalSavings = parseInt(String(record.is_personal_savings))
                return (
                    <span className={`${isPersonalSavings === 1 ? 'text-green-600' : 'text-red-600'}`}>
                        {isPersonalSavings === 1 ? __('Yes', 'pcm') : __('No', 'pcm')}
                    </span>
                )
            }
        },
        {
            title:  __('Should Affect Basic Salary', 'pcm'), dataIndex: 'should_affect_basic_salary',
            render: (text: string, record: SalaryHeadType) => {
                console.log(record)
                const shouldAffectSalary = parseInt(String(record.should_affect_basic_salary))
                return (
                    <span className={`${shouldAffectSalary === 1 ? 'text-green-600' : 'text-red-600'}`}>
                        {shouldAffectSalary === 1 ? __('Yes', 'pcm') : __('No', 'pcm')}
                    </span>
                )
            }
        },
        {title: __('Priority', 'pcm'), dataIndex: 'priority'},
        {
            title:  __('Status', 'pcm'), dataIndex: 'status',
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
            title:  __('Created on', 'pcm'), dataIndex: 'created_on',
            render: (text: string, record: SalaryHeadType) => {
                return (
                    <span>
                        {record.created_on}
                    </span>
                )
            }
        },
        {
            title:     __('Action', 'pcm'),
            dataIndex: 'action',
            render:    (text: string, record: SalaryHeadType) => (
                <div className="flex">
                    <button
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={() => handleModal(record)}
                    >
                        {__('Edit', 'pcm')}
                    </button>
                    {parseInt(String(record.status)) === SalaryHeadStatus.Active && (
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
                    {parseInt(String(record.status)) === SalaryHeadStatus.Inactive && (
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
        const should_affect_basic_salary = head?.should_affect_basic_salary;
        // @ts-ignore
        const _wpnonce = payCheckMate.pay_check_mate_nonce;
        const data = {id, head_name, status, head_type, is_percentage, is_variable, head_amount, is_taxable, priority, is_personal_savings, should_affect_basic_salary, _wpnonce};
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
        if (!data.head_type) {
            data = {
                ...data,
                head_type:     HeadType.Earning,
                is_percentage: 1,
                is_taxable:    1,
                priority:      1,
                should_affect_basic_salary: 1,
                status:        1
            }
        }
        setSelectedHeadType({id: data.head_type, name: parseInt(String(data.head_type)) === HeadType.Earning ? __('Earning', 'pcm') : __('Deduction', 'pcm')})
        setIsPercentage({id: data.is_percentage, name: parseInt(String(data.is_percentage)) === 1 ? __('Yes', 'pcm') : __('No', 'pcm')})
        setFormData(data)
        setShowModal(true)
    };

    const handlePageChange = (page: number) => {
        setFilterObject({'per_page': 10, 'page': page}); // Update the filter object with the new page value
        setCurrentPage(page);
    };

    const handleHeadType = (data: SelectBoxType) => {
        setSelectedHeadType(data);
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        const data = formData
        // @ts-ignore
        data._wpnonce = payCheckMate.pay_check_mate_nonce;
        if (formData.id) {
            try {
                makePutRequest<SalaryHeadType>(`/pay-check-mate/v1/salary-heads/${formData.id}`, data, true).then((data) => {
                    setSalaryHeads(models.map((salaryHead: SalaryHeadType) => {
                        if (salaryHead.id === formData.id) {
                            salaryHead = formData;
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
            data.head_type = selectedHeadType.id as HeadType;
            data.is_percentage = isPercentage.id ? 1 : 0;
            data.is_variable = isVariable.id ? 1 : 0;
            data.is_taxable = formData.is_taxable ?? 1;
            data.priority = formData.priority ?? 1;
            data.is_personal_savings = formData.is_personal_savings ?? 0;
            data.should_affect_basic_salary = formData.should_affect_basic_salary ?? 1;
            try {
                makePostRequest<SalaryHeadType>('/pay-check-mate/v1/salary-heads', data, false).then((data: SalaryHeadType) => {
                    setSalaryHeads([...models, data])
                    setShowModal(false)
                }).catch((e: unknown) => {
                    console.log(e);
                })
            } catch (error) {
                console.log(error); // Handle the error accordingly
            }
        }
    }
    const handleInputChange = (event: any) => {
        const {name, value} = event.target;
        setFormData({...formData, [name]: value});
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
                        <Button
                            onClick={() => handleModal({} as SalaryHeadType)}
                            className="hover:text-white active:text-white"
                        >
                            <CheckCircleIcon
                                className="w-5 h-5 mr-2 -ml-1 text-white"
                                aria-hidden="true"
                            />
                            {__('Add salary head', 'pcm')}
                        </Button>
                        {showModal && (
                            <Modal
                                setShowModal={setShowModal}
                                header={__('Add salary head', 'pcm')}
                                description={__('No need to add Basic as salary head. It will be added automatically.', 'pcm')}
                            >
                                <div className="mt-5 md:mt-0 md:col-span-2">
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                    >
                                        <FormInput
                                            label={__('Salary Head name', 'pcm')}
                                            name="head_name"
                                            id="head_name"
                                            value={formData.head_name}
                                            onChange={(e) =>
                                                handleInputChange(e)
                                            }
                                        />
                                        <FormInput
                                            label={__('Head amount', 'pcm')}
                                            type="text"
                                            name="head_amount"
                                            id="head_amount"
                                            value={formData.head_amount}
                                            onChange={(e) =>
                                                handleInputChange(e)
                                            }
                                        />
                                        <div className="flex items-center justify-between">
                                            <FormCheckBox
                                                label={__('Is percentage?', 'pcm')}
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
                                                tooltip={__('If you want to add this head as percentage, please check this box.', 'pcm')}
                                            />
                                            <FormCheckBox
                                                label={__('Is changeable in every payroll?', 'pcm')}
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
                                                tooltip={__('If you want to change this head amount in every payroll, please check this box. Eg: Bonus, Overtime, TA/DA, etc.', 'pcm')}
                                            />
                                        </div>
                                        <SelectBox
                                            title={__('Head type', 'pcm')}
                                            options={headType}
                                            selected={selectedHeadType}
                                            setSelected={handleHeadType}
                                        />
                                        <div className="flex items-center justify-between">
                                            <FormCheckBox
                                                label={__('Is Taxable', 'pcm')}
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
                                                tooltip={__("If this head is taxable, then check this. Eg: Basic, HRA, etc. Non-taxable: Mobile allowance, reimbursement, etc.", 'pcm')}
                                            />
                                            <FormCheckBox
                                                label={__('Is personal savings?', 'pcm')}
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
                                                tooltip={__("If this is a personal savings, then check this. Eg: PF, Gratuity, etc.", 'pcm')}
                                            />
                                        </div>

                                        <FormCheckBox
                                            label={__('Should affect salary?', 'pcm')}
                                            name="should_affect_basic_salary"
                                            id="should_affect_basic_salary"
                                            value={formData.should_affect_basic_salary}
                                            checked={parseInt(String(formData.should_affect_basic_salary)) === 1}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setFormData({...formData, should_affect_basic_salary: 1});
                                                } else {
                                                    setFormData({...formData, should_affect_basic_salary: 0});
                                                }
                                            }}
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            tooltip={__('If you don\'t want to affect the basic salary on the creation of an employee, then uncheck this. Eg: Revenue Stamp', 'pcm')}
                                        />
                                        <FormInput
                                            label={__('Priority', 'pcm')}
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
                                                {__('Add salary head', 'pcm')}
                                            </Button>
                                        </div>
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