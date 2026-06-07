import type { StudentNoteT } from "../entities/student-notes.types";
export interface StudentNoteListParamsT { page?: number; pageSize?: number; }
export type StudentNoteCreateDataT = Omit<StudentNoteT, "id" | "enrollment_name" | "evaluative_activity_title" | "grade_type_name" | "qualitative_scale_name">;
export interface StudentNoteRepositoryT {
  list(params?: StudentNoteListParamsT): Promise<StudentNoteT[]>;
  get(id: number): Promise<StudentNoteT>;
  create(data: StudentNoteCreateDataT): Promise<StudentNoteT>;
  update(id: number, data: Partial<StudentNoteT>): Promise<StudentNoteT>;
  softDelete(id: number): Promise<StudentNoteT>;
}
