import {CurrencyDollarIcon, UsersIcon} from "@heroicons/react/24/outline";
import {__} from "@wordpress/i18n";
import {Card} from "../Components/Card";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {Bar} from 'react-chartjs-2';
import React, {useEffect, useState} from "@wordpress/element";
import useFetchApi from "../Helpers/useFetchApi";
import {Link, Navigate} from "react-router-dom";
import {applyFilters} from "../Helpers/Hooks";
import {userCan, userIs} from "../Helpers/User";

// ChartJS.register
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
    },
    scales: {
        x: {
            display: true,
            title: {
                display: true,
                text: __('Month', 'pay-check-mate'),
            },
        },
        y: {
            display: true,
            title: {
                display: true,
                text: __('Amount', 'pay-check-mate'),
            }
        },
    },
};

type DashboardResponse = {
    all_payrolls: any[],
    total_employees: number,
    last_payroll: any,
}
export const Dashboard = () => {
    if (!userIs('pay_check_mate_admin') || !userIs('pay_check_mate_accountant')) {
        return <Navigate to={'/profile'} />
    }
    const {makeGetRequest} = useFetchApi('', {}, false);
    const [data, setData] = useState<any>(null);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [lastPayroll, setLastPayroll] = useState(0)
    const stats = [
        {id: 1, name: 'Total Employees', stat: totalEmployees, icon: UsersIcon, link: '/employees'},
        {id: 2, name: 'Last Payroll Total', stat: lastPayroll, icon: CurrencyDollarIcon, link: '/payroll'},
    ]
    useEffect(() => {
        const backgroundColor = applyFilters('pay_check_mate.chart_background_color', 'rgba(110,114,114,0.7)');
        const borderColor = applyFilters('pay_check_mate.chart_border_color', 'rgb(48,49,49)');
        makeGetRequest<DashboardResponse>('/pay-check-mate/v1/dashboard').then((response) => {
            if (response.all_payrolls) {
                setTotalEmployees(response.total_employees);
                setData(response.all_payrolls);
                setLastPayroll(response.last_payroll.total_salary);
                let labels: string[] = [];
                response.all_payrolls.forEach((model: any) => {
                    let dataString = new Date(model.payroll_date).toLocaleString('default', {month: 'short', year: '2-digit'});
                    labels.push(dataString);
                })
                setData({
                    labels: labels,
                    datasets: [
                        {
                            label: __('Payroll Summary', 'pay-check-mate'),
                            data: response.all_payrolls.map((model: any) => model.total_salary),
                            backgroundColor: [
                                backgroundColor,
                            ],
                            borderColor: [
                                borderColor,
                            ],
                            borderWidth: 1,
                        },
                    ],
                });
            }
        })
    }, []);

    let indigo = applyFilters('pay_check_mate.indigo', 'gray');
    return (
        <>
            <div>
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                    {__('Dashboard', 'pay-check-mate')}
                </h1>
                {stats && (
                    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {stats.map((item) => (
                            <div
                                key={item.id}
                                className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
                            >
                                <dt>
                                    <div className={"absolute rounded-md bg-" + indigo + "-500 p-3"}>
                                      <item.icon
                                          className="h-6 w-6 text-white"
                                          aria-hidden="true"
                                      />
                                    </div>
                                    <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
                                </dt>
                                <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                                    <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
                                    <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                                        <div className="text-sm">
                                            <Link
                                                to={item.link || '#'}
                                                className={"font-medium text-" + indigo + "-500 hover:text-" + indigo + "-500"}
                                            >
                                                {__('View all', 'pay-check-mate')}
                                                <span className="sr-only"> {item.name} stats</span>
                                            </Link>
                                        </div>
                                    </div>
                                </dd>
                            </div>
                        ))}
                    </dl>
                )}
            </div>

            {data && data.labels.length > 0 && (
                <div className="mt-10">
                    <div>
                        <Card>
                            <>
                                <div className="header">
                                    <h1 className="title">{__('Payroll Summary', 'pay-check-mate')}</h1>
                                </div>
                                <Bar
                                    options={options}
                                    data={data}
                                />
                            </>
                        </Card>
                    </div>
                </div>
            )}
        </>
    );

}
