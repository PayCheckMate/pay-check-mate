import {CheckCircleIcon} from "@heroicons/react/24/outline";

interface StepPropsType {
    steps: Array<{ label: string }>;
    currentStep: number;
}

export const Steps = ({steps, currentStep}: StepPropsType) => {
    return (
        <ol className="flex bg-gray-200 justify-between items-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 shadow-sm sm:text-base sm:p-4 sm:space-x-4">
            {steps.map((step, index) => (
                <li key={index} className={`flex items-center ${index < currentStep -1 ? 'text-green-600' : index < currentStep ? 'text-blue-600' : ''}`}>
                    <span className={`flex items-center justify-center w-5 h-5 mr-2 text-xs border ${index < currentStep -1 ? 'border-green-600' : index < currentStep ? 'border-blue-600' : 'border-gray-500'} rounded-full shrink-0`}>
                        <span className={`${index < currentStep -1 ? 'text-green-600' : ''}`}>{index + 1}</span>
                    </span>
                    {step.label}
                    {index < currentStep -1 && (
                        <CheckCircleIcon className="ml-2 w-5 h-5 text-green-600" aria-hidden="true"/>
                    )}
                </li>
            ))}
        </ol>
    )
}