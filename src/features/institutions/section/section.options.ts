import { useEffect, useReducer } from "react"; import { academicGradeService } from "@features/institutions/academic-grade/academic-grade.service"; import { schoolYearService } from "@features/institutions/school-year/school-year.service";

export const useAcademicGradeOptions = () => {
  const [options, dispatch] = useReducer((_s: { label: string; value: string }[], a: { type: "success"; options: { label: string; value: string }[] } | { type: "error" }) => { switch (a.type) { case "success": return a.options; case "error": return []; } }, []);
  const [loading, setLoading] = useReducer((_s: boolean, a: { type: "loading" } | { type: "done" }) => { switch (a.type) { case "loading": return true; case "done": return false; } }, true);
  useEffect(() => { let c = false; setLoading({ type: "loading" }); academicGradeService.list({ page: 1, pageSize: 100 }).then((grades) => { if (!c) { dispatch({ type: "success", options: grades.map((g) => ({ label: g.name, value: String(g.id) })) }); setLoading({ type: "done" }); } }).catch(() => { if (!c) { dispatch({ type: "error" }); setLoading({ type: "done" }); } }); return () => { c = true; }; }, []);
  return { academicGradeOptions: options, loading };
};

export const useSchoolYearOptions = () => {
  const [options, dispatch] = useReducer((_s: { label: string; value: string }[], a: { type: "success"; options: { label: string; value: string }[] } | { type: "error" }) => { switch (a.type) { case "success": return a.options; case "error": return []; } }, []);
  const [loading, setLoading] = useReducer((_s: boolean, a: { type: "loading" } | { type: "done" }) => { switch (a.type) { case "loading": return true; case "done": return false; } }, true);
  useEffect(() => { let c = false; setLoading({ type: "loading" }); schoolYearService.list({ page: 1, pageSize: 100 }).then((years) => { if (!c) { dispatch({ type: "success", options: years.map((y) => ({ label: y.name, value: String(y.id) })) }); setLoading({ type: "done" }); } }).catch(() => { if (!c) { dispatch({ type: "error" }); setLoading({ type: "done" }); } }); return () => { c = true; }; }, []);
  return { schoolYearOptions: options, loading, loadingSchoolYears: loading };
};
