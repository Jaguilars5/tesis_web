import { enrollmentService } from "@features/students/enrollments/enrollments.service";
import { academicPeriodService } from "@features/academic/academic-period";
import { subjectOfferingService } from "@features/academic/subject-offering/subject-offering.service";
import { qualitativeScaleService } from "@features/grading/qualitative-scales/qualitative-scales.service";
import { useEffect, useReducer } from "react";

interface Option {
  label: string;
  value: string;
}

interface State {
  enrollmentOptions: Option[];
  subjectOfferingOptions: Option[];
  academicPeriodOptions: Option[];
  qualitativeScaleOptions: Option[];
  loading: boolean;
}

type Action =
  | { type: "loading" }
  | {
      type: "success";
      enrollments: Option[];
      subjectOfferings: Option[];
      academicPeriods: Option[];
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
        subjectOfferingOptions: action.subjectOfferings,
        academicPeriodOptions: action.academicPeriods,
        qualitativeScaleOptions: action.qualitativeScales,
      };
    case "error":
      return { ...state, loading: false };
  }
}

const PROMOTION_STATUSES: Option[] = [
  { label: "Aprobado", value: "approved" },
  { label: "Reprobado", value: "failed" },
];

export const usePeriodGradeSummaryOptions = () => {
  const [state, dispatch] = useReducer(optionsReducer, {
    enrollmentOptions: [],
    subjectOfferingOptions: [],
    academicPeriodOptions: [],
    qualitativeScaleOptions: [],
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "loading" });

    Promise.all([
      enrollmentService.list({ page: 1, pageSize: 100 }),
      subjectOfferingService.list({ page: 1, pageSize: 100 }),
      academicPeriodService.list({ page: 1, pageSize: 100 }),
      qualitativeScaleService.list({ page: 1, pageSize: 100 }),
    ])
      .then(([enrollments, { items: subjectOfferings }, { items: academicPeriods }, qualitativeScales]) => {
        if (cancelled) return;
        dispatch({
          type: "success",
          enrollments: enrollments.map((item) => ({
            label: item.student_name,
            value: String(item.id),
          })),
          subjectOfferings: subjectOfferings.map((item) => ({
            label: item.section_name,
            value: String(item.id),
          })),
          academicPeriods: academicPeriods.map((item) => ({
            label: item.name,
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
    subjectOfferingOptions: state.subjectOfferingOptions,
    academicPeriodOptions: state.academicPeriodOptions,
    qualitativeScaleOptions: state.qualitativeScaleOptions,
    promotionStatusOptions: PROMOTION_STATUSES,
    loading: state.loading,
  };
};
