'use client';

import React, { useEffect, useState } from 'react';

export function DateDisplay() {
    const [dateString, setDateString] = useState('');

    useEffect(() => {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        };
        setDateString(now.toLocaleDateString('ko-KR', options));
    }, []);

    if (!dateString) return <div className="h-6 w-32 bg-gray-200 animate-pulse rounded mx-auto" />;

    return (
        <div className="text-center mb-8">
            <p className="text-gray-500 font-medium uppercase tracking-wider text-sm">
                오늘
            </p>
            <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mt-1">
                {dateString}
            </h2>
        </div>
    );
}
