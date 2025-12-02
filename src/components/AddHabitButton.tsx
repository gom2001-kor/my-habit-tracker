'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface AddHabitButtonProps {
    onClick: () => void;
}

export function AddHabitButton({ onClick }: AddHabitButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-300 flex items-center justify-center z-50 hover:bg-indigo-700 transition-colors"
        >
            <Plus size={28} strokeWidth={3} />
        </motion.button>
    );
}
