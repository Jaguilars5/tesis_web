import { useEffect, useReducer } from "react";
import { useStudentData } from "./useStudentData";
import { studentApiService } from "./student.service";
import type { BehaviorEvaluationRaw, ConductIncidentRaw } from "./student.types";

interface State {
  evaluations: BehaviorEvaluationRaw[];
  incidents: ConductIncidentRaw[];
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: "loading" }
  | {
      type: "success";
      evaluations: BehaviorEvaluationRaw[];
      incidents: ConductIncidentRaw[];
    }
  | { type: "error"; error: string };

function reducer(_s: State, a: Action): State {
  switch (a.type) {
    case "loading":
      return { evaluations: [], incidents: [], loading: true, error: null };
    case "success":
      return {
        evaluations: a.evaluations,
        incidents: a.incidents,
        loading: false,
        error: null,
      };
    case "error":
      return {
        evaluations: [],
        incidents: [],
        loading: false,
        error: a.error,
      };
  }
}

export const useStudentConduct = (studentId?: number | null) => {
  const { enrollments, loading: loadingStudent } = useStudentData(studentId);
  const [state, dispatch] = useReducer(reducer, {
    evaluations: [],
    incidents: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (enrollments.length === 0) return;
    let c = false;
    dispatch({ type: "loading" });

    Promise.all([
      studentApiService.getBehaviorEvaluations(enrollments[0].id),
      studentApiService.getIncidents(enrollments[0].id),
    ])
      .then(([evaluations, incidents]) => {
        if (!c) dispatch({ type: "success", evaluations, incidents });
      })
      .catch(() => {
        if (!c) dispatch({ type: "error", error: "Error al cargar datos de conducta" });
      });

    return () => {
      c = true;
    };
  }, [enrollments]);

  return {
    ...state,
    loading: state.loading || loadingStudent,
  };
};
