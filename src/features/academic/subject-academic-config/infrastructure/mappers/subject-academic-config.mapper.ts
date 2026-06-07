import type { SubjectAcademicConfigT } from "../../domain/entities/subject-academic-config.entity";

export function mapToDomain(raw: Record<string, unknown>): SubjectAcademicConfigT {
  return {
    id: raw.id as number,
    subject_name: raw.subject_name as string,
    academic_grade_name: raw.academic_grade_name as string,
    weekly_hours: raw.weekly_hours as number,
    pedagogical_order: raw.pedagogical_order as number,
    is_required: raw.is_required as boolean,
    is_active: (raw.is_active ?? raw.active ?? true) as boolean,
    subject: raw.subject as number,
    academic_grade: raw.academic_grade as number,
  };
}
