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
  maxScore: number | null;
  loadingRoster: boolean;
  saving: boolean;
  loaded: boolean;
  error: string | null;
  success: boolean;
}

export interface TakeByActivityNoteT {
  id: number;
  numeric_score: number | null;
  teacher_observation: string;
}

export interface TakeByActivityStudentT {
  enrollment_id: number;
  student_id: number;
  student_name: string;
  note: TakeByActivityNoteT | null;
}

export interface TakeByActivityResponseT {
  evaluative_activity: {
    id: number;
    title: string;
    max_score: string;
  };
  students: TakeByActivityStudentT[];
}

export interface TakeByActivityRecordT {
  enrollment: number;
  numeric_score: number | null;
  teacher_observation: string;
}

export interface TakeByActivitySavePayloadT {
  evaluative_activity_id: number;
  teacher_subject_section_id: number;
  records: TakeByActivityRecordT[];
}

export interface GradebookServiceT {
  getRoster(params: {
    evaluativeActivityId: number;
    teacherSubjectSectionId: number;
  }): Promise<TakeByActivityResponseT>;
  saveGrades(payload: TakeByActivitySavePayloadT): Promise<unknown>;
}
