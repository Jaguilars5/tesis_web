import { useEffect, useReducer } from "react";
import { academicPeriodService } from "@features/academic/academic-period";

interface Option { label: string; value: string; }

export const useAcademicPeriodOptions = () => {
  const [options, setOptions] = useReducer(
    (_s: Option[], a: { type: "success"; options: Option[] } | { type: "error" }) => {
      switch (a.type) { case "success": return a.options; case "error": return []; }
    }, []);
  const [loading, setLoading] = useReducer(
    (_s: boolean, a: { type: "loading" } | { type: "done" }) => {
      switch (a.type) { case "loading": return true; case "done": return false; }
    }, true);

  useEffect(() => {
    let cancelled = false;
    setLoading({ type: "loading" });
    academicPeriodService.list({ page: 1, pageSize: 100 })
      .then(({ items }) => {
        if (!cancelled) {
          setOptions({ type: "success", options: items.map((i) => ({ label: i.name, value: String(i.id) })) });
          setLoading({ type: "done" });
        }
      })
      .catch(() => { if (!cancelled) { setOptions({ type: "error" }); setLoading({ type: "done" }); } });
    return () => { cancelled = true; };
  }, []);

  return { academicPeriodOptions: options, loading };
};
