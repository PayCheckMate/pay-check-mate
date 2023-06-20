import {useState} from "@wordpress/element";
import {Loading} from "./Loading";
import {EmptyState} from "./EmptyState";
import {Card} from "./Card";

type Column = {
    title: string;
    dataIndex: string;
    render?: (text: string, record: any) => JSX.Element;
};

type TableProps = {
    columns: Column[];
    data: any[];
    isLoading?: boolean;
    totalPage?: number;
    pageSize?: number;
    currentPage?: number;
    onPageChange?: (page: number) => void;
};

export const Table = ({columns = [], data = [], isLoading = true, totalPage = 1, pageSize = 10, currentPage = 1, onPageChange = (page: number) => {}}: TableProps) => {
    if (!data.length && !isLoading) {
        return (
            <>
                <Card>
                    <EmptyState />
                </Card>
            </>
        );
    }

    const hasIdColumn = columns.some((column) => column.dataIndex === "#");

    let dataIndex = pageSize * (currentPage -1) + 1;

    if (!hasIdColumn) {
        columns = [
            {
                title: "#",
                dataIndex: "#",
                render: (_, record) => <span>{dataIndex++}</span>,
            },
            ...columns,
        ];
    }

    // Pagination logic
    const totalPages = totalPage || Math.ceil(data.length / pageSize);

    const handlePageChange = (page: number) => {
        onPageChange(page);
    };
    console.log(columns)
    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    scope="col"
                                    key={column.dataIndex}
                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                    {column.title}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                        {data.map((item, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6"
                                    >
                                        {column.render
                                            ? column.render(item[column.dataIndex], item)
                                            : item[column.dataIndex]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="flex justify-center mt-4">
                        <nav className="flex items-center">
                            <button
                                onClick={() => handlePageChange(currentPage -1)}
                                disabled={currentPage === 1}
                                className="px-2 py-1 text-sm rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 focus:outline-none"
                            >
                                Previous
                            </button>
                            <span className="px-2 py-1 text-sm font-medium text-gray-900">Page {currentPage} of {totalPages}</span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === parseInt(String(totalPages))}
                                className="px-2 py-1 text-sm bg-gray-200 text-gray-600 hover:bg-gray-300 focus:outline-none"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
};
