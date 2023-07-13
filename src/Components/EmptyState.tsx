import {__} from "@wordpress/i18n";
import {XMarkIcon} from "@heroicons/react/24/outline";

export const EmptyState = ({title, description, icon}: { title?: string, description?: string, icon?: any }) => {
    return (
        <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                <div className="flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-red-100/40">
                            {icon ? icon : <XMarkIcon
                                className="w-8 h-8 text-red-600"
                                aria-hidden="true"
                            />}
                        </div>
                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                            {title ? title : __('No results found', 'pcm')}
                        </h1>
                        <p className="mt-6 text-base leading-7 text-gray-600">
                            {description ? description : __('Try adjusting your search or filter to find what you are looking for.', 'pcm')}
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}
