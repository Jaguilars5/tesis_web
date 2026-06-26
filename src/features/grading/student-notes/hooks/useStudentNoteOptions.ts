import { enrollmentService } from "@features/students/enrollments/enrollments.service";
import { evaluativeActivityService } from "@features/grading/evaluative-activities/evaluative-activities.service";
import { qualitativeScaleService } from "@features/grading/qualitative-scales/qualitative-scales.service";
import { useEffect, useReducer } from "react";

interface Option {
  label: string;
  value: string;
}

interface State {
  enrollmentOptions: Option[];
  evaluativeActivityOptions: Option[];
  qualitativeScaleOptions: Option[];
  loading: boolean;
}

type Action =
  | { type: "loading" }
  | {
      type: "success";
      enrollments: Option[];
      evaluativeActivities: Option[];
      qualitativeScales: Option[];
    }
  | { type: "error" };

function optionsReducer(state: State, action: Action): State {
  switch (action.type) {
    case "loading":
      return { ...state, loading: true };
    case "success":
      return {
        ...state,
        loading: false,
        enrollmentOptions: action.enrollments,
        evaluativeActivityOptions: action.evaluativeActivities,
        qualitativeScaleOptions: action.qualitativeScales,
      };
    case "error":
      return { ...state, loading: false };
  }
}

const GRADING_MODES: Option[] = [
  { label: "Numérica", value: "NUMERIC" },
  { label: "Cualitativa", value: "QUALITATIVE" },
  { label: "Mixta", value: "MIXED" },
];

export const useStudentNoteOptions = () => {
  const [state, dispatch] = useReducer(optionsReducer, {
    enrollmentOptions: [],
    evaluativeActivityOptions: [],
    qualitativeScaleOptions: [],
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "loading" });

    Promise.all([
      enrollmentService.list({ page: 1, pageSize: 100 }),
      evaluativeActivityService.list({ page: 1, pageSize: 100 }),
      qualitativeScaleService.list({ page: 1, pageSize: 100 }),
    ])
      .then(([enrollments, evaluativeActivities, qualitativeScales]) => {
        if (cancelled) return;
        dispatch({
          type: "success",
          enrollments: enrollments.map((item) => ({
            label: item.student_name,
            value: String(item.id),
          })),
          evaluativeActivities: evaluativeActivities.map((item) => ({
            label: item.title,
            value: String(item.id),
          })),
          qualitativeScales: qualitativeScales
            .filter((item) => item.is_active)
            .map((item) => ({ label: item.name, value: String(item.id) })),
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
    enrollmentOptions: state.enrollmentOptions,
    evaluativeActivityOptions: state.evaluativeActivityOptions,
    qualitativeScaleOptions: state.qualitativeScaleOptions,
    gradeTypeOptions: GRADING_MODES,
    loading: state.loading,
  };
};
