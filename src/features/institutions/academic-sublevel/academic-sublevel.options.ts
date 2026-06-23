import { useEffect, useReducer } from "react"; import { academicLevelService } from "@features/institutions/academic-level/academic-level.service";
export const useAcademicLevelOptions = () => {
  const [options, dispatch] = useReducer((_s: { label: string; value: string }[], a: { type: "success"; options: { label: string; value: string }[] } | { type: "error" }) => { switch (a.type) { case "success": return a.options; case "error": return []; } }, []);
  const [loading, setLoading] = useReducer((_s: boolean, a: { type: "loading" } | { type: "done" }) => { switch (a.type) { case "loading": return true; case "done": return false; } }, true);
  useEffect(() => { let c = false; setLoading({ type: "loading" }); academicLevelService.list({ page: 1, pageSize: 100 }).then((levels) => { if (!c) { dispatch({ type: "success", options: levels.map((l) => ({ label: l.name, value: String(l.id) })) }); setLoading({ type: "done" }); } }).catch(() => { if (!c) { dispatch({ type: "error" }); setLoading({ type: "done" }); } }); return () => { c = true; }; }, []);
  return { academicLevelOptions: options, loadingAcademicLevels: loading };
};
