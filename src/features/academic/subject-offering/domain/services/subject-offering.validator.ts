export const validateSubjectOfferingSchoolYear = (school_year: number): string | null => {
  if (!school_year) return "El año escolar es obligatorio";
  return null;
};

export const validateSubjectOfferingSection = (section: number): string | null => {
  if (!section) return "La sección es obligatoria";
  return null;
};

export const validateSubjectOfferingConfig = (subject_academic_config: number): string | null => {
  if (!subject_academic_config) return "La configuración académica es obligatoria";
  return null;
};
