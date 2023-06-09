import {ExclamationCircleIcon} from "@heroicons/react/24/outline";

interface TextInputProps {
    label: string;
    name: string;
    id: string;
    type?: string;
    className?: string;
    placeholder?: string;
    value: string|number
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    ariaInvalid?: boolean | undefined;
    ariaDescribedBy?: string;
    required?: boolean;
}

export const FormInput = ({label, name, id, className='', type = "text", placeholder, value, onChange, error, ariaInvalid, ariaDescribedBy, required = false}: TextInputProps) => {
    return (
        <div>
            <div className="relative mt-2 rounded-md shadow-sm">
                <label
                    htmlFor={id}
                    className="block text-sm font-medium leading-6 text-gray-900"
                >
                    {label}
                </label>
                <input
                    type={type}
                    name={name}
                    id={id}
                    className={className ? className : `relative mt-2 w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                        error ? "border-red-500" : ""
                    }`}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    aria-invalid={ariaInvalid}
                    required={required}
                    aria-describedby={ariaDescribedBy}
                />
                {/*{error && (*/}
                {/*    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">*/}
                {/*        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true"/>*/}
                {/*    </div>*/}
                {/*)}*/}
            </div>
            {/*{error && (*/}
            {/*    <p className="mt-2 text-sm text-red-600" id={ariaDescribedBy}>*/}
            {/*        {error}*/}
            {/*    </p>*/}
            {/*)}*/}
        </div>
    );
};
