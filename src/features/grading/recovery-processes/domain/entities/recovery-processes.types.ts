export interface RecoveryProcessT {
  id: number;
  period_grade_summary_name: string;
  managed_by_user_name: string;
  initial_grade: number;
  reinforcement_grade?: number | null;
  improvement_eval_grade?: number | null;
  final_calculated_grade?: number | null;
  family_notified: boolean;
  start_date: string;
  end_date?: string | null;
  observations?: string | null;
  period_grade_summary: number;
  managed_by_user: number;
  process_type?: number | null;
}
