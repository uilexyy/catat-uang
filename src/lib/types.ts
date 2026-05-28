export type TransactionType = "income" | "expense";

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  category: string;
  description: string | null;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: number;
  category: string;
  type: TransactionType;
  amount: number;
  month: number;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  type: "income" | "expense" | "both";
}

export interface DashboardData {
  total_balance: number;
  monthly_income: number;
  monthly_expense: number;
  monthly_chart: { month: string; income: number; expense: number }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}
