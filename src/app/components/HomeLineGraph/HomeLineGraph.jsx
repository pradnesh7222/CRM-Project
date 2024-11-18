import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components of Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HomeLineGraph = () => {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('authToken');
    useEffect(() => {
        const fetchMonthlyActiveStudents = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/active-students-per-month/", {
                    method: 'GET', // You can also specify the method, which is GET by default
                    headers: {
                        'Authorization': `Bearer ${token}`,  // Add the token to the Authorization header
                        'Content-Type': 'application/json',  // Ensure content type is set to JSON if required
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
        
                const data = await response.json();
                console.log("Fetched Data:", data); // Log the fetched data
        
                // Ensure all counts have valid values, default to 0 if undefined
                const validatedCounts = data.counts.map(value => (isNaN(value) ? 0 : value));
        
                setChartData({
                    labels: data.labels,
                    datasets: [
                        {
                            label: 'Active Students per Month',
                            data: validatedCounts,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                            fill: true,
                        },
                    ],
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching active students data:", error);
            }
        };
        
        fetchMonthlyActiveStudents();
    }, []);

    if (loading) return <div>Loading...</div>; // Show loading indicator while data is being fetched

    // Define options for the chart, including step size and max value for the Y-axis
    const options = {
        scales: {
            y: {
                beginAtZero: true, // Start the Y-axis at 0
                max: 20, // Set the maximum value for the Y-axis
                ticks: {
                    stepSize: 5, // Set step size to 5
                },
            },
        },
    };

    return (
        <div>
            <Line data={chartData} options={options} /> {/* Render the line chart with options */}
        </div>
    );
};

export default HomeLineGraph;
