import React from "react";
import { Col } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function CompletionTrend({ data }) {
    const completed = data.completed;
    if (!Array.isArray(completed) || completed.length === 0) {
        return (
            <Col md={6} lg={4}>
                    <div className="text-center text-muted py-5">
                        <i className="bi bi-graph-up"></i>
                        <p className="mb-0 mt-2">No completed tasks yet</p>
                    </div>
            </Col>
        );
    }

    const countsByDate = completed.reduce((acc, task) => {
        const date = task.completedAt;
        if (!date) return acc;
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    const labels = Object.keys(countsByDate).sort();
    const values = labels.map((date) => countsByDate[date]);

    const chartData = {
        labels,
        datasets: [
            {
                label: "Tasks Completed",
                data: values,
                fill: true,
                borderColor: "#0d6efd",
                backgroundColor: "rgba(13, 110, 253, 0.15)",
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: "#0d6efd",
                pointBorderColor: "#fff",
                pointHoverBorderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: "#212529",
                titleColor: "#fff",
                bodyColor: "#adb5bd",
                borderColor: "#0d6efd",
                borderWidth: 1,
                cornerRadius: 8,
                padding: 10,
            },
        },
        layout: {
            padding: { top: 10, bottom: 10, left: 10, right: 10 },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: "#6c757d",
                    font: { size: 12 },
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: "rgba(0, 0, 0, 0.05)",
                },
                ticks: {
                    stepSize: 1,
                    color: "#6c757d",
                    font: { size: 12 },
                },
            },
        },
        animation: {
            tension: {
                duration: 1200,
                easing: "easeOutQuart",
                from: 0.2,
                to: 0.4,
                loop: false,
            },
        },
    };

    return (
        <div style={{ height: "280px", paddingTop: "10px" }}>
            <Line options={options} data={chartData} />
        </div>
    );
}

export default CompletionTrend;
