import {useEffect, useState} from "react";
import {FormInput} from "../../../Components/FormInput";
import {Textarea} from "../../../Components/Textarea";
import useFetchApi from "../../../Helpers/useFetchApi";
import {HeadType, SalaryHeadType, SalaryResponseType} from "../../../Types/SalaryHeadType";
import {__} from "@wordpress/i18n";

export const SalaryInformation = ({setSalaryData, initialValues = {}, children}: any) => {
    const [salaryHeads, setSalaryHeads] = useState<SalaryHeadType[]>([]);
    const [formValues, setFormValues] = useState(initialValues);
    const [grossSalary, setGrossSalary] = useState<number>(0);

    const {models} = useFetchApi<SalaryResponseType>('/pay-check-mate/v1/salary-heads', {'per_page': '-1', 'orderby': 'head_type', 'order': 'asc', 'status': 1});

    useEffect(() => {
        if (models) {
            // @ts-ignore
            setSalaryHeads(models);
        }
    }, [models]);

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
                    setFormValues((prevState: SalaryHeadType) => ({
                        ...prevState,
                        [head.id]: headAmount,
                    }));
                } else {
                    setFormValues((prevState: SalaryHeadType) => ({
                        ...prevState,
                        [head.id]: headAmount,
                    }));
                }

                if (parseInt(String(head.head_type)) === HeadType.Earning) {
                    updatedGrossSalary += headAmount;
                } else if (parseInt(String(head.head_type)) === HeadType.Deduction) {
                    updatedGrossSalary -= headAmount;
                }
            });

            setGrossSalary(Math.round(updatedGrossSalary));
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
                    setFormValues((prevState: SalaryHeadType) => ({
                        ...prevState,
                        [head.id]: headAmount,
                    }));
                } else {
                    setFormValues((prevState: SalaryHeadType) => ({
                        ...prevState,
                        [head.id]: headAmount,
                    }));
                }

                if (parseInt(String(head.head_type)) === HeadType.Earning) {
                    updatedBasicSalary -= headAmount;
                } else if (parseInt(String(head.head_type)) === HeadType.Deduction) {
                    updatedBasicSalary += headAmount;
                }
            });

            formValues.basic_salary = Math.round(updatedBasicSalary);
        }

        setSalaryData(formValues);
    };
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
                                disabled={true}
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
                                />
                            </div>
                        ))}
                        <div className="col-span-full">
                            <Textarea
                                label="Remarks"
                                name="remarks"
                                id="remarks"
                                value={formValues.remarks}
                                onChange={handleFormInputChange}
                            />
                        </div>
                    </div>
                </div>
                {children ? children : ''}
            </div>
        </div>
    );
};
