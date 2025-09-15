
export interface Constituency {
  id: number;
  mp_name: string;
  constituency_name: string;
  state: string;
  transparency_status: 'Current' | 'Outdated' | 'Missing';
  last_report_date: string;
  mp_email: string; 
}


export interface SpendingByCategory {
  category: string;
  amount: number;
  percentage: number;
}

export interface TopContractor {
  name: string;
  amount: number;
}

export interface AIInsight {
  id: number;
  title: string;
  finding: string;
  severity: 'High' | 'Medium' | 'Low';
}

export interface DashboardData {
  mp_name: string;
  constituency_name: string;
  id: number;
  last_report_date: string;
  state: string;
  total_expenditure: number;
  total_projects: number;
  spending_by_category: SpendingByCategory[];
  top_10_contractors: TopContractor[];
  ai_insights: AIInsight[];
}