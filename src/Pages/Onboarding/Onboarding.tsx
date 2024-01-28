import {Department} from "./Department";
import {__} from "@wordpress/i18n";
import {useState} from "@wordpress/element";
import {Steps} from "../../Components/Steps";
import {GeneralSettings} from "./GeneralSettings";
import {Button} from "../../Components/Button";
import {Designation} from "./Designation";
import {SalaryHeadList} from "./SalaryHeadList";
import {InstallPlugins} from "./InstallPlugins";
import {saveGeneralSettings} from "../../Helpers/Helpers";
import {useSettings} from "../../Helpers/useSettings";

export const Onboarding=() =>{
    const [currentStep, setCurrentStep] = useState(1)
    const {settingsData, setSettingsData} = useSettings();
    const steps = [
        {label: __('General Settings', 'pay-check-mate')},
        {label: __('Create Department', 'pay-check-mate')},
        {label: __('Create Designation', 'pay-check-mate')},
        {label: __('Create Salary Head', 'pay-check-mate')},
        {label: __('Install Recommended Plugins', 'pay-check-mate')},
    ]

    const goToStep = () => {
        if (currentStep === 1) {
            if (settingsData) {
                saveGeneralSettings(settingsData)
            }
        }
        setCurrentStep(currentStep + 1)
    }
    return (
        <div>
            <Steps steps={steps} currentStep={currentStep} setStep={(step: number) => setCurrentStep(step)} />
            {currentStep === 1 && <GeneralSettings key="GeneralSettings" setFormData={(data: any) => {
                setSettingsData((prevState) => ({
                    ...prevState,
                    ...data
                }))
            }} />}
            {currentStep === 2 && <Department key="Department" />}
            {currentStep === 3 && <Designation key="Designation" />}
            {currentStep === 4 && <SalaryHeadList key="SalaryHeadList" />}
            {currentStep === 5 && <InstallPlugins key="InstallPlugins" />}
            <div className="grid grid-cols-1 justify-items-center mt-6">
                <div className="flex justify-between w-1/2 mt-4">
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
                            onClick={() => {
                                goToStep()
                            }}
                        >
                            {__('Save & Continue', 'pay-check-mate')}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
