'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Habit } from '@/types';

interface HabitHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    habit: Habit | null;
}

export function HabitHistoryModal({ isOpen, onClose, habit }: HabitHistoryModalProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    if (!habit) return null;

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const monthNames = [
        '1월', '2월', '3월', '4월', '5월', '6월',
        '7월', '8월', '9월', '10월', '11월', '12월'
    ];

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const isCompleted = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return habit.completedDates?.includes(dateStr);
    };

    const getDayStatus = (day: number) => {
        const date = new Date(year, month, day);
        if (date > today) return 'future';
        if (isCompleted(day)) return 'success';
        return 'failure';
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl z-[70] p-6 m-4"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="text-2xl">{habit.icon}</div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {habit.name}
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <button onClick={prevMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                                    <ChevronLeft size={20} />
                                </button>
                                <h3 className="font-semibold text-lg">
                                    {year}년 {monthNames[month]}
                                </h3>
                                <button onClick={nextMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                                    <ChevronRight size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                                    <div key={day} className="text-xs text-gray-400 font-medium py-1">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: firstDay }).map((_, i) => (
                                    <div key={`empty-${i}`} />
                                ))}
                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const day = i + 1;
                                    const status = getDayStatus(day);
                                    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

                                    return (
                                        <div
                                            key={day}
                                            className={`
                                                aspect-square flex flex-col items-center justify-center rounded-lg text-sm relative
                                                ${isToday ? 'bg-indigo-50 dark:bg-indigo-900/30 font-bold' : ''}
                                            `}
                                        >
                                            <span className={`
                                                ${status === 'future' ? 'text-gray-300 dark:text-gray-600' : 'text-gray-900 dark:text-gray-100'}
                                            `}>
                                                {day}
                                            </span>
                                            {status !== 'future' && (
                                                <span className={`
                                                    text-[10px] font-bold mt-0.5
                                                    ${status === 'success' ? 'text-blue-500' : 'text-red-500'}
                                                `}>
                                                    {status === 'success' ? '성공' : '실패'}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                                <span className="text-gray-600 dark:text-gray-300">성공 (Success)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <span className="text-gray-600 dark:text-gray-300">실패 (Failure)</span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
