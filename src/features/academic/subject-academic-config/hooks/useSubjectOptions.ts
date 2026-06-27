import { subjectService } from "@features/academic/subject/subject.service";
import { useEffect, useReducer } from "react";

type Option = { label: string; value: string };

export const useSubjectOptions = () => {
  const [subjectOptions, dispatch] = useReducer(
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
  const [loadingSubjects, setLoading] = useReducer(
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
    subjectService
      .list({ page: 1, pageSize: 100 })
      .then((result) => {
        if (!cancelled) {
          dispatch({
            type: "success",
            options: result.items.map((subject) => ({
              label: subject.name,
              value: String(subject.id),
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

  return { subjectOptions, loadingSubjects };
};
