export interface ProjectNoteT {
  id: number;
  enrollment_name: string;
  interdisciplinary_project_title: string;
  product_score: number;
  presentation_score: number;
  final_score: number;
  observation?: string | null;
  sync_status: string;
  enrollment: number;
  interdisciplinary_project: number;
}
