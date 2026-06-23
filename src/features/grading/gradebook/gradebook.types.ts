export interface GradeRosterEntryT {
  enrollmentId: number;
  studentName: string;
  noteId: number | null;
  numericScore: number | null;
  teacherObservation: string;
}

export interface GradebookStateT {
  teacherSubjectSectionId: number | null;
  evaluativeActivityId: number | null;
  roster: GradeRosterEntryT[];
  loadingRoster: boolean;
  saving: boolean;
  loaded: boolean;
  error: string | null;
  success: boolean;
}
