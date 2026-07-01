import { useEffect, useReducer } from "react";

import { activityTypeService } from "@features/grading/activity-types/activity-types.service";
import { useAcademicPeriodOptions } from "@shared/hooks/useAcademicPeriodOptions";
import { useTeacherSubjectSectionOptions } from "@shared/hooks/useTeacherSubjectSectionOptions";

interface Option {
  label: string;
  value: string;
}

interface State {
  activityTypeOptions: Option[];
  loading: boolean;
}

type Action =
  | { type: "loading" }
  | { type: "success"; activityTypes: Option[] }
  | { type: "error" };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "loading":
      return { ...s, loading: true };
    case "success":
      return {
        ...s,
        loading: false,
        activityTypeOptions: a.activityTypes,
      };
    case "error":
      return { ...s, loading: false };
  }
}

export const useEvaluativeActivityOptions = () => {
  const [state, dispatch] = useReducer(reducer, {
    activityTypeOptions: [],
    loading: true,
  });

  const { academicPeriodOptions } = useAcademicPeriodOptions();
  const { teacherSubjectSectionOptions } = useTeacherSubjectSectionOptions();

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "loading" });

    activityTypeService
      .list({ page: 1, pageSize: 100 })
      .then(({ items: atItems }) => {
        if (cancelled) return;
        dispatch({
          type: "success",
          activityTypes: atItems
            .filter((i) => i.is_active)
            .map((i) => ({ label: i.name, value: String(i.id) })),
        });
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: "error" });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    teacherSubjectSectionOptions,
    activityTypeOptions: state.activityTypeOptions,
    academicPeriodOptions,
    loading: state.loading,
  };
};
