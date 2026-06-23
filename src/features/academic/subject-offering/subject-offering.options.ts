import { subjectAcademicConfigService } from "@features/academic/subject-academic-config/subject-academic-config.service";
import { schoolYearService } from "@features/institutions/school-year/school-year.service";
import { sectionService } from "@features/institutions/section/section.service";
import { useEffect, useState } from "react";

interface Option {
  label: string;
  value: string;
}

export const useSchoolYearOptions = () => {
  const [schoolYearOptions, setSchoolYearOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    schoolYearService
      .list({ page: 1, pageSize: 100 })
      .then((items) => {
        if (!cancelled) {
          setSchoolYearOptions(
            items.map((i) => ({ label: i.name, value: String(i.id) })),
          );
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { schoolYearOptions, loading };
};

export const useSectionOptions = () => {
  const [sectionOptions, setSectionOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    sectionService
      .list({ page: 1, pageSize: 100 })
      .then((items) => {
        if (!cancelled) {
          setSectionOptions(
            items.map((i) => ({ label: i.parallel, value: String(i.id) })),
          );
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { sectionOptions, loading };
};

export const useSubjectAcademicConfigOptions = () => {
  const [subjectAcademicConfigOptions, setSubjectAcademicConfigOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    subjectAcademicConfigService
      .list({ page: 1, pageSize: 100 })
      .then((items) => {
        if (!cancelled) {
          setSubjectAcademicConfigOptions(
            items.map((i) => ({
              label: `${i.subject_name} - ${i.academic_grade_name}`,
              value: String(i.id),
            })),
          );
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { subjectAcademicConfigOptions, loading };
};
