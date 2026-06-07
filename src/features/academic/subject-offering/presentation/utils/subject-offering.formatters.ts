import type { SubjectOfferingT } from "../../domain/entities/subject-offering.types";

export const formatSubjectOfferingSchoolYear = (item: SubjectOfferingT): string => item.school_year_name;

export const formatSubjectOfferingSection = (item: SubjectOfferingT): string => item.section_name;

export const formatSubjectOfferingConfig = (item: SubjectOfferingT): string => item.subject_academic_config_name;
