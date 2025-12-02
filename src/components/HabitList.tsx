'use client';

import React from 'react';
import { Habit } from '@/types';
import { HabitCard } from './HabitCard';
import { AnimatePresence } from 'framer-motion';

interface HabitListProps {
    habits: Habit[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (habit: Habit) => void;
    onClick: (habit: Habit) => void;
}

export function HabitList({ habits, onToggle, onDelete, onEdit, onClick }: HabitListProps) {
    if (habits.length === 0) {
        return (
            <div className="text-center py-12 text-gray-400">
                <p>No habits yet. Add one to get started!</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto px-4 pb-24">
            <AnimatePresence mode='popLayout'>
                {habits.map((habit) => (
                    <HabitCard
                        key={habit.id}
                        habit={habit}
                        onToggle={onToggle}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        onClick={onClick}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
