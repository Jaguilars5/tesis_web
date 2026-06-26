import { useEffect, useReducer } from "react";
import { useAppSelector } from "@shared/redux/hooks";
import { selectAuthUser } from "@features/auth/auth.slice";
import { UserRoleEnum } from "@features/auth";
import type { TeacherSubjectSectionListParamsT } from "@features/academic/teacher-subject-section";
import { teacherSubjectSectionService } from "@features/academic/teacher-subject-section";

interface Option { label: string; value: string; }
interface State { options: Option[]; loading: boolean; }
type Action = { type: "loading" } | { type: "success"; options: Option[] } | { type: "error" };

function reducer(_state: State, action: Action): State {
  switch (action.type) {
    case "loading": return { options: [], loading: true };
    case "success": return { options: action.options, loading: false };
    case "error": return { options: [], loading: false };
  }
}

export const useTeacherSubjectSectionOptions = () => {
  const [state, dispatch] = useReducer(reducer, { options: [], loading: true });
  const user = useAppSelector(selectAuthUser);
  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "loading" });
    const params: Record<string, unknown> = { page: 1, pageSize: 100 };
    if (user?.role === UserRoleEnum.TEACHER) params.filters = { user: user.id, is_active: true };
    teacherSubjectSectionService.list(params as TeacherSubjectSectionListParamsT)
      .then((items) => {
        if (!cancelled) dispatch({ type: "success", options: items.map((i) => ({ label: `${i.subject_offering_name} - ${i.subject_offering_section_name ?? ""}`, value: String(i.id) })) });
      })
      .catch(() => { if (!cancelled) dispatch({ type: "error" }); });
    return () => { cancelled = true; };
  }, [user]);
  return { teacherSubjectSectionOptions: state.options, loading: state.loading };
};
