const people = [
    { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
    // More people...
]

export const EmployeeList = () => {
    return (
        <div className="overflow-hidden bg-white shadow sm:rounded-lg mt-10">
            <div className="px-4 py-6 sm:px-6">
                <h3 className="text-base font-semibold leading-7 text-gray-900">Applicant Information</h3>
            </div>
            <div className="border-t border-gray-100">
                <dl className="divide-y divide-gray-100">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                        <tr>
                            <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                            >
                                Name
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Title
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Email
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Role
                            </th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
                                <span className="sr-only">Edit</span>
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                        {people.map((person) => (
                            <tr key={person.email}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                                    {person.name}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.title}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.email}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.role}</td>
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                                    <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                        Edit<span className="sr-only">, {person.name}</span>
                                    </a>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </dl>
            </div>
        </div>
    )
}