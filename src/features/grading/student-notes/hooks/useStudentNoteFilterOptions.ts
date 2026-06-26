import { useEffect, useReducer } from "react";

import { UserRoleEnum } from "@features/auth";
import { selectAuthUser } from "@features/auth/auth.slice";
import { teacherSubjectSectionService } from "@features/academic/teacher-subject-section/teacher-subject-section.service";
import { evaluativeActivityService } from "@features/grading/evaluative-activities/evaluative-activities.service";
import { useAppSelector } from "@shared/redux/hooks";

import type { TeacherSubjectSectionListParamsT } from "@features/academic/teacher-subject-section/teacher-subject-section.types";

interface Option {
  label: string;
  value: string;
}

interface State {
  courseOptions: Option[];
  loadingCourses: boolean;
  activityOptions: Option[];
  loadingActivities: boolean;
}

type Action =
  | { type: "coursesLoading" }
  | { type: "coursesSuccess"; courses: Option[] }
  | { type: "coursesError" }
  | { type: "activitiesReset" }
  | { type: "activitiesLoading" }
  | { type: "activitiesSuccess"; activities: Option[] }
  | { type: "activitiesError" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "coursesLoading":
      return { ...state, loadingCourses: true };
    case "coursesSuccess":
      return { ...state, loadingCourses: false, courseOptions: action.courses };
    case "coursesError":
      return { ...state, loadingCourses: false, courseOptions: [] };
    case "activitiesReset":
      return { ...state, loadingActivities: false, activityOptions: [] };
    case "activitiesLoading":
      return { ...state, loadingActivities: true };
    case "activitiesSuccess":
      return { ...state, loadingActivities: false, activityOptions: action.activities };
    case "activitiesError":
      return { ...state, loadingActivities: false, activityOptions: [] };
  }
}

export const useStudentNoteFilterOptions = (courseId: number | 0) => {
  const user = useAppSelector(selectAuthUser);
  const [state, dispatch] = useReducer(reducer, {
    courseOptions: [],
    loadingCourses: true,
    activityOptions: [],
    loadingActivities: false,
  });

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "coursesLoading" });
    const params: TeacherSubjectSectionListParamsT = { page: 1, pageSize: 100 };
    if (user?.role === UserRoleEnum.TEACHER) {
      params.filters = { user: user.id, is_active: true };
    }
    teacherSubjectSectionService
      .list(params)
      .then((items) => {
        if (cancelled) return;
        // El backend puede ignorar el filtro, por eso reforzamos en el cliente.
        const visible =
          user?.role === UserRoleEnum.TEACHER
            ? items.filter((i) => i.user === user.id)
            : items;
        dispatch({
          type: "coursesSuccess",
          courses: visible.map((i) => ({
            label: `${i.subject_offering_name}${i.subject_offering_section_name ? ` - ${i.subject_offering_section_name}` : ""}`,
            value: String(i.id),
          })),
        });
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: "coursesError" });
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (!courseId) {
      dispatch({ type: "activitiesReset" });
      return;
    }
    let cancelled = false;
    dispatch({ type: "activitiesLoading" });
    evaluativeActivityService
      .list({ page: 1, pageSize: 100, filters: { teacher_subject_section: courseId } })
      .then((items) => {
        if (cancelled) return;
        dispatch({
          type: "activitiesSuccess",
          activities: items.map((a) => ({ label: a.title, value: String(a.id) })),
        });
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: "activitiesError" });
      });
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  return {
    courseOptions: state.courseOptions,
    loadingCourses: state.loadingCourses,
    activityOptions: state.activityOptions,
    loadingActivities: state.loadingActivities,
  };
};
