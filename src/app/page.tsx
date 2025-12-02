'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { DateDisplay } from '@/components/DateDisplay';
import { HabitList } from '@/components/HabitList';
import { AddHabitButton } from '@/components/AddHabitButton';
import { AddHabitModal } from '@/components/AddHabitModal';
import { HabitHistoryModal } from '@/components/HabitHistoryModal';
import { Habit } from '@/types';
import { supabase } from '@/lib/supabaseClient';

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [historyHabit, setHistoryHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      // Fetch habits
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .order('id', { ascending: true });

      if (habitsError) throw habitsError;

      // Fetch logs
      const { data: logsData, error: logsError } = await supabase
        .from('habit_logs')
        .select('*');

      if (logsError) throw logsError;

      // Process data
      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      const processedHabits: Habit[] = (habitsData || []).map(habit => {
        const habitLogs = (logsData || []).filter(log => log.habit_id === habit.id);
        const completedDates = habitLogs.map(log => log.completed_date);
        const isCompletedToday = completedDates.includes(dateStr);

        // Calculate streak
        let streak = 0;
        // Sort dates descending
        const sortedDates = [...completedDates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        let checkDate = new Date(today);
        // If not completed today, check from yesterday for streak calculation
        if (!isCompletedToday) {
          checkDate.setDate(checkDate.getDate() - 1);
        }

        // Simple loop to count consecutive days
        while (true) {
          const checkStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
          if (completedDates.includes(checkStr)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }

        return {
          ...habit,
          completed: isCompletedToday,
          streak,
          completedDates
        };
      });

      setHabits(processedHabits);
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const toggleHabit = async (id: string) => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    // Optimistic Update
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const newCompleted = !h.completed;
        const newCompletedDates = newCompleted
          ? [...(h.completedDates || []), dateStr]
          : (h.completedDates || []).filter(d => d !== dateStr);

        // Optimistic streak update
        let streak = h.streak;
        if (newCompleted) {
          streak = h.streak + 1;
        } else {
          streak = Math.max(0, h.streak - 1);
        }

        return { ...h, completed: newCompleted, completedDates: newCompletedDates, streak };
      }
      return h;
    }));

    try {
      if (habit.completed) {
        // Uncheck: Delete log
        const { error } = await supabase
          .from('habit_logs')
          .delete()
          .eq('habit_id', id)
          .eq('completed_date', dateStr);

        if (error) throw error;
      } else {
        // Check: Insert log
        const { error } = await supabase
          .from('habit_logs')
          .insert({ habit_id: id, completed_date: dateStr });

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error toggling habit:', error);
      // Revert optimistic update on error by re-fetching
      fetchHabits();
    }
  };

  const handleSaveHabit = async (name: string, icon: string) => {
    try {
      if (editingHabit) {
        // Update
        const { error } = await supabase
          .from('habits')
          .update({ name, icon })
          .eq('id', editingHabit.id);

        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from('habits')
          .insert({ name, icon });

        if (error) throw error;
      }
      fetchHabits();
      setIsModalOpen(false);
      setEditingHabit(null);
    } catch (error) {
      console.error('Error saving habit:', error);
    }
  };

  const deleteHabit = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this habit?')) return;

    try {
      // Delete habit (assuming cascade delete is enabled for logs in DB)
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setHabits(prev => prev.filter(h => h.id !== id));
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const openAddModal = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (habit: Habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const openHistoryModal = (habit: Habit) => {
    setHistoryHabit(habit);
  };

  if (loading) {
    return (
      <main className="min-h-screen pb-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      <Header />
      <DateDisplay />
      <HabitList
        habits={habits}
        onToggle={toggleHabit}
        onDelete={deleteHabit}
        onEdit={openEditModal}
        onClick={openHistoryModal}
      />
      <AddHabitButton onClick={openAddModal} />
      <AddHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveHabit}
        initialData={editingHabit ? { name: editingHabit.name, icon: editingHabit.icon || '📝' } : null}
      />
      <HabitHistoryModal
        isOpen={!!historyHabit}
        onClose={() => setHistoryHabit(null)}
        habit={historyHabit}
      />
    </main>
  );
}
