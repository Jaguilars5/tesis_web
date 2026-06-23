export interface OptionT { label: string; value: string; startDate?: string; endDate?: string; }
export interface ScheduleEntryT { id: number; dayOfWeek: number; dayName: string; startTime: string; endTime: string; subjectOfferingName: string; sectionName: string; }
export interface TimeSlotT { startTime: string; endTime: string; label: string; }
export interface RosterEntryT { enrollmentId: number; studentName: string; noteId: number | null; numericScore: number | null; teacherObservation: string; }
export interface TeacherActivityViewT { id: number; title: string; max_score: string; due_date: string; teacher_subject_section: number; activity_type: number | null; is_active: boolean; block_component: number; internal_weight: string; }
export interface TeacherServiceT { listActivities(p?: { page?: number; pageSize?: number }): Promise<TeacherActivityViewT[]>; loadGradingData(params: { teacherSubjectSectionId: number; evaluativeActivityId: number }): Promise<RosterEntryT[]>; saveGrades(params: { evaluativeActivityId: number; grades: { enrollmentId: number; numericScore: number | null; teacherObservation: string }[] }): Promise<void>; getSchedule(): Promise<ScheduleEntryT[]>; }
