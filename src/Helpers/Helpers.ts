import {__} from "@wordpress/i18n";

export const validateRequiredFields = (data: any, requiredFields: string[], setFormError: (errors: any) => void) => {
    const errors: any = {};
    setFormError({});
    requiredFields.forEach((field) => {
        if (!data[field] && data[field] !== 0) {
            errors[field] = __('This field is required', 'pcm');
        }
    });
    setFormError(errors);
    return errors;
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
                    .no-print, .no-print * {
                        display: none !important;
                    }
                    .remarks{
                        width: 66.666667%;
                        margin-top: 1rem;
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
// export const debounce = (callback: any, wait: number) => {
//     let timeout: any = null;
//     return (...args: any) => {
//         const next = () => callback(...args);
//         clearTimeout(timeout);
//         timeout = setTimeout(next, wait);
//     };
// }
