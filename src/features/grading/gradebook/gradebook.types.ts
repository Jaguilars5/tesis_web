export interface GradeRosterEntryT {
  enrollmentId: number;
  studentName: string;
  noteId: number | null;
  numericScore: number | null;
  /** Nota al cargar el listado; define si ya estaba registrada. */
  originalNumericScore: number | null;
  teacherObservation: string;
  originalTeacherObservation: string;
}

export interface GradingContextT {
  activityId: number;
  activityTitle: string;
  dueDate: string;
  periodId: number;
  periodName: string;
  periodStartDate: string;
  periodEndDate: string;
  gradesLocked: boolean;
}

export interface GradebookStateT {
  teacherSubjectSectionId: number | null;
  academicPeriodId: number | null;
  evaluativeActivityId: number | null;
  roster: GradeRosterEntryT[];
  maxScore: number | null;
  gradingContext: GradingContextT | null;
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
    due_date?: string;
  };
  academic_period?: {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    grades_locked: boolean;
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

export interface TakeByActivitySaveErrorT {
  index: number;
  error: string;
  record: TakeByActivityRecordT;
}

export interface TakeByActivitySaveResultT {
  created?: unknown[];
  errors?: TakeByActivitySaveErrorT[];
}

export interface GradebookServiceT {
  getRoster(params: {
    evaluativeActivityId: number;
    teacherSubjectSectionId: number;
  }): Promise<TakeByActivityResponseT>;
  saveGrades(
    payload: TakeByActivitySavePayloadT,
  ): Promise<TakeByActivitySaveResultT | unknown[]>;
}
