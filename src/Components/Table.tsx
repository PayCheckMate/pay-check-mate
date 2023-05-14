type Column = {
    title: string;
    dataIndex: string;
    render?: (text: string, record: any) => JSX.Element;
}

type TableProps = {
    columns: Column[];
    data: any[];
}

export const Table = ({ columns = [], data = [] }: TableProps) => {
    if (!columns.length) {
        return <div>Missing columns data</div>
    }

    if (!data.length) {
        return <div>No data available</div>
    }

    return (
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
                    {columns.map(column => (
                        <td key={column.dataIndex} className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                            {column.render ? column.render(item[column.dataIndex], item) : item[column.dataIndex]}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
}
