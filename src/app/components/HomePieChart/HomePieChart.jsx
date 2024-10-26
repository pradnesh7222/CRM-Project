// HomePieChart.js
import React from 'react';
import './HomePieChart.scss';
import { Chart as Chartjs, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';


Chartjs.register(ArcElement, Tooltip, Legend);

const HomePieChart = () => {
    const data = {
        labels: ['One', 'Two', 'Three'],
        datasets: [
            {
                data: [10, 20, 30],
                backgroundColor: ['red', 'green', 'blue'],
                label: 'My First Dataset',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false, // Corrected legend option
            },
        },
    };

    return (
        <div style={{ padding: '2px', width: '40%' }}>
            <Pie data={data} options={options} />
        </div>
    );
};

export default HomePieChart;
