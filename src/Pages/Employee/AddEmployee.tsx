import {useState} from "react";
import {Card} from "../../Components/Card";
import {Steps} from "../../Components/Steps";
import {PersonalInformation} from "./PersonalInformation";
import {__} from "@wordpress/i18n";
import {EmployeeType} from "../../Types/EmployeeType";
import {Button} from "../../Components/Button";

export const AddEmployee = () => {
    const [step, setStep] = useState(1);
    const [formValues, setFormValues] = useState({} as EmployeeType);
    const [salary, setSalary] = useState("");

    // @ts-ignore
    const handleSubmit = (e) => {
        e.preventDefault();
    };
    const steps = [
        {label: 'Personal Info'},
        {label: 'Salary Info'},
        {label: 'Review'},
    ]
    console.log(formValues, 'formValues')
    return (
        <>
            <Steps steps={steps} currentStep={step} />
            <Card>
                <form onSubmit={handleSubmit} className="mx-auto w-3/4">
                    {step === 1 && (
                        <>
                            <PersonalInformation setFormData={setFormValues}>
                                <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                                    <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                                        Cancel
                                    </button>
                                    <Button
                                        type="submit"
                                        onClick={() => setStep(2)}
                                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        {__('Save & Continue', 'pcm')}
                                    </Button>
                                </div>
                            </PersonalInformation>
                        </>
                    )}

                    {step === 2 && (
                        <div>
                            <h2 className="text-2xl font-medium mb-4">Salary Info</h2>
                            <div className="mb-4">
                                <label htmlFor="salary" className="block font-medium mb-2">
                                    Salary
                                </label>
                                <input
                                    type="number"
                                    id="salary"
                                    name="salary"
                                    value={salary}
                                    onChange={(e) => setSalary(e.target.value)}
                                    className="border-gray-400 border-2 px-4 py-2 w-full rounded-md"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="mr-4 bg-gray-400 hover:bg-gray-500 text-white font-medium px-4 py-2 rounded-md"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(3)}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </form>
            </Card>
        </>
    )
};