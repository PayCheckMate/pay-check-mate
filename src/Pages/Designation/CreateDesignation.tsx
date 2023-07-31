import {__} from "@wordpress/i18n";
import {FormInput} from "../../Components/FormInput";
import {Button} from "../../Components/Button";
import {Modal} from "../../Components/Modal";
import React from "@wordpress/element";
import {validateRequiredFields} from "../../Helpers/Helpers";
import {toast} from "react-toastify";
import useNotify from "../../Helpers/useNotify";
import {useDispatch} from "@wordpress/data";
import designation from "../../Store/Designation";

type CreateDesignationProps = {
    showModal: boolean;
    setShowModal: any;
    formData: any;
    setFormData: (formData: any) => void;
    formError: any;
    setFormError: (formError: any) => void;
}
export const CreateDesignation = ({showModal, setShowModal, formData, setFormData, formError, setFormError}: CreateDesignationProps) => {
    const dispatch = useDispatch();
    const handleSubmit = (event: any) => {
        event.preventDefault();
        const data = formData
        // @ts-ignore
        data._wpnonce = payCheckMate.pay_check_mate_nonce;
        // Handle required fields
        const requiredFields = ['name'];
        const errors = validateRequiredFields(data, requiredFields, setFormError);
        if (Object.keys(errors).length > 0) {
            toast.error(__('Please fill all required fields', 'pcm'), {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: false
            });

            return;
        }

        if (formData.id) {
            dispatch(designation).updateDesignation(data).then((response: any) => {
                useNotify(response, __('Designation updated successfully', 'pcm'));
            }).catch((error: any) => {
                console.log(error, 'error')
                toast.error(__('Something went wrong while updating designation', 'pcm'), {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000
                });
            })

            setShowModal(false);
        } else {
            dispatch(designation).createDesignation(data).then((response: any) => {
                useNotify(response, __('Designation created successfully', 'pcm'));
            }).catch((error: any) => {
                console.log(error, 'error')
                toast.error(__('Something went wrong while creating designation', 'pcm'), {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000
                });
            })
            setShowModal(false);
        }
    }
    return(
        <Modal setShowModal={setShowModal} header={__('Add designation', 'pcm')}>
            <div className="mt-5 md:mt-0 md:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <FormInput
                        label={__('Designation name', 'pcm')}
                        name="name"
                        id="name"
                        value={formData.name}
                        error={formError.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required={true}
                    />
                    <Button className="mt-4" onClick={() => handleSubmit(event)}>
                        {__('Add designation', 'pcm')}
                    </Button>
                </form>
            </div>
        </Modal>
    )
}
