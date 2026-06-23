import { teacherSubjectSectionService } from "@features/academic/teacher-subject-section/teacher-subject-section.service";
import { useEffect, useState } from "react";

interface Option {
  label: string;
  value: string;
}

export const useTeacherSubjectSectionOptions = () => {
  const [teacherSubjectSectionOptions, setTeacherSubjectSectionOptions] =
    useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    teacherSubjectSectionService
      .list({ page: 1, pageSize: 100 })
      .then((items) => {
        if (!cancelled) {
          setTeacherSubjectSectionOptions(
            items.map((item) => ({
              label: [
                item.user_name,
                item.subject_offering_subject_name ?? item.subject_offering_name,
                item.subject_offering_section_name,
              ]
                .filter(Boolean)
                .join(" · "),
              value: String(item.id),
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

  return { teacherSubjectSectionOptions, loading };
};
