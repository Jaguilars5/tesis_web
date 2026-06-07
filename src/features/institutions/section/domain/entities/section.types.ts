export interface SectionT {
  id: number;
  parallel: string;
  capacity: number;
  is_active: boolean;
  school_year: number;
  school_year_name?: string;
  academic_grade: number | null;
  academic_grade_name?: string;
}
