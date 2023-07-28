import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {__} from "@wordpress/i18n";
import {useEffect, useState} from "@wordpress/element";
import useFetchApi from "../Helpers/useFetchApi";

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
        title: {
            display: true,
            text: __('Payroll Summary', 'pcm'),
        },
    },
    scales: {
        x: {
            display: true,
            title: {
                display: true,
                text: __('Month', 'pcm'),
            },
        },
        y: {
            display: true,
            title: {
                display: true,
                text: __('Amount', 'pcm'),
            }
        },
    },
};

export function PayrollChart() {
    const {models} = useFetchApi('/pay-check-mate/v1/payrolls', {});
    const [data, setData] = useState<any>(null);
    useEffect(() => {
        if (!models) return;
        // Create labels from the models by looping through the models and getting the payroll_date
        let labels: string[] = [];
        models.forEach((model: any) => {
            // Get only month and year
            let dataString = new Date(model.payroll_date).toUTCString().split(' ').slice(2, 4).join(' ');
            labels.push(dataString);
        })
        setData ({
            labels: labels,
            datasets: [
                {
                    label: __('Payroll Summary', 'pcm'),
                    data: models.map((model: any) => model.total_salary),
                    backgroundColor: [
                        'rgba(99,237,255, .7)',
                    ],
                    borderColor: [
                        'rgb(8,136,152)',
                    ],
                    borderWidth: 1,
                },
            ],
        });
    }, [models]);
    if (!data) return null;
    return <Bar options={options} data={data} />;
}
