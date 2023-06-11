import {useEffect, useState} from "react";
import {FormInput} from "../../../Components/FormInput";
import {Textarea} from "../../../Components/Textarea";
import useFetchApi from "../../../Helpers/useFetchApi";
import {HeadType, SalaryHeadType, SalaryResponseType} from "../../../Types/SalaryHeadType";
import {__} from "@wordpress/i18n";
import {FormCheckBox} from "../../../Components/FormCheckBox";

export const SalaryInformation = ({setSalaryData, initialValues = {}, children}: any) => {
    if (initialValues === null) {
        initialValues = {} as SalaryHeadType;
    }
    let TotalSalaryInHand = 0;
    const [salaryHeads, setSalaryHeads] = useState<SalaryHeadType[]>([]);
    const [formValues, setFormValues] = useState(initialValues);
    const [grossSalary, setGrossSalary] = useState<number>(formValues.gross_salary || 0);

    const {models} = useFetchApi<SalaryResponseType>('/pay-check-mate/v1/salary-heads', {'per_page': '-1', 'orderby': 'head_type', 'order': 'asc', 'status': 1});

    // Set salary heads after fetch data from api.
    useEffect(() => {
        if (models) {
            // @ts-ignore
            setSalaryHeads(models);
            localStorage.setItem('Employee.SalaryHeads', JSON.stringify(models));
        }
    }, [models]);

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

        if (name === 'basic_salary') {
            const basicSalary = parseInt(value);
            setFormValues((prevState: SalaryHeadType) => ({
                ...prevState,
                'basic_salary': basicSalary,
            }));

            let updatedGrossSalary = basicSalary;
            salaryHeads.forEach((head) => {
                let headAmount = parseInt(String(head.head_amount));
                if (parseInt(String(head.is_percentage)) === 1) {
                    headAmount = Math.round((basicSalary * head.head_amount) / 100);
                }
                setFormValues((prevState: SalaryHeadType) => ({
                    ...prevState,
                    [head.id]: headAmount,
                }));

                // @ts-ignore
                if (parseInt(String(head.should_affect_basic_salary)) === 0 || parseInt(String(head.is_personal_savings)) === 1) {
                    headAmount = 0;
                }
                if (parseInt(String(head.head_type)) === HeadType.Earning) {
                    updatedGrossSalary += headAmount;
                } else if (parseInt(String(head.head_type)) === HeadType.Deduction) {
                    updatedGrossSalary -= headAmount;
                }
            });

            setGrossSalary(Math.round(updatedGrossSalary));
        } else if (name === 'gross_salary') {
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
                if (parseInt(String(head.should_affect_basic_salary)) === 0 || parseInt(String(head.is_personal_savings)) === 1) {
                    updatedHeadAmount = 0;
                }
                if (parseInt(String(head.head_type)) === HeadType.Earning) {
                    updatedBasicSalary -= updatedHeadAmount;
                } else if (parseInt(String(head.head_type)) === HeadType.Deduction) {
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

    return (
        <div className="space-y-12">
            <div className="bg-white sm:rounded-xl md:col-span-2">
                <div className="px-4 py-6 sm:p-8">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <FormInput
                                label={__('Gross Salary', 'pcm')}
                                name="gross_salary"
                                id="gross_salary"
                                value={grossSalary}
                                onChange={handleFormInputChange}
                                helpText={__('Set gross salary to auto calculate basic salary and other salary heads.', 'pcm')}
                            />
                        </div>
                        <div className="sm:col-span-3">
                            <FormInput
                                label={__('Basic Salary', 'pcm')}
                                name="basic_salary"
                                id="basic_salary"
                                value={formValues.basic_salary}
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
                                    helpText={parseInt(String(head.should_affect_basic_salary)) === 1 ? __('This head will affect basic salary.', 'pcm') : ''}
                                />

                            </div>
                        ))}
                        <div className="col-span-full">
                            <div>
                                <h3 className="font-bold text-2xl leading-6 text-gray-600">{__('Salary in hand', 'pcm')}</h3>
                                {Object.keys(formValues).map((head) => {
                                    if ( head === 'gross_salary' || head === 'remarks') {
                                        return;
                                    }
                                    if (head === 'basic_salary') {
                                        TotalSalaryInHand += formValues[head];
                                    }
                                    const salaryHead = salaryHeads.find((salaryHead) => {
                                        if (parseInt(String(salaryHead.id)) === parseInt(head)){
                                            if (parseInt(String(salaryHead?.head_type)) === HeadType.Deduction){
                                                TotalSalaryInHand -= formValues[head];
                                            }
                                            if (parseInt(String(salaryHead?.head_type)) === HeadType.Earning){
                                                TotalSalaryInHand += formValues[head];
                                            }
                                            return salaryHead;
                                        }
                                    });
                                    return (
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
                </div>
                {children ? children : ''}
            </div>
        </div>
    );
};
