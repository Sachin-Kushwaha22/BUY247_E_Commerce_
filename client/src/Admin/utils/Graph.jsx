import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './dashboard.css';

const TimeDayStatisticsChart = () => {
    // Sample data - replace with your actual data
    const data = [
        { day: 'Monday', morning: 40, afternoon: 24, evening: 24 },
        { day: 'Tuesday', morning: 30, afternoon: 13, evening: 22 },
        { day: 'Wednesday', morning: 20, afternoon: 98, evening: 22 },
        { day: 'Thursday', morning: 27, afternoon: 39, evening: 20 },
        { day: 'Friday', morning: 18, afternoon: 48, evening: 21 },
        { day: 'Saturday', morning: 23, afternoon: 38, evening: 25 },
        { day: 'Sunday', morning: 34, afternoon: 43, evening: 21 },
    ];

    return (
        <div className="chart-container">
            <h2 className="chart-title">Time & Day Statistics</h2>
            <ResponsiveContainer>
                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis dataKey="day" stroke="#333" />
                    <YAxis
                        stroke="#333"
                        domain={[0, 100]}
                        ticks={[0, 20, 40, 60, 80, 100]} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                        }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Bar dataKey="morning" name="Morning" fill="#000" />
                    <Bar dataKey="afternoon" name="Afternoon" fill="#666" />
                    <Bar dataKey="evening" name="Evening" fill="#999" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TimeDayStatisticsChart;