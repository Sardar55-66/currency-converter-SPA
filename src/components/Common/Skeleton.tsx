import React from 'react';
import './Skeleton.scss';

interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    borderRadius?: string | number;
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    width = '100%',
    height = '20px',
    borderRadius = '4px',
    className = ''
}) => {
    const style = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
    };

    return (
        <div
            className={`skeleton ${className}`}
            style={style}
        />
    );
};

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
    lines = 1,
    className = ''
}) => (
    <div className={`skeleton-text ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
            <Skeleton
                key={index}
                height="16px"
                width={index === lines - 1 ? '60%' : '100%'}
                className="skeleton-line"
            />
        ))}
    </div>
);

export const SkeletonButton: React.FC<{ className?: string }> = ({ className = '' }) => (
    <Skeleton
        height="40px"
        width="120px"
        borderRadius="8px"
        className={`skeleton-button ${className}`}
    />
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`skeleton-card ${className}`}>
        <Skeleton height="20px" width="80%" className="skeleton-title" />
        <Skeleton height="16px" width="60%" className="skeleton-subtitle" />
        <Skeleton height="40px" width="100%" borderRadius="8px" className="skeleton-content" />
    </div>
);
