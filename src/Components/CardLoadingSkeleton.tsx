import {Card} from "./Card";
import {__} from "@wordpress/i18n";

export const CardLoadingSkeleton = () => {
    return (
        <div className="sm:flex-auto mb-6 animate-pulse">
            <div className="grid grid-cols-2 gap-8">
                <div className="text-base">
                    <Card>
                        <div className="flex">
                            <div className="w-32 h-32 bg-gray-200 rounded"></div>
                            <div className="ml-4">
                                <h1 className="text-gray-900 font-semibold bg-gray-200 h-6 w-36 mb-4"></h1>
                                <p className="text-base bg-gray-200 h-4 w-64 mb-2 mt-2"></p>
                                <p className="text-base bg-gray-200 h-4 w-64 mb-2"></p>
                                <p className="text-base bg-gray-200 h-4 w-64 mb-2"></p>
                                <div className="mt-4 flex justify-end">
                                    <button className="bg-gray-300 text-gray-700 rounded px-4 py-2 cursor-not-allowed">
                                        {__('Loading...', 'pay-check-mate')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
