import React from 'react'
import {  Col } from "react-bootstrap";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend);
function StatusBreakdown({ data }) {

    const chartData = {
        labels: ["To Do", "Waiting", "Inprogress", "Completed"],
        datasets: [
            {
                label: 'Tasks',
                data: [data.not_started.length, data.waiting.length, data.in_progress.length, data.completed.length],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };
    return (
            
                <div className='d-flex justify-content-center' style={{ height: "280px", paddingTop: "10px" }}>
                    <Pie data={chartData} />;
                </div>
         
    )
}

export default StatusBreakdown