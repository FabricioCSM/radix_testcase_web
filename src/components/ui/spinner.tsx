import React from 'react';

const Spinner: React.FC = () => {
    return (
        <svg
            className="animate-spin h-10 w-10"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#451C6E" 
            strokeWidth="2"
        >
            <circle cx="12" cy="12" r="10" stroke="lightgray" />
            <path
                d="M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0"
                fill="none"
                stroke="#451C6E"
                strokeLinecap="round"
                strokeWidth="2"
            />
        </svg>
    );
};

export default Spinner;