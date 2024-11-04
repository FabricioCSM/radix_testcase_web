import React, { useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ChartConfig, ChartContainer } from "../components/ui/chart";

export interface StatisticsData {
    equipment_id: string;
    statistics: {
        count: number;
        minimum: number;
        maximum: number;
        average: number;
    };
}

interface StatisticsChartsProps {
    statisticsData: StatisticsData[];
}

const chartConfig = {
    average: {
        label: "Average",
        color: "#451C6E",
    },
} satisfies ChartConfig

export const StatisticsCharts: React.FC<StatisticsChartsProps> = ({ statisticsData }) => {
    const chartData = statisticsData.map((data) => ({
        equipment: data.equipment_id,
        average: data.statistics.average,
    }));

    return (
        <div className="flex flex-col w-full max-w-4xl">
            <ChartContainer config={chartConfig} className="min-h-[300px]">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="equipment" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="average" fill="#451C6E" radius={20} />
                </BarChart>
            </ChartContainer>
        </div>
    );
};
