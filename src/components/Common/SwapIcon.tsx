import React from 'react';

interface SwapIconProps {
    className?: string;
    width?: number;
    height?: number;
}

export const SwapIcon: React.FC<SwapIconProps> = ({
    className = '',
    width = 16,
    height = 15
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 16 15"
            fill="none"
            className={className}
        >
            <path
                d="M1 5.5H14.5L10 1M14.7996 9.25H1.29962L5.79962 13.75"
                stroke="#0A0A0A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
