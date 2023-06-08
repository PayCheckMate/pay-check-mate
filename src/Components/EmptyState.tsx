import {__} from "@wordpress/i18n";
import {XMarkIcon} from "@heroicons/react/24/outline";

export const EmptyState=({title, description, icon}: {title?: string, description?: string, icon?: any}) => {
    return (
        <div className="text-center">
            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-red-100">
                        {icon ? icon : <XMarkIcon className="w-6 h-6 text-red-600" aria-hidden="true"/>}
                    </div>
                    <h2 className="text-xl font-medium text-gray-600 dark:text-gray-400">
                        {title ? title : __('No results found', 'pcm')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {description ? description : __('Try adjusting your search or filter to find what you are looking for.', 'pcm')}
                    </p>
                </div>
            </div>
        </div>
    )
}
