import {UserCapNames} from "../../Types/UserType";
import {FormInput} from "../../Components/FormInput";
import {__} from "@wordpress/i18n";
import {Button} from "../../Components/Button";
import {HOC} from "../../Components/HOC";
import React, {useEffect, useState} from "@wordpress/element";
import {Card} from "../../Components/Card";
import {SettingsType} from "../../Types/Settings";
import {Textarea} from "../../Components/Textarea";
import MediaGallery from "../../Components/MediaGallery";
import {replaceUnderscoreAndCapitalize} from "../../Helpers/Helpers";
import apiFetch from "@wordpress/api-fetch";
import useNotify from "../../Helpers/useNotify";
import {toast} from "react-toastify";

export const GeneralSettings = () => {
    const [settingsData, setSettingsData] = useState<SettingsType>({
        company_name: '',
        company_address: '',
        company_phone: '',
        company_email: '',
        company_website: '',
        company_logo: '',
    });

    useEffect(() => {
        apiFetch({
            path: '/pay-check-mate/v1/settings',
            method: 'GET',
        }).then((response: any) => {
            if (response) {
                setSettingsData(response);
            }
        }).catch((error: any) => {
            console.log(error)
        })
    }, []);

    const handleSubmit = () => {
        // @ts-ignore
        const _wpnonce = payCheckMate.pay_check_mate_nonce;
        // return;
        apiFetch({
            path: '/pay-check-mate/v1/settings',
            method: 'PATCH',
            data: {
                settings: settingsData,
                _wpnonce,
            },
        }).then((response: any) => {
            if (response) {
                toast.success(__('Settings updated successfully', 'pay-check-mate'), {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000
                });
            }
        }).catch((error: any) => {
            console.log(error)
        })
    }
    return (
        <>
            <HOC role={UserCapNames.pay_check_mate_admin}>
                <div className="sm:flex-auto mb-6">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">
                            {__('General Settings', 'pay-check-mate')}
                        </h1>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="text-base">
                            <Card>
                                <div className="mt-5 md:mt-0 md:col-span-2">
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                    >
                                        {Object.keys(settingsData).map((key: string) => {
                                            const settingsKey = key as (keyof SettingsType)
                                            switch (settingsKey) {
                                                case 'company_address':
                                                    return (
                                                        <Textarea
                                                            key={settingsKey}
                                                            label={replaceUnderscoreAndCapitalize(settingsKey)}
                                                            name={settingsKey}
                                                            id={settingsKey}
                                                            value={settingsData[settingsKey]}
                                                            onChange={(e: any) => setSettingsData({...settingsData, [settingsKey]: e.target.value})}
                                                        />
                                                    );
                                                case 'company_website':
                                                    return (
                                                        <FormInput
                                                            key={settingsKey}
                                                            className="col-span-6"
                                                            type='url'
                                                            label={replaceUnderscoreAndCapitalize(settingsKey)}
                                                            name={settingsKey}
                                                            id={settingsKey}
                                                            value={settingsData[settingsKey]}
                                                            onChange={(e: any) => setSettingsData({...settingsData, [settingsKey]: e.target.value})}
                                                        />
                                                    );
                                                case 'company_logo':
                                                    return (
                                                        <div key={`div-${settingsKey}`}>
                                                            <label key={`label-${settingsKey}`} htmlFor={settingsKey} className="block text-sm font-medium leading-6 text-gray-900">
                                                                {replaceUnderscoreAndCapitalize(settingsKey)}
                                                            </label>
                                                            <MediaGallery
                                                                key={`media-gallery-${settingsKey}`}
                                                                title={replaceUnderscoreAndCapitalize(settingsKey)}
                                                                settingsData={settingsData}
                                                                setSettingsData={setSettingsData}
                                                            />
                                                            {
                                                                settingsData[settingsKey] &&
                                                                <img key={`img-${settingsKey}`} src={settingsData[settingsKey]} alt={replaceUnderscoreAndCapitalize(settingsKey)} className="w-20" />
                                                            }
                                                        </div>
                                                    );
                                                default:
                                                    return (
                                                        <FormInput
                                                            key={settingsKey}
                                                            className="col-span-6"
                                                            type='text'
                                                            label={replaceUnderscoreAndCapitalize(settingsKey)}
                                                            name={settingsKey}
                                                            id={settingsKey}
                                                            value={settingsData[settingsKey]}
                                                            onChange={(e: any) => setSettingsData({...settingsData, [settingsKey]: e.target.value})}
                                                        />
                                                    );
                                            }
                                        })}

                                        <Button
                                            className="mt-4"
                                            onClick={() => handleSubmit()}
                                        >
                                            {__('Save', 'pay-check-mate')}
                                        </Button>
                                    </form>
                                </div>
                            </Card>
                        </div>
                    </div>
            </HOC>
        </>
    )
}
