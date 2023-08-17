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

    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold ${parseInt(String(status)) ? 'text-green-800 bg-gradient-to-r from-green-100/10 to-green-200' : 'text-red-800 bg-gradient-to-r from-red-200 to-red-100/10'}`}>
            {getStatusText()}
        </span>
    );
}
