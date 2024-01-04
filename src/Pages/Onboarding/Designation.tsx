import {__} from "@wordpress/i18n";
import {useState} from "@wordpress/element";
import {validateRequiredFields} from "../../Helpers/Helpers";
import {toast} from "react-toastify";
import department from "../../Store/Designation";
import useNotify from "../../Helpers/useNotify";
import {useDispatch, useSelect} from "@wordpress/data";
import {HOC} from "../../Components/HOC";
import {UserCapNames} from "../../Types/UserType";
import {DesignationType} from "../../Types/DesignationType";
import {Card} from "../../Components/Card";
import {PlusIcon} from "@heroicons/react/24/outline";

export const Designation = () => {
    const dispatch = useDispatch();
    const per_page = '-1';
    const [formData, setFormData] = useState<DesignationType>({} as DesignationType);
    const [formError, setFormError] = useState({} as { [key: string]: string });
    const {designations} = useSelect((select) => select(department).getDesignations({per_page: per_page, page: 1}), []);

    const handleSubmit = (event: any) => {
        event.preventDefault();
        const data = formData
        // @ts-ignore
        data._wpnonce = payCheckMate.pay_check_mate_nonce;
        // Handle required fields
        const requiredFields = ['name'];
        const errors = validateRequiredFields(data, requiredFields, setFormError);
        if (Object.keys(errors).length > 0) {
            toast.error(__('Please fill department name', 'pay-check-mate'), {
                position: toast.POSITION.TOP_RIGHT,
            });

            return;
        }

        dispatch(department).createDesignation(data).then((response: any) => {
            useNotify(response, __('Designation created successfully', 'pay-check-mate'));
            setFormData({} as DesignationType)
        }).catch((error: any) => {
            console.log(error, 'error')
            toast.error(__('Something went wrong while creating department', 'pay-check-mate'), {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000
            });
        })
    }
    return (
        <HOC role={UserCapNames.pay_check_mate_add_department}>
            <div className="sm:flex-auto mb-6">
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                    {__('Create Designation', 'pay-check-mate')}
                </h1>
            </div>
            <div className="grid grid-cols-1 justify-items-center">
                <div className="text-base w-1/2">
                    <Card>
                        <form className="flex flex-col gap-4">
                            {/*List of designations*/}
                            <div className="flex-1">
                                {designations?.map((department: DesignationType) => (
                                    <div>
                                        {department.name}
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center space-x-4">
                                <input
                                    name="name"
                                    id="name"
                                    value={formData.name || ''}
                                    onChange={(event) => setFormData({...formData, name: event.target.value})}
                                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                                    placeholder={__('Designation Name', 'pay-check-mate')}
                                    type="text"
                                />
                                <button
                                    onClick={handleSubmit}
                                    type="button"
                                    className="outline inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                                >
                                    <PlusIcon
                                        className="w-5 h-5"
                                        aria-hidden="true"
                                    />
                              </button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </HOC>
    )
}
