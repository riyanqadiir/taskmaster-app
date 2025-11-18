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
                    <div className="text-center text-muted py-5  w-100">
                        <i className="bi bi-graph-up"></i>
                        <p className="mb-0 mt-2 ">No completed tasks yet</p>
                    </div> 
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

    // Read theme-aware colors from CSS variables so chart matches current theme
    const rootStyles = getComputedStyle(document.documentElement);
    const cssOnBrand = rootStyles.getPropertyValue('--on-brand')?.trim() || '#ffffff';
    const cssTextPrimary = rootStyles.getPropertyValue('--text-primary')?.trim() || '#0f172a';
    const cssBrand = rootStyles.getPropertyValue('--brand-primary')?.trim() || '#0d6efd';
    const cssTooltipBg = rootStyles.getPropertyValue('--bg-highlight')?.trim() || '#212529';
    const cssTextTertiary = rootStyles.getPropertyValue('--text-tertiary')?.trim() || '#6c757d';
    const cssBorder = rootStyles.getPropertyValue('--border-color')?.trim() || 'rgba(0,0,0,0.05)';

    // small helper to convert hex to rgba for chart background fills
    const hexToRgba = (hex, alpha = 0.15) => {
        if (!hex) return `rgba(13,110,253,${alpha})`;
        const h = hex.replace('#', '');
        const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const chartData = {
        labels,
        datasets: [
            {
                label: "Tasks Completed",
                data: values,
                fill: true,
                borderColor: cssBrand,
                backgroundColor: hexToRgba(cssBrand, 0.15),
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: cssBrand,
                pointBorderColor: cssOnBrand,
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
                backgroundColor: cssTooltipBg,
                titleColor: cssOnBrand,
                bodyColor: cssTextPrimary,
                borderColor: cssBrand,
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
                    color: cssTextTertiary,
                    font: { size: 12 },
                },
            },
            y: {
                beginAtZero: true,
                    grid: {
                    color: cssBorder,
                },
                ticks: {
                    stepSize: 1,
                    color: cssTextTertiary,
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
