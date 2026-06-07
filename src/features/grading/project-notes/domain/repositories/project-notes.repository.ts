import type { ProjectNoteT } from "../entities/project-notes.types";
export interface ProjectNoteListParamsT { page?: number; pageSize?: number; }
export type ProjectNoteCreateDataT = Omit<ProjectNoteT, "id" | "enrollment_name" | "interdisciplinary_project_title">;
export interface ProjectNoteRepositoryT {
  list(params?: ProjectNoteListParamsT): Promise<ProjectNoteT[]>;
  get(id: number): Promise<ProjectNoteT>;
  create(data: ProjectNoteCreateDataT): Promise<ProjectNoteT>;
  update(id: number, data: Partial<ProjectNoteT>): Promise<ProjectNoteT>;
  softDelete(id: number): Promise<ProjectNoteT>;
}
