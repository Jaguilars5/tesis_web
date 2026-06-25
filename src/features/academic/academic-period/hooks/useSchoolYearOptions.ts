import { schoolYearService } from "@features/institutions/school-year/school-year.service";
import { useEffect, useReducer } from "react";

interface Option {
  label: string;
  value: string;
}

export const useSchoolYearOptions = () => {
  const [schoolYearOptions, dispatch] = useReducer(
    (
      _state: Option[],
      action: { type: "success"; options: Option[] } | { type: "error" },
    ) => (action.type === "success" ? action.options : []),
    [],
  );
  const [loadingSchoolYears, setLoading] = useReducer(
    (_state: boolean, action: { type: "loading" } | { type: "done" }) =>
      action.type === "loading",
    true,
  );

  useEffect(() => {
    let cancelled = false;
    setLoading({ type: "loading" });
    schoolYearService
      .list({ page: 1, pageSize: 100 })
      .then((items) => {
        if (!cancelled) {
          dispatch({
            type: "success",
            options: items.map((item) => ({
              label: item.name ?? `Año ${item.id}`,
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

  return { schoolYearOptions, loadingSchoolYears };
};
