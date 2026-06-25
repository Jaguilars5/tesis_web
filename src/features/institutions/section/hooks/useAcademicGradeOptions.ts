import { academicGradeService } from "@features/institutions/academic-grade/academic-grade.service";
import { useEffect, useReducer } from "react";

export const useAcademicGradeOptions = () => {
  const [options, dispatch] = useReducer(
    (
      _state: { label: string; value: string }[],
      action:
        | { type: "success"; options: { label: string; value: string }[] }
        | { type: "error" },
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
  const [loading, setLoading] = useReducer(
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
    academicGradeService
      .list({ page: 1, pageSize: 100 })
      .then((grades) => {
        if (!cancelled) {
          dispatch({
            type: "success",
            options: grades.map((grade) => ({
              label: grade.name,
              value: String(grade.id),
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
  return { academicGradeOptions: options, loadingAcademicGrades: loading };
};
