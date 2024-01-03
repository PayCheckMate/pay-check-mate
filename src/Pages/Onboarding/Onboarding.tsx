import {Department} from "./Department";
import {__} from "@wordpress/i18n";
import {useState} from "@wordpress/element";
import {Steps} from "../../Components/Steps";
import {GeneralSettings} from "./GeneralSettings";
import {Button} from "../../Components/Button";
import {Designation} from "./Designation";
import {SalaryHeadList} from "./SalaryHeadList";
import {InstallPlugins} from "./InstallPlugins";

export const Onboarding=() =>{
    const [currentStep, setCurrentStep] = useState(1)
    const steps = [
        {label: __('General Settings', 'pay-check-mate')},
        {label: __('Create Department', 'pay-check-mate')},
        {label: __('Create Designation', 'pay-check-mate')},
        {label: __('Create Salary Head', 'pay-check-mate')},
        {label: __('Install Recommended Plugins', 'pay-check-mate')},
    ]

    return (
        <div>
            <Steps steps={steps} currentStep={currentStep} setStep={(step: number) => setCurrentStep(step)} />
            {currentStep === 1 && <GeneralSettings />}
            {currentStep === 2 && <Department />}
            {currentStep === 3 && <Designation />}
            {currentStep === 4 && <SalaryHeadList />}
            {currentStep === 5 && <InstallPlugins />}
            <div className="grid grid-cols-2 gap-8">
                <div className="flex justify-between mt-4">
                    {currentStep > 1 && (
                        <Button
                            type="button"
                            className="mr-2"
                            onClick={() => setCurrentStep(currentStep - 1)}
                        >
                            {__('Previous', 'pay-check-mate')}
                        </Button>
                    )}
                    {currentStep < steps.length && (
                        <Button
                            type="button"
                            onClick={() => setCurrentStep(currentStep + 1)}
                        >
                            {__('Save & Continue', 'pay-check-mate')}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
