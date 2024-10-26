import { Chart as Chartjs, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

Chartjs.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HomeGraph = () => {
  const allMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const [chartData, setChartData] = useState({
    labels: allMonths,
    datasets: [
      {
        label: 'Leads per Month',
        data: Array(12).fill(0),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchMonthlyLeads = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/monthly-leads/');
        const data = await response.json();

        // Create a new data array matching the allMonths order
        const monthlyData = allMonths.map(month => {
          const index = data.labels.indexOf(month);
          return index !== -1 ? data.counts[index] : 0;  // Use data if available, otherwise 0
        });

        setChartData({
          labels: allMonths,
          datasets: [
            {
              label: 'Leads per Month',
              data: monthlyData,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMonthlyLeads();
  }, []);

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: 20,
        ticks: {
          stepSize: 5,
        },
      },
    },
  };

  return (
    <div>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default HomeGraph;
