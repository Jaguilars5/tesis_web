import { schoolYearService } from "@features/institutions/school-year/school-year.service";
import { useEffect, useReducer } from "react";

type Option = { label: string; value: string };

export const useSchoolYearOptions = () => {
  const [schoolYearOptions, dispatch] = useReducer(
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
  const [loadingSchoolYears, setLoading] = useReducer(
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

  return { schoolYearOptions, loadingSchoolYears };
};
