import {toast} from "react-toastify";

type response = {
    status: number;
    data: any;
    headers: any;
    message?: string;
    code?: number;
}
const useNotify = (response?: response, successMessage?: string, errorMessage?: string) => {
    if (!response) return;
    if (response.status === 201) {
        toast.success(successMessage, {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 3000
        });
    }
    if (response.data.status === 400) {
        toast.error(response.message, {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: false
        });
    }

    if (response.code === 500) {
        toast.error(response.message, {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 10000
        });
    }
}

export default useNotify;
