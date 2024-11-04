import React, { useState } from 'react';
import { StatisticsTable, StatisticsData } from './statistic-table';
import { StatisticsCharts } from './statistic-chart';

export const StatisticsDashboard: React.FC<{ statisticsData: StatisticsData[] }> = ({ statisticsData }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [filter, setFilter] = useState('');

    const filteredStatistics = statisticsData.filter((data) =>
        data.equipment_id.toString().includes(filter)
    );

    const totalItems = filteredStatistics.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredStatistics.slice(indexOfFirstItem, indexOfLastItem);

    const maxDisplayedPages = 10;
    const startPage = Math.max(1, currentPage - Math.floor(maxDisplayedPages / 2));
    const endPage = Math.min(totalPages, startPage + maxDisplayedPages - 1);
    
    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-row items-baseline">
                <div className="w-[90%] max-w-4xl mb-6 mr-12">
                    <input
                        type="text"
                        placeholder="Filter by Equipment ID"
                        value={filter}
                        onChange={(e) => {
                            setFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="border p-2  mb-4"
                    />

                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="border p-2 mb-4"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                </div>

                <div className="flex items-center justify-center mt-4">
                    <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="p-2 border rounded"
                    >
                        {'<<'}
                    </button>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 border rounded w-[100px]"
                    >
                        {'<'} Previous
                    </button>

                    {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
                        const pageNumber = startPage + index;
                        return (
                            <button
                                key={pageNumber}
                                onClick={() => setCurrentPage(pageNumber)}
                                className={`p-2 border rounded ${currentPage === pageNumber ? 'bg-customGreen text-white' : ''}`}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 border rounded w-[100px]"
                    >
                        Next {'>'}
                    </button>
                    <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="p-2 border rounded"
                    >
                        {'>>'}
                    </button>
                </div>
            </div>

            <StatisticsTable
                statisticsData={currentItems}
            />

            <StatisticsCharts statisticsData={currentItems} />
        </div>
    );
};
