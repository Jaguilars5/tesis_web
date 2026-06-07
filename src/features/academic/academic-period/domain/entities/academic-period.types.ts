export type PeriodTypeEnum = "REGULAR" | "SUPLETORIO" | "REFUERZO";

export interface AcademicPeriodT {
  id: number;
  name: string;
  period_type: PeriodTypeEnum;
  start_date: string;
  end_date: string;
  is_regular_period: boolean;
  school_year: number;
  school_year_name: string;
  is_active: boolean;
}
