import {useEffect, useState} from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import {SettingsType} from "../Types/Settings";

export const useSettings = () => {
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

    return {
        settingsData,
        setSettingsData,
    }
}
