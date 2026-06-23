import { subjectService } from "@features/academic/subject/subject.service";
import { academicGradeService } from "@features/institutions/academic-grade/academic-grade.service";
import { useEffect, useState } from "react";

interface Option {
  label: string;
  value: string;
}

export const useSubjectOptions = () => {
  const [subjectOptions, setSubjectOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    subjectService
      .list({ page: 1, pageSize: 100 })
      .then((items) => {
        if (!cancelled) {
          setSubjectOptions(
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

  return { subjectOptions, loading };
};

export const useAcademicGradeOptions = () => {
  const [academicGradeOptions, setAcademicGradeOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    academicGradeService
      .list({ page: 1, pageSize: 100 })
      .then((items) => {
        if (!cancelled) {
          setAcademicGradeOptions(
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

  return { academicGradeOptions, loading };
};
