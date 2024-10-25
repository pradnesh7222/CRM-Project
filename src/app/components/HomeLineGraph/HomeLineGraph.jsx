import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS ,CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend} from 'chart.js';

ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend);

    const HomeLineGraph = () => {
    const data = {
        labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets:[{data:[10,20,30,40,50,60,70,80,90,100,110,120],
        backgroundColor:'red',
        borderColor:'blue',
        borderWidth:1,
    }]
    }
    return (
        <div>
            <Line data={data}/>
            
        </div>
    )
}

export default HomeLineGraph;
