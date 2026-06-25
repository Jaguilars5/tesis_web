import { subjectAcademicConfigService } from "@features/academic/subject-academic-config/subject-academic-config.service";
import { useEffect, useReducer } from "react";

type Option = { label: string; value: string };

export const useSubjectAcademicConfigOptions = () => {
  const [subjectAcademicConfigOptions, dispatch] = useReducer(
    (
      _state: Option[],
      action: { type: "success"; options: Option[] } | { type: "error" },
    ) => {
      switch (action.type) {
        case "success":
          return action.options;
        case "error":
          return [];
      }
    },
    [],
  );
  const [loadingSubjectAcademicConfigs, setLoading] = useReducer(
    (_state: boolean, action: { type: "loading" } | { type: "done" }) => {
      switch (action.type) {
        case "loading":
          return true;
        case "done":
          return false;
      }
    },
    true,
  );

  useEffect(() => {
    let cancelled = false;
    setLoading({ type: "loading" });
    subjectAcademicConfigService
      .list({ page: 1, pageSize: 100 })
      .then((configs) => {
        if (!cancelled) {
          dispatch({
            type: "success",
            options: configs.map((config) => ({
              label: `${config.subject_name} - ${config.academic_grade_name}`,
              value: String(config.id),
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

  return { subjectAcademicConfigOptions, loadingSubjectAcademicConfigs };
};
