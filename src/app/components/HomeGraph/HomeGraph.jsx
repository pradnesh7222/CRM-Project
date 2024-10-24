import { Chart as Chartjs, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import React from 'react';
import { Bar } from 'react-chartjs-2';

// Register the components you're using
Chartjs.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HomeGraph = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May','June','July','Aug','Sept','Oct','Nov','Dec'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [10, 20, 30, 40, 50,60,70,24,90,50,110,120],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <Bar data={data} />
    </div>
  );
};

export default HomeGraph;
