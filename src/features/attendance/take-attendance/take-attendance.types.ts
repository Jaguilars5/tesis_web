export interface RosterEntryT {
  enrollmentId: number;
  studentName: string;
  attendanceId: number | null;
  attendanceStatusId: number | null;
  absenceTypeId: number | null;
  observation: string;
}

export interface TakeAttendanceStateT {
  teacherSubjectSectionId: number | null;
  academicPeriodId: number | null;
  attendanceDate: string;
  roster: RosterEntryT[];
  loadingRoster: boolean;
  saving: boolean;
  loaded: boolean;
  error: string | null;
  success: boolean;
}

export interface BatchAttendanceRecordT {
  enrollment: number;
  teacher_subject_section: number;
  academic_period: number;
  attendance_date: string;
  attendance_status: number;
  absence_type: number | null;
  observation: string;
}
