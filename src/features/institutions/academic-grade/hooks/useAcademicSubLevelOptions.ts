import { academicSubLevelService } from "@features/institutions/academic-sublevel/academic-sublevel.service";
import { useEffect, useReducer } from "react";

export const useAcademicSubLevelOptions = () => {
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
    academicSubLevelService
      .list({ page: 1, pageSize: 100 })
      .then((sublevels) => {
        if (!cancelled) {
          dispatch({
            type: "success",
            options: sublevels.map((sublevel) => ({
              label: `${sublevel.name} (${sublevel.academic_level_name})`,
              value: String(sublevel.id),
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
  return {
    academicSubLevelOptions: options,
    loadingAcademicSubLevels: loading,
  };
};
