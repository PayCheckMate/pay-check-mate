import {applyFilters} from "../Helpers/Hooks";

export interface StatusProps {
    status: number;
    textMap?: {
        active: string;
        inactive: string;
        // Add more status types here with their corresponding texts
    };
}

const defaultTextMap = {
    active: 'Active',
    inactive: 'Inactive',
}
export const Status = ({status, textMap=defaultTextMap}: StatusProps) => {
    const getStatusText = () => {
        if (parseInt(String(status))) {
            return textMap.active || 'Active';
        } else {
            return textMap.inactive || 'Inactive';
        }
    };

    let colorActive = applyFilters('pcm.status_color_active', 'gray');
    colorActive = `text-${colorActive}-800 bg-gradient-to-r from-${colorActive}-100/10 to-green-200`
    let colorInactive = applyFilters('pcm.status_color_inactive', 'gray');
    colorInactive = `text-${colorInactive}-800 bg-gradient-to-r from-${colorInactive}-100/10 to-red-200`
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold ${parseInt(String(status)) ? colorActive : colorInactive}`}>
            {getStatusText()}
        </span>
    );
}
