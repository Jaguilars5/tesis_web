import type { SubjectProjectT } from "../entities/subject-project.types";

export interface SubjectProjectRepositoryT {
  list(params?: { page?: number; pageSize?: number }): Promise<SubjectProjectT[]>;
  get(id: number): Promise<SubjectProjectT>;
  create(data: Omit<SubjectProjectT, "id" | "interdisciplinary_project_title" | "subject_offering_name">): Promise<SubjectProjectT>;
  delete(id: number): Promise<void>;
}
