import {useEffect, useState} from "@wordpress/element";
import {NotFound} from "../404";
import ProgressiveImg from "./ProgressiveImg";
type needProData = {
    [key: string]: {
        [key: string]: {
            [key: string]: {
                [key: string]: string
            }
        }
    }
}
// @ts-ignore
const baseUrl = payCheckMate.pluginUrl;
const needProData: needProData = {
    "need_pro": {
        "pro/loans": {
            "image_urls": {
                "View Loan": baseUrl + "/images/loans/view-loan.jpg",
                "Disburse loan": baseUrl + "/images/loans/disburse-loan.jpg",
                "Loan in payroll": baseUrl + "/images/loans/loan-in-payroll.jpg"
            }
        },
        "pro/setup-loans": {
            "image_urls": {
                "Loan Config List": baseUrl + "/images/loans/loan-config-list.jpg",
                "Create Loan Config": baseUrl + "/images/loans/create-loan-config.jpg"
            }
        },
        "pro/setup-gratuity": {
            "image_urls": {
                "Gratuity config list": baseUrl + "/images/gratuity/gratuity-config-list.jpg",
                "Create Gratuity Config": baseUrl + "/images/gratuity/create-gratuity-config.jpg"
            }
        },
        "pro/setup-pf": {
            "image_urls": {
                "P.F. Setup": baseUrl + "/images/pf/pf-setup.jpg"
            }
        },
        "pro/pf-register": {
            "image_urls": {
                "P.F. Register": baseUrl + "/images/pf/pf-register.jpg"
            }
        },
        "pro/pf-ledger": {
            "image_urls": {
                "P.F. Ledger": baseUrl + "/images/pf/pf-ledger.jpg"
            }
        },
        "pro/gratuity-register": {
            "image_urls": {
                "Gratuity register": baseUrl + "/images/gratuity/gratuity-register.jpg"
            }
        },
        "pro/gratuity-ledger": {
            "image_urls": {
                "Gratuity Ledger": baseUrl + "/images/gratuity/gratuity-ledger.jpg"
            }
        },
        "pro/loan-register": {
            "image_urls": {
                "Loan Register": baseUrl + "/images/loans/loan-register.jpg"
            }
        },
        "pro/loan-ledger": {
            "image_urls": {
                "Loan Ledger": baseUrl + "/images/loans/loan-ledger.jpg"
            }
        },
        "pro/final-payment": {
            "image_urls": {
                "Final Payment page": baseUrl + "/images/final-payment/final-payment-page.jpg",
                "Final Payment": baseUrl + "/images/final-payment/final-payment.jpg",
                "Final payment payroll": baseUrl + "/images/final-payment/final-payment-payroll.jpg"
            }
        },
        "pro/payroll-salary-payment": {
            "image_urls": {
                "Import payroll salary modal": baseUrl + "/images/payroll/import-payroll-salary-modal.jpg",
                "Import payroll salary": baseUrl + "/images/payroll/import-payroll-salary.jpg",
                "Import payroll salary error": baseUrl + "/images/payroll/import-payroll-salary-error.jpg"
            }
        }
    }
}

export const NeedPro = () => {
    const [jsonData, setJsonData] = useState({} as any);
    const [pageId, setPageId] = useState('')
    const currentURL = window.location.href;
    useEffect(() => {
        const urlSegments = currentURL.split('/');
        const idIndex = urlSegments.indexOf('pro');
        if (idIndex !== -1 && idIndex < urlSegments.length - 1) {
            setPageId(urlSegments[idIndex + 1])
        }

        if (needProData.need_pro[`pro/${pageId}`] !== undefined) {
            console.log(needProData.need_pro[`pro/${pageId}`].image_urls)
            setJsonData(needProData.need_pro[`pro/${pageId}`].image_urls);
        } else {
            setJsonData({})
        }
    }, [pageId, currentURL])

    return (
        <>
            <div>
                {Object.keys(jsonData).length > 0 ? Object.keys(jsonData).map((index: string) => {
                    return (
                        <div key={index} className="px-4 py-5">
                            <h1 className="text-base font-semibold leading-6 text-gray-900 mb-6">
                                {index}
                            </h1>
                            <ProgressiveImg
                                src={jsonData[index]}
                                placeholderSrc={jsonData[index]}
                                alt={index}
                            />
                        </div>
                    )
                }): <NotFound/>}
            </div>
        </>
    );

}
