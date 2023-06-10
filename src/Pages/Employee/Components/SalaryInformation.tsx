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
    let isAffectCheckBox = localStorage.getItem('Employee.isAffectCheckBox');
    // @ts-ignore
    isAffectCheckBox = JSON.parse(isAffectCheckBox);
    if (isAffectCheckBox === null) {
        // @ts-ignore
        isAffectCheckBox = {};
    }
    const [salaryHeads, setSalaryHeads] = useState<SalaryHeadType[]>([]);
    const [formValues, setFormValues] = useState(initialValues);
    const [grossSalary, setGrossSalary] = useState<number>(formValues.gross_salary || 0);
    const [isAffect, setIsAffect] = useState(isAffectCheckBox);

    const {models} = useFetchApi<SalaryResponseType>('/pay-check-mate/v1/salary-heads', {'per_page': '-1', 'orderby': 'head_type', 'order': 'asc', 'status': 1});

    // Set salary heads after fetch data from api.
    useEffect(() => {
        if (models) {
            // @ts-ignore
            setSalaryHeads(models);
        }
    }, [models]);

    // After change salary heads, set default value for isAffected checkbox.
    useEffect(() => {
        if (salaryHeads && (isAffectCheckBox === null || Object.keys(isAffectCheckBox).length === 0)){
            const initialAffectState: any = {};
            salaryHeads.forEach((head) => {
                initialAffectState[`is_${head.id}_active`] = 1;
            });
            setIsAffect(initialAffectState);
        }
    }, [salaryHeads]);

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
                if (parseInt(isAffect[`is_${head.id}_active`]) === 0) {
                    headAmount = 0;
                }
                if (parseInt(String(head.head_type)) === HeadType.Earning) {
                    updatedGrossSalary += headAmount;
                } else if (parseInt(String(head.head_type)) === HeadType.Deduction) {
                    updatedGrossSalary -= headAmount;
                }
            });

            setGrossSalary(Math.round(updatedGrossSalary));
        }else if (name === 'gross_salary') {
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
                if (parseInt(isAffect[`is_${head.id}_active`]) === 0) {
                    updatedHeadAmount = 0;
                }
                if (parseInt(String(head.head_type)) === HeadType.Earning) {
                    updatedBasicSalary -= updatedHeadAmount;
                } else if (parseInt(String(head.head_type)) === HeadType.Deduction) {
                    updatedBasicSalary += updatedHeadAmount;
                }
            });

            formValues.basic_salary = Math.round(updatedBasicSalary);
        }else {
            setFormValues((prevState: SalaryHeadType) => ({
                ...prevState,
                [name]: parseInt(value),
            }));
        }
    };

    // Set callback function form parent component.
    useEffect(() => {
        setSalaryData(formValues);
    }, [formValues] );

    const handleIsAffectChange = (e: React.ChangeEvent<HTMLInputElement>, head: SalaryHeadType) => {
        const { name, checked } = e.target;
        setIsAffect((prevState: any) => ({
            ...prevState,
            [`is_${head.id}_active`]: checked ? 1 : 0,
        }));

        if (checked){
            parseInt(String(head.head_type)) === HeadType.Earning ? parseInt(String(formValues.basic_salary += formValues[`${head.id}`])) : formValues.basic_salary -= parseInt(String(formValues[`${head.id}`]));
        }else {
            parseInt(String(head.head_type)) === HeadType.Earning ? formValues.basic_salary -= parseInt(String(formValues[`${head.id}`])) : formValues.basic_salary += formValues[`${head.id}`];
        }
    };

    useEffect(() => {
        localStorage.setItem('Employee.isAffectCheckBox', JSON.stringify(isAffect));
    }, [isAffect]);

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
                                />
                                <FormCheckBox
                                    label={__('Uncheck, if you want to exclude this head from salary calculation.', 'pcm')}
                                    name={`is_${head.id}_active`}
                                    id={`is_${head.id}_active`}
                                    value={isAffect[`is_${head.id}_active`]}
                                    checked={parseInt(String(isAffect[`is_${head.id}_active`])) === 1}
                                    onChange={(e) => handleIsAffectChange(e, head)}
                                />

                            </div>
                        ))}
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
