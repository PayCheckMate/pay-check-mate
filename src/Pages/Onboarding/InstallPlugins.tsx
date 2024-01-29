import {UserCapNames} from "../../Types/UserType";
import {__} from "@wordpress/i18n";
import {Card} from "../../Components/Card";
import {HOC} from "../../Components/HOC";
import {Button} from "../../Components/Button";
import apiFetch from "@wordpress/api-fetch";
import {toast} from "react-toastify";
import {useState} from "@wordpress/element";
import {CardLoadingSkeleton} from "../../Components/CardLoadingSkeleton";

export const InstallPlugins = () => {
    // @ts-ignore
    const baseUrl = payCheckMate.pluginUrl;
    const [loading, setLoading] = useState(false)

    const installPlugin = (plugin: string) => {
        setLoading(true)
        // @ts-ignore
        const _wpnonce = payCheckMate.pay_check_mate_nonce;
        apiFetch({
            path: '/pay-check-mate/v1/install-required-plugins',
            method: 'POST',
            data: {
                plugin: plugin,
                _wpnonce
            }
        }).then((response: any) => {
            toast.success(response.message);
        }).catch((error: any) => {
            toast.error(error.message);
        }).finally(() => {
            setLoading(false)
            window.location.href = '/wp-admin/admin.php?page=pay-check-mate';
        })
    }

    const cancelInstall = () => {
        setLoading(true)
        // @ts-ignore
        const _wpnonce = payCheckMate.pay_check_mate_nonce;
        apiFetch({
            path: '/pay-check-mate/v1/cancel-install-required-plugins',
            method: 'POST',
            data: {
                _wpnonce
            }
        }).finally(() => {
            setLoading(false)
            window.location.href = '/wp-admin/admin.php?page=pay-check-mate';
        })
    }

    return (
        <HOC role={UserCapNames.pay_check_mate_add_department}>
            <div className="sm:flex-auto mb-6">
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                    {__('Install Recommended Plugins', 'pay-check-mate')}
                </h1>
            </div>
            {loading ? (
                <CardLoadingSkeleton />
            ) : (
                <div className="grid grid-cols-2 gap-8">
                    <div className="text-base">
                        <Card>
                            <div className="flex">
                                <img
                                    src={baseUrl + "/images/crc-icon-256x256.jpg"}
                                    alt="CRC"
                                    className="w-32 h-32"
                                />
                                <div className="ml-4">
                                    <h1>
                                        {__('Custom Role Creator (CRC)', 'pay-check-mate')}
                                    </h1>
                                    <p className="text-base">
                                        {__('Custom Role Creator plugin allows you to add or change user roles and capabilities easily.', 'pay-check-mate')}
                                    </p>
                                    <div className="mt-4 flex justify-end">
                                        <Button
                                            type="button"
                                            className="mr-2 btn-primary-gray"
                                            onClick={() => cancelInstall()}
                                        >
                                            {__('Finish Onboarding', 'pay-check-mate')}
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => installPlugin('custom-role-creator')}
                                        >
                                            {__('Install & Activate', 'pay-check-mate')}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </HOC>
    )
}
