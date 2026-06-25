import { schoolYearService } from "@features/institutions/school-year/school-year.service";
import { useEffect, useReducer } from "react";

export const useSchoolYearOptions = () => {
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
    schoolYearService
      .list({ page: 1, pageSize: 100 })
      .then((years) => {
        if (!cancelled) {
          dispatch({
            type: "success",
            options: years.map((year) => ({
              label: year.name ?? `Año ${year.id}`,
              value: String(year.id),
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
  return { schoolYearOptions: options, loadingSchoolYears: loading };
};
