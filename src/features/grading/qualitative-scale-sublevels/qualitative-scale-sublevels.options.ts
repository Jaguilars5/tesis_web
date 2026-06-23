import { qualitativeScaleService } from "@features/grading/qualitative-scales/qualitative-scales.service"; import { academicSubLevelService } from "@features/institutions/academic-sublevel/academic-sublevel.service"; import { useEffect, useReducer } from "react";
interface O { label: string; value: string; }
interface S { scaleOptions: O[]; sublevelOptions: O[]; loading: boolean; }
type A = { type: "loading" } | { type: "success"; scales: O[]; sublevels: O[] } | { type: "error" };
function r(state: S, a: A): S { switch (a.type) { case "loading": return { ...state, loading: true }; case "success": return { ...state, loading: false, scaleOptions: a.scales, sublevelOptions: a.sublevels }; case "error": return { ...state, loading: false }; } }
export const useQualitativeScaleSublevelOptions = () => {
  const [state, dispatch] = useReducer(r, { scaleOptions: [], sublevelOptions: [], loading: true });
  useEffect(() => { let c = false; dispatch({ type: "loading" }); Promise.all([qualitativeScaleService.list({ page: 1, pageSize: 100 }), academicSubLevelService.list({ page: 1, pageSize: 100 })]).then(([scales, sublevels]) => { if (c) return; dispatch({ type: "success", scales: scales.filter((i) => i.is_active).map((i) => ({ label: i.name, value: String(i.id) })), sublevels: sublevels.filter((i) => i.is_active).map((i) => ({ label: i.name, value: String(i.id) })) }); }).catch(() => { if (!c) dispatch({ type: "error" }); }); return () => { c = true; }; }, []);
  return { scaleOptions: state.scaleOptions, sublevelOptions: state.sublevelOptions, loading: state.loading };
};
