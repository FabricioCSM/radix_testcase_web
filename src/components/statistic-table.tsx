import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Button } from './ui/button';
import { Download } from 'lucide-react';

export interface StatisticsData {
    equipment_id: string;
    statistics: {
        count: number;
        minimum: number;
        maximum: number;
        average: number;
    };
}

interface StatisticsTableProps {
    statisticsData: StatisticsData[];
}

export const StatisticsTable: React.FC<StatisticsTableProps> = ({
    statisticsData
}) => {

    const downloadCSV = () => {
        const csvRows: string[] = [];
        
        csvRows.push(['Equipment ID', 'Count', 'Minimum', 'Maximum', 'Average'].join(','));

        statisticsData.forEach(data => {
            csvRows.push([
                data.equipment_id,
                data.statistics.count,
                data.statistics.minimum.toFixed(2),
                data.statistics.maximum.toFixed(2),
                data.statistics.average.toFixed(2)
            ].join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'sensor_readings_statistics.csv');
        document.body.appendChild(link);
        link.click(); 
        document.body.removeChild(link); 
    };

    return (
        <div className="flex flex-col justify-center w-[80%]">
            <Button onClick={downloadCSV} className='w-36 bg-customPurple self-end'><Download/> Download data</Button>
            <Table>
                <TableCaption>Sensor Readings Statistics</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Equipment ID</TableHead>
                        <TableHead>Count</TableHead>
                        <TableHead>Minimum</TableHead>
                        <TableHead>Maximum</TableHead>
                        <TableHead>Average</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {statisticsData.map((data) => (
                        <TableRow key={data.equipment_id}>
                            <TableCell>{data.equipment_id}</TableCell>
                            <TableCell>{data.statistics.count}</TableCell>
                            <TableCell>{data.statistics.minimum.toFixed(2)}</TableCell>
                            <TableCell>{data.statistics.maximum.toFixed(2)}</TableCell>
                            <TableCell>{data.statistics.average.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
