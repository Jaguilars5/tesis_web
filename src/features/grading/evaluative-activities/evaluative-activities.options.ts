import { teacherSubjectSectionService } from "@features/academic/teacher-subject-section/teacher-subject-section.service"; import { activityTypeService } from "@features/grading/activity-types/activity-types.service"; import { useEffect, useReducer } from "react";
interface Option { label: string; value: string; }
interface State { teacherSubjectSectionOptions: Option[]; activityTypeOptions: Option[]; loading: boolean; }
type Action = { type: "loading" } | { type: "success"; teacherSubjectSections: Option[]; activityTypes: Option[] } | { type: "error" };
function reducer(s: State, a: Action): State { switch (a.type) { case "loading": return { ...s, loading: true }; case "success": return { ...s, loading: false, teacherSubjectSectionOptions: a.teacherSubjectSections, activityTypeOptions: a.activityTypes }; case "error": return { ...s, loading: false }; } }
export const useEvaluativeActivityOptions = () => {
  const [state, dispatch] = useReducer(reducer, { teacherSubjectSectionOptions: [], activityTypeOptions: [], loading: true });
  useEffect(() => { let cancelled = false; dispatch({ type: "loading" }); Promise.all([teacherSubjectSectionService.list({ page: 1, pageSize: 100 }), activityTypeService.list({ page: 1, pageSize: 100 })]).then(([tss, at]) => { if (cancelled) return; dispatch({ type: "success", teacherSubjectSections: tss.map((i) => ({ label: i.subject_offering_name, value: String(i.id) })), activityTypes: at.filter((i) => i.is_active).map((i) => ({ label: i.name, value: String(i.id) })) }); }).catch(() => { if (!cancelled) dispatch({ type: "error" }); }); return () => { cancelled = true; }; }, []);
  return { teacherSubjectSectionOptions: state.teacherSubjectSectionOptions, activityTypeOptions: state.activityTypeOptions, loading: state.loading };
};
