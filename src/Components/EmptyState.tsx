import { PlusIcon } from '@heroicons/react/20/solid'
import {__} from "@wordpress/i18n";
import {XMarkIcon} from "@heroicons/react/24/outline";

export const EmptyState=()=> {
    return (
        <div className="text-center">
            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-red-100">
                        <XMarkIcon className="w-6 h-6 text-red-600 font-bold" aria-hidden="true" />
                    </div>
                    <h2 className="text-xl font-medium text-gray-600 dark:text-gray-400">{__('No data found', 'wp-payroll')}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{__('Sorry, we couldn’t find any matches.', 'wp-payroll')}</p>
                </div>
            </div>
        </div>
    )
}
