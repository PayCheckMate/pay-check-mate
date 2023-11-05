import {useEffect, useState} from "react";
import {FormInput} from "../../../Components/FormInput";
import {Textarea} from "../../../Components/Textarea";
import {HeadType, SalaryHeadType} from "../../../Types/SalaryHeadType";
import {__} from "@wordpress/i18n";
import {useSelect} from "@wordpress/data";
import salaryHead from "../../../Store/SalaryHead";

export const SalaryInformation = ({setSalaryData, initialValues = {}, children, formErrors}: any) => {
    // const employeeId = useParams().id;
    if (initialValues === null) {
        initialValues = {} as SalaryHeadType;
    }
    let TotalSalaryInHand = 0;
    const [formValues, setFormValues] = useState(initialValues);
    const [grossSalary, setGrossSalary] = useState<number>(formValues.gross_salary || 0);

    const {salaryHeads} = useSelect((select) => select(salaryHead).getSalaryHeads({per_page: '-1', status: '1', order_by: 'head_type', order: 'ASC'}), []);

    const handleRemarksChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormValues((prevState: SalaryHeadType) => ({
            ...prevState,
            [name]: value,
        }));

    }
    // After change salary heads, calculate salary.
    const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let {name, value} = e.target;
        if (isNaN(value as any) || value === '') {
            // @ts-ignore
            value = 0;
        }

        if (name === 'gross_salary') {
            setGrossSalary(parseInt(value));
            const grossSalary = parseInt(value);
            setFormValues((prevState: SalaryHeadType) => ({
                ...prevState,
                'gross_salary': grossSalary,
            }));

            let updatedBasicSalary = grossSalary;
            salaryHeads.forEach((head) => {
                let headAmount = parseInt(String(head.head_amount));
                if (parseInt(String(head.is_percentage)) === 1) {
                    headAmount = Math.round((grossSalary * head.head_amount) / 100);
                }
                setFormValues((prevState: SalaryHeadType) => ({
                    ...prevState,
                    [head.id]: headAmount,
                }));

                let updatedHeadAmount = headAmount;
                // @ts-ignore
                if (parseInt(String(head.is_personal_savings)) === 1) {
                    updatedHeadAmount = 0;
                }
                if (parseInt(String(head.head_type)) === HeadType.Earning) {
                    updatedBasicSalary -= updatedHeadAmount;
                } else if (parseInt(String(head.head_type)) === HeadType.Deduction && parseInt(String(head.is_personal_savings)) === 1) {
                    updatedBasicSalary += updatedHeadAmount;
                }
            });

            formValues.basic_salary = Math.round(updatedBasicSalary);
        } else {
            setFormValues((prevState: SalaryHeadType) => ({
                ...prevState,
                [name]: parseInt(value),
            }));
        }
    };

    // Set callback function form parent component.
    useEffect(() => {
        setSalaryData(formValues);
    }, [formValues]);

    const handleActiveFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormValues((prevState: SalaryHeadType) => ({
            ...prevState,
            [name]: value,
        }));
    }

    return (
        <div className="space-y-12">
            <div className="bg-white sm:rounded-xl md:col-span-2">
                <div className="px-4 py-6 sm:p-8">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <FormInput
                                required={true}
                                label={__('Gross Salary', 'pcm')}
                                name="gross_salary"
                                id="gross_salary"
                                value={grossSalary}
                                onChange={handleFormInputChange}
                                error={formErrors.gross_salary}
                                helpText={__('Set gross salary to auto calculate basic salary and other salary heads.', 'pcm')}
                            />
                        </div>
                        <div className="sm:col-span-3">
                            <FormInput
                                required={true}
                                label={__('Basic Salary', 'pcm')}
                                name="basic_salary"
                                id="basic_salary"
                                value={formValues.basic_salary}
                                error={formErrors.basic_salary}
                                onChange={handleFormInputChange}
                            />
                        </div>
                        {salaryHeads.map((head) => (
                            <div
                                key={head.id}
                                className="sm:col-span-3"
                            >
                                <FormInput
                                    key={head.id}
                                    label={head.head_name + (head.head_type_text ? ` (${head.head_type_text})` : '')}
                                    name={`${head.id}`}
                                    id={`${head.id}`}
                                    value={formValues[`${head.id}`]}
                                    onChange={handleFormInputChange}
                                />

                            </div>
                        ))}
                        <div className="sm:col-span-3">
                            <FormInput
                                required={true}
                                type={'date'}
                                label={__('Active from', 'pcm')}
                                name="active_from"
                                id="active_from"
                                error={formErrors.active_from}
                                value={formValues.active_from}
                                onChange={handleActiveFormChange}
                            />
                        </div>
                        <div className="col-span-full">
                            <div>
                                <h3 className="font-bold text-2xl leading-6 text-gray-600">
                                    {__('Salary in hand', 'pcm')}
                                </h3>
                                {Object.keys(formValues).map((head) => {
                                    if (head === 'gross_salary' || head === 'remarks') {
                                        return;
                                    }
                                    if (head === 'basic_salary') {
                                        TotalSalaryInHand += parseInt(String(formValues[head]));
                                    }
                                    const salaryHead = salaryHeads.find((salaryHead) => {
                                        if (parseInt(String(salaryHead.id)) === parseInt(head)) {
                                            if (parseInt(String(salaryHead?.head_type)) === HeadType.Deduction) {
                                                TotalSalaryInHand -= parseInt(String(formValues[head]));
                                            }
                                            if (parseInt(String(salaryHead?.head_type)) === HeadType.Earning) {
                                                TotalSalaryInHand += parseInt(String(formValues[head]));
                                            }
                                            return salaryHead;
                                        }
                                    });
                                    return (
                                      (parseInt(String(salaryHead?.id)) === parseInt(head) || head === 'basic_salary') &&
                                        <div key={head} className="flex items-center justify-between mt-2">
                                            <span className="text-sm text-gray-500">{salaryHead?.head_name ? salaryHead?.head_name : head.replace(/_/g, ' ').toUpperCase()}</span>
                                            <span className="text-sm text-gray-500">
                                                {parseInt(String(salaryHead?.head_type)) === HeadType.Deduction && '(-)'}
                                                {parseInt(String(salaryHead?.head_type)) === HeadType.Earning && '(+)'}
                                                {formValues[head]}
                                            </span>
                                        </div>
                                    );
                                })}

                                <div className="flex items-center justify-between mt-2 border-t-2 border-gray-400 pt-2">
                                    <span className="font-bold text-xl text-gray-500">{__('Total Salary in hand', 'pcm')}</span>
                                    <span className="text-sm text-gray-500">{TotalSalaryInHand}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-full">
                            <Textarea
                                label="Remarks"
                                name="remarks"
                                id="remarks"
                                value={formValues.remarks}
                                onChange={handleRemarksChange}
                            />
                        </div>
                    </div>
                    {children ? children : ''}
                </div>
            </div>
        </div>
    );
};
