import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface CheckBoxProps {
    label: string;
    name: string;
    id: string;
    className?: string;
    value: string | number;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    ariaInvalid?: boolean | undefined;
    ariaDescribedBy?: string;
}

export const FormCheckBox = ({label, name, id, className = '', value, checked, onChange, error, ariaInvalid, ariaDescribedBy,}: CheckBoxProps) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">
                {label}
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
                <input
                    type="checkbox"
                    name={name}
                    id={id}
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-500 sm:text-sm ${
                        error ? "border-red-500" : ""
                    } ${className}`}
                    value={value}
                    checked={checked}
                    onChange={onChange}
                    aria-invalid={ariaInvalid}
                    aria-describedby={ariaDescribedBy}
                />
                {error && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                )}
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-600" id={ariaDescribedBy}>
                    {error}
                </p>
            )}
        </div>
    );
};
