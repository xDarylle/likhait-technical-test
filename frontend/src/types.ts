/**
 * Type definitions for the Expense Tracking System
 */

export interface Expense {
  id: number;
  amount: number;
  description: string;
  category_id: number;
  category: string;
  category_emoji: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryData {
  category: string;
  category_emoji: string;
  amount: number;
  count: number;
}

export interface CategoryBreakdownProps {
  categories: CategoryData[];
  total: number;
  totalCount: number;
}

export interface ExpenseFormData {
  amount: string;
  description: string;
  category_id: number | null;
  date: string;
}

export interface Category {
  id: number;
  name: string;
  emoji: string;
  created_at: string;
  updated_at: string;
}

export interface MonthlySummary {
  totalExpenses: number;
  categoryBreakdown: CategoryBreakdown[];
  topCategories: TopCategory[];
}

export interface CategoryBreakdown {
  category: string;
  category_emoji: string;
  total: number;
  percentage: number;
}

export interface TopCategory {
  category: string;
  total: number;
  count: number;
}

export interface DayExpenses {
  day: number;
  expenses: Expense[];
  total: number;
}
