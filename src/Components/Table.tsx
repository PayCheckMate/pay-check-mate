import {Loading} from "./Loading";
import {__} from "@wordpress/i18n";
import {XMarkIcon} from "@heroicons/react/24/outline";
import {EmptyState} from "./EmptyState";
import {Card} from "./Card";

type Column = {
    title: string;
    dataIndex: string;
    render?: (text: string, record: any) => JSX.Element;
}

type TableProps = {
    columns: Column[];
    data: any[];
    isLoading?: boolean;
}

export const Table = ({columns = [], data = [], isLoading = true}: TableProps) => {
    if (!data.length){
        return (
            <>
                <Card>
                    <EmptyState />
                </Card>
            </>
        )
    }
    return (
        <>
            {isLoading ? (<Loading/>) :
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                    <tr>
                        {columns.map(column => (
                            <th scope="col" key={column.dataIndex} className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                {column.title}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                    {data.map(item => (
                        <tr key={item.email}>
                            {columns.map((column, index) => (
                                <td key={index} className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                                    {column.render ? column.render(item[column.dataIndex], item) : item[column.dataIndex]}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            }
        </>
    );
}
