import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";

interface TextInputProps {
    label: string;
    name: string;
    id: string;
    type?: string;
    className?: string;
    placeholder?: string;
    value: string | number;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    required?: boolean;
    helpText?: string;
    disabled?: boolean;
}

export const FormInput = ({label, name, id, className = "", type = "text", placeholder, value, onChange, error, required = false, helpText = "", disabled = false,}: TextInputProps) => {
    const [isSelectionValid, setIsSelectionValid] = useState(!required || (value !== "" && value !== undefined));

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event);
        setIsSelectionValid(!required || event.target.value !== "");
    };

    return (
        <div>
            <div className="relative mt-2 rounded-md shadow-sm">
                <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
                <input
                    type={type}
                    name={name}
                    id={id}
                    className={`relative mt-2 w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                        error ? "border-red-500" : ""
                    } ${className}`}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleInput}
                    required={required}
                    disabled={disabled}
                />
                {helpText && (
                    <p className="mt-2 text-sm text-gray-500" id={id}>
                        {helpText}
                    </p>
                )}
                {!isSelectionValid && (
                    <p className="mt-2 text-sm text-red-600">{__('This field is required.', 'pcm')}</p>
                )}
            </div>
            {/*{error && (*/}
            {/*    <p className="mt-2 text-sm text-red-600" id={ariaDescribedBy}>*/}
            {/*        {error}*/}
            {/*    </p>*/}
            {/*)}*/}
        </div>
    );
};
