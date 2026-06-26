import { useEffect, useReducer } from "react";
import { teacherSubjectSectionService } from "@features/academic/teacher-subject-section/teacher-subject-section.service";
import type { TeacherSubjectSectionListParamsT } from "@features/academic/teacher-subject-section";
import { activityTypeService } from "@features/grading/activity-types/activity-types.service";
import { useAcademicPeriodOptions } from "@shared/hooks/useAcademicPeriodOptions";
import { useAppSelector } from "@shared/redux/hooks";
import { selectAuthUser } from "@features/auth/auth.slice";
import { UserRoleEnum } from "@features/auth";

interface Option { label: string; value: string; }
interface State { teacherSubjectSectionOptions: Option[]; activityTypeOptions: Option[]; loading: boolean; }
type Action = { type: "loading" } | { type: "success"; teacherSubjectSections: Option[]; activityTypes: Option[] } | { type: "error" };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "loading": return { ...s, loading: true };
    case "success": return { ...s, loading: false, teacherSubjectSectionOptions: a.teacherSubjectSections, activityTypeOptions: a.activityTypes };
    case "error": return { ...s, loading: false };
  }
}

export const useEvaluativeActivityOptions = () => {
  const [state, dispatch] = useReducer(reducer, { teacherSubjectSectionOptions: [], activityTypeOptions: [], loading: true });
  const { academicPeriodOptions } = useAcademicPeriodOptions();
  const user = useAppSelector(selectAuthUser);

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "loading" });
    const tssParams: TeacherSubjectSectionListParamsT = { page: 1, pageSize: 100 };
    if (user?.role === UserRoleEnum.TEACHER) {
      tssParams.filters = { user: user.id, is_active: true };
    }
    Promise.all([
      teacherSubjectSectionService.list(tssParams),
      activityTypeService.list({ page: 1, pageSize: 100 }),
    ]).then(([tss, at]) => {
      if (cancelled) return;
      // El backend puede ignorar el filtro, por eso reforzamos en el cliente.
      const visibleTss =
        user?.role === UserRoleEnum.TEACHER
          ? tss.filter((i) => i.user === user.id)
          : tss;
      dispatch({
        type: "success",
        teacherSubjectSections: visibleTss.map((i) => ({ label: i.subject_offering_name, value: String(i.id) })),
        activityTypes: at.filter((i) => i.is_active).map((i) => ({ label: i.name, value: String(i.id) })),
      });
    }).catch(() => { if (!cancelled) dispatch({ type: "error" }); });
    return () => { cancelled = true; };
  }, [user]);

  return {
    teacherSubjectSectionOptions: state.teacherSubjectSectionOptions,
    activityTypeOptions: state.activityTypeOptions,
    academicPeriodOptions,
    loading: state.loading,
  };
};
