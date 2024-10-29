// HomePieChart.js
import React, { useEffect, useState } from 'react';
import './HomePieChart.scss';
import { Chart as Chartjs, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';

Chartjs.register(ArcElement, Tooltip, Legend);

const HomePieChart = () => {
    const [chartData, setChartData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/students-per-course/');
                console.log('API response:', response.data);

                if (response.data && typeof response.data === 'object') {
                    const labels = Object.keys(response.data);
                    const dataValues = Object.values(response.data);

                    setChartData({
                        labels,
                        datasets: [
                            {
                                data: dataValues,
                                backgroundColor: ['pink', 'purple', 'Lavender   '],
                                label: 'Students Per Course',
                            },
                        ],
                    });
                } else {
                    console.error("Unexpected data format:", response.data);
                    setError("Unexpected data format");
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data. Please try again.");
            }
        };

        fetchData();
    }, []);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    return (
        <div className="chart-row">
            <h2 className="chart-heading">Students Per Course</h2>
            {error ? (
                <p>{error}</p>
            ) : chartData ? (
                <div className="chart-wrapper">
                    <Pie data={chartData} options={options} />
                </div>
            ) : (
                <p>Loading chart data...</p>
            )}
        </div>
    );
};

export default HomePieChart;