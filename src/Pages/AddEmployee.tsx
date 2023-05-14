import {useState} from "react";
import {Card} from "../Components/Card";
import {Steps} from "../Components/Steps";

export const AddEmployee = () => {
    const [step, setStep] = useState(1);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [salary, setSalary] = useState("");

    // @ts-ignore
    const handleSubmit = (e) => {
        e.preventDefault();
        // submit form data to backend
        console.log({
            firstName,
            lastName,
            email,
            salary,
        });
    };
    const steps = [
        { label: 'Personal Info' },
        { label: 'Account Info' },
        { label: 'Review' },
        { label: 'Ratul' },
    ]
    return (
        <>
            <Steps steps={steps} currentStep={step} />
            <Card>
                <form onSubmit={handleSubmit} className="mx-auto w-80">
                    {step === 1 && (
                        <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md"
                        >
                            Next
                        </button>
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