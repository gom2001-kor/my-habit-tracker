export interface Habit {
  id: string;
  name: string;
  icon?: string; // emoji or icon name
  completed: boolean;
  streak: number;
  completedDates: string[]; // ISO Date strings (YYYY-MM-DD)
}
