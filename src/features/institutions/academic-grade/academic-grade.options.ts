import { academicSubLevelService } from "@features/institutions/academic-sublevel/academic-sublevel.service"; import { useEffect, useReducer } from "react";
export const useAcademicSubLevelOptions = () => {
  const [options, dispatch] = useReducer((_s: { label: string; value: string }[], a: { type: "success"; options: { label: string; value: string }[] } | { type: "error" }) => { switch (a.type) { case "success": return a.options; case "error": return []; } }, []);
  const [loading, setLoading] = useReducer((_s: boolean, a: { type: "loading" } | { type: "done" }) => { switch (a.type) { case "loading": return true; case "done": return false; } }, true);
  useEffect(() => { let c = false; setLoading({ type: "loading" }); academicSubLevelService.list({ page: 1, pageSize: 100 }).then((sublevels) => { if (!c) { dispatch({ type: "success", options: sublevels.map((s) => ({ label: `${s.name} (${s.academic_level_name})`, value: String(s.id) })) }); setLoading({ type: "done" }); } }).catch(() => { if (!c) { dispatch({ type: "error" }); setLoading({ type: "done" }); } }); return () => { c = true; }; }, []);
  return { academicSubLevelOptions: options, loadingAcademicSubLevels: loading };
};
