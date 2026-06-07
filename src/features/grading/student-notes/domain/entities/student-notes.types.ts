export interface StudentNoteT {
  id: number;
  enrollment_name: string;
  evaluative_activity_title: string;
  grade_type_name: string;
  qualitative_scale_name: string;
  numeric_score?: number;
  manually_overridden: boolean;
  teacher_observation?: string;
  sync_status: string;
  enrollment?: number;
  evaluative_activity?: number;
  grade_type?: number;
  qualitative_scale?: number;
}
