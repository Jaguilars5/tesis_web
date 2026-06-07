export interface GradeChangeHistoryT {
  id: number;
  student_note_name: string;
  modified_by_user_name: string;
  previous_score: number;
  new_score: number;
  reason: string;
  modified_at: string;
  student_note: number;
  modified_by_user?: number | null;
}
