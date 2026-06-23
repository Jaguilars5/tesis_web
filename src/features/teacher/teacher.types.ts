export interface ScheduleEntryT {
  id: number;
  dayOfWeek: number;
  dayName: string;
  startTime: string;
  endTime: string;
  subjectOfferingName: string;
  sectionName: string;
}

export interface TeacherServiceT {
  getSchedule(): Promise<ScheduleEntryT[]>;
}
