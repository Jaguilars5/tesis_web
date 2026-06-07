export interface InterdisciplinaryProjectT {
  id: number;
  academic_period_name: string;
  title: string;
  description: string | null;
  start_date: string;
  delivery_date: string;
  is_active: boolean;
  academic_period: number;
}
