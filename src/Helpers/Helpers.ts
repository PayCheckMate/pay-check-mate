import {__} from "@wordpress/i18n";

export const validateRequiredFields = (data: any, requiredFields: string[], setFormError: (errors: any) => void) => {
    const errors: any = {};
    setFormError({});
    requiredFields.forEach((field) => {
        if (!data[field] && data[field] !== 0) {
            errors[field] = __('This field is required', 'pay-check-mate');
        }
    });
    setFormError(errors);
    return errors;
}

export const getNonce = () => {
    // @ts-ignore
    return  payCheckMate.pay_check_mate_nonce;
}

// @ts-ignore
export const isOnboarding: boolean = payCheckMate.isOnboarding;
export const getCurrentEmployee = () => {
    // @ts-ignore
    return  payCheckMate.currentUser.data.employee;
}

export const getPayCheckMateUserRoles = () => {
    // @ts-ignore
    return payCheckMate.payCheckMateUserRoles;
}

export const handlePrint = (divID: string) => {
    const divToPrint = document.getElementById(divID);
    const iframe = document.createElement('iframe')
    iframe.setAttribute('style', 'height: 0px; width: 0px; position: absolute;')
    document.body.appendChild(iframe)
    let print = iframe.contentWindow
    if (print && divToPrint) {
        let htmlToPrint = `
                <style type="text/css">
                    body{
                        font-family: sans-serif;
                        line-height: 1;
                    }
                    .no-print, .no-print * {
                        display: none !important;
                    }
                    .remarks{
                        width: 66.666667%;
                        margin-top: 1rem;
                    }
                    .w-20{
                        width: 5rem;
                    }
                    .text-center {
                        text-align: center;
                    }
                    .mr-4{
                        margin-right: 1rem;
                    }
                    .prepared_by{
                        width: 20%;
                        margin-top: 1rem;
                    }
                    .text-right {
                        text-align: right;
                    }
                    .text-left {
                        text-align: left;
                    }
                    table {
                        border-collapse: collapse;
                        width: 100%;
                        border: 1px solid #000;
                    }
                    table td, table th {
                        border: 1px solid #000;
                        padding: 5px;
                    }
                    .flex {
                        display: flex;
                    }
                    .justify-between {
                        justify-content: space-between;
                    }
                    .justify-center {
                        justify-content: center;
                    }
                    h4 {
                      font-size: 20px;
                      font-weight: 400;
                    }
                    table {
                      border-collapse: collapse;
                      width: 100%;
                    }
                    body {
                      margin-left: 30px;
                    }
                    .grid {
                        display: grid;
                    }
                    .grid-cols-2 {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }
                    .gap-4 {
                        gap: 1rem;
                    }
                    .w-12 {
                        width: 3rem;
                    }
                    .h-12 {
                        height: 3rem;
                    }
                </style>
                `;
        htmlToPrint += divToPrint.outerHTML;
        print.document.open()
        print.document.write(htmlToPrint)
        print.document.close()
        print.focus()
        print.print()
    }
}

export function replaceUnderscoreAndCapitalize(string: string) {
    return string.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
}
