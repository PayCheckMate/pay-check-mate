import React from "react";

type TableSkeletonProps = {
    rows: number;
    columns: number;
};

const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows, columns }: TableSkeletonProps) => {
    const randomWidths = () => {
        // Random number between 1 and 8
        return `${Math.floor(Math.random() * 4) + 1}/4`;
    };

    // Function to render th elements dynamically
    const renderTableHeaders = () => {
        const headers = [];
        for (let i = 0; i < columns; i++) {
            headers.push(
                <th
                    key={i}
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
          <div className={`h-6 bg-gray-200 rounded w-${randomWidths()}`}></div>
        </th>
            );
        }
        return headers;
    };

    // Function to render td elements dynamically
    const renderTableData = () => {
        const rowsArray = [];
        for (let i = 0; i < rows; i++) {
            const rowData = (
                <tr key={i}>
                    {[...Array(columns)].map((_, index) => (
                        <td
                            key={index}
                            className="py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6"
                        >
                            <div className={`h-4 bg-gray-200 rounded w-${randomWidths()}`}></div>
                        </td>
                    ))}
                </tr>
            );
            rowsArray.push(rowData);
        }
        return rowsArray;
    };

    return (
        <>
            <div className="overflow-x-auto animate-pulse">
                <div className="mb-4 flex items-center justify-end">
                    <div className="h-8 bg-gray-200 rounded w-2/12"></div>
                </div>
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                    <tr>{renderTableHeaders()}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                    {renderTableData()}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center mt-4 animate-pulse">
                <nav className="flex items-center">
                    <div className="px-4 py-1 mr-6 bg-gray-200 rounded w-16 h-8"></div>
                    <div className="px-1 py-1 text-sm font-medium text-gray-900 dark:text-white w-24 h-8"></div>
                    <div className="w-20 h-10 bg-gray-200 rounded"></div>
                    <div className="px-1 py-1 text-sm font-medium text-gray-900 dark:text-white w-24 h-8"></div>
                    <div className="mx-2 text-gray-600 w-1 h-8"></div>
                    <div className="px-1 py-1 text-sm font-medium text-gray-900 dark:text-white w-64 h-8"></div>
                    <div className="mx-2 text-gray-600 w-1 h-8"></div>
                    <div className="px-1 py-1 text-sm font-medium text-gray-900 dark:text-white w-24 h-8"></div>
                    <div className="px-1 py-1 text-sm font-medium text-gray-900 dark:text-white w-20 h-10 bg-gray-200 rounded"></div>
                    <div className="px-4 py-1 ml-6 bg-gray-200 rounded w-16 h-8"></div>

                </nav>
            </div>
    </>
    );
};

// @ts-ignore
window.TableSkeleton = TableSkeleton;
export default TableSkeleton;
