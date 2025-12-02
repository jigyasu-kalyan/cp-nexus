'use client';

import { CSSProperties, FC, ReactNode } from 'react';

interface ShinyTextProps {
    children: ReactNode;
    disabled?: boolean;
    speed?: number;
    className?: string;
}

export const ShinyText: FC<ShinyTextProps> = ({
    children,
    disabled = false,
    speed = 5,
    className = '',
}) => {
    const animationDuration = `${speed}s`;

    return (
        <div
            className={`bg-clip-text text-transparent inline-block ${disabled ? '' : 'animate-shine'} ${className}`}
            style={
                {
                    backgroundImage:
                        'linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)',
                    backgroundSize: '200% 100%',
                    WebkitBackgroundClip: 'text',
                    animationDuration: animationDuration,
                } as CSSProperties
            }
        >
            {children}
        </div>
    );
};
