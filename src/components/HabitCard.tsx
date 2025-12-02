import React from 'react';
import { Habit } from '@/types';
import { Check, Flame, Trash2, Pencil } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

interface HabitCardProps {
    habit: Habit;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (habit: Habit) => void;
    onClick: (habit: Habit) => void;
}

export function HabitCard({ habit, onToggle, onDelete, onEdit, onClick }: HabitCardProps) {
    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggle(habit.id);

        if (!habit.completed) {
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            const x = (rect.left + rect.width / 2) / window.innerWidth;
            const y = (rect.top + rect.height / 2) / window.innerHeight;

            confetti({
                origin: { x, y },
                particleCount: 50,
                spread: 60,
                colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'],
                disableForReducedMotion: true,
                zIndex: 1000,
            });
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this habit?')) {
            onDelete(habit.id);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => onClick(habit)}
            className={`
        flex items-center justify-between p-4 mb-3 rounded-2xl shadow-sm border transition-all duration-300 group cursor-pointer
        ${habit.completed
                    ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                    : 'bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700 hover:shadow-md'
                }
      `}
        >
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className={`
          w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0
          ${habit.completed ? 'bg-green-100 dark:bg-green-800' : 'bg-gray-100 dark:bg-gray-700'}
        `}>
                    {habit.icon || '📝'}
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className={`font-semibold text-lg break-words ${habit.completed ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-gray-100'}`}>
                        {habit.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs font-medium text-orange-500">
                        <Flame size={14} className={habit.streak > 0 ? 'fill-orange-500' : 'text-gray-400'} />
                        <span className={habit.streak > 0 ? 'text-orange-500' : 'text-gray-400'}>
                            {habit.streak} day streak
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(habit); }}
                    aria-label={`Edit ${habit.name}`}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                    <Pencil size={20} />
                </button>

                <button
                    onClick={handleDelete}
                    aria-label={`Delete ${habit.name}`}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                    <Trash2 size={20} />
                </button>

                <button
                    onClick={handleToggle}
                    aria-label={`Mark ${habit.name} as ${habit.completed ? 'incomplete' : 'complete'}`}
                    className={`
            w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90
            ${habit.completed
                            ? 'bg-green-500 text-white shadow-green-200 shadow-lg'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-500 dark:hover:bg-gray-600'
                        }
          `}
                >
                    <Check size={20} strokeWidth={3} />
                </button>
            </div>
        </motion.div>
    );
}
