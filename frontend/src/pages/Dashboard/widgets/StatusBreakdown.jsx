import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);

function StatusBreakdown({ data }) {
    const chartData = {
        labels: ["To Do", "Waiting", "In Progress", "Completed"],
        datasets: [
            {
                label: "Tasks",
                data: [
                    data.not_started.length,
                    data.waiting.length,
                    data.in_progress.length,
                    data.completed.length,
                ],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.3)",
                    "rgba(54, 162, 235, 0.3)",
                    "rgba(255, 206, 86, 0.3)",
                    "rgba(75, 192, 192, 0.3)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, // ✅ prevents overflow
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    boxWidth: 12,
                    padding: 10,
                },
            },
        },
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{
                height: "280px",
                padding: "10px",
                position: "relative",
                overflow: "hidden", // ✅ ensure chart canvas doesn't overflow
            }}
        >
            <div style={{ width: "100%", height: "100%", maxWidth: "260px" }}>
                <Pie data={chartData} options={chartOptions} />
            </div>
        </div>
    );
}

export default StatusBreakdown;