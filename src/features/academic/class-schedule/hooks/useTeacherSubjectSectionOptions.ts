import { teacherSubjectSectionService } from "@features/academic/teacher-subject-section/teacher-subject-section.service";
import { useEffect, useReducer } from "react";

interface Option {
  label: string;
  value: string;
}

export const useTeacherSubjectSectionOptions = () => {
  const [teacherSubjectSectionOptions, dispatch] = useReducer(
    (
      _state: Option[],
      action: { type: "success"; options: Option[] } | { type: "error" },
    ) => (action.type === "success" ? action.options : []),
    [],
  );
  const [loadingTeacherSubjectSections, setLoading] = useReducer(
    (_state: boolean, action: { type: "loading" } | { type: "done" }) =>
      action.type === "loading",
    true,
  );

  useEffect(() => {
    let cancelled = false;
    setLoading({ type: "loading" });
    teacherSubjectSectionService
      .list({ page: 1, pageSize: 100 })
      .then(({ items }) => {
        if (!cancelled) {
          dispatch({
            type: "success",
            options: items.map((item) => ({
              label:
                [
                  item.user_name,
                  item.subject_offering_subject_name ??
                    item.subject_offering_name,
                  item.subject_offering_section_name,
                ]
                  .filter(Boolean)
                  .join(" · ") || `Asignación ${item.id}`,
              value: String(item.id),
            })),
          });
          setLoading({ type: "done" });
        }
      })
      .catch(() => {
        if (!cancelled) {
          dispatch({ type: "error" });
          setLoading({ type: "done" });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { teacherSubjectSectionOptions, loadingTeacherSubjectSections };
};
