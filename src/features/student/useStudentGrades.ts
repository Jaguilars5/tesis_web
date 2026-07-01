import { useCallback, useEffect, useMemo, useReducer, useState } from "react";

import { useStudentData } from "./useStudentData";
import { studentApiService } from "./student.service";
import { useStudentGradeOptions } from "./useStudentGradeOptions";

export interface GradeActivityRow {
  id: number;
  title: string;
  subjectName: string;
  subjectOfferingId: number | null;
  activityTypeName: string;
  activityTypeId: number | null;
  academicPeriodId: number | null;
  maxScore: number;
  score: number | null;
}

interface GradesState {
  rows: GradeActivityRow[];
  loading: boolean;
  error: string | null;
}

type GradesAction =
  | { type: "loading" }
  | { type: "success"; rows: GradeActivityRow[] }
  | { type: "error"; error: string };

function gradesReducer(_s: GradesState, a: GradesAction): GradesState {
  switch (a.type) {
    case "loading":
      return { rows: [], loading: true, error: null };
    case "success":
      return { rows: a.rows, loading: false, error: null };
    case "error":
      return { rows: [], loading: false, error: a.error };
  }
}

export const useStudentGrades = (studentId?: number | null) => {
  const { enrollments, loading: loadingStudent } = useStudentData(studentId);
  const sectionId = enrollments[0]?.section ?? null;

  const { periodOptions, activityTypeOptions, subjectOptions } =
    useStudentGradeOptions(sectionId);

  const [selectedPeriodId, setSelectedPeriodId] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedActivityType, setSelectedActivityType] = useState<string>("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [state, dispatch] = useReducer(gradesReducer, {
    rows: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (enrollments.length === 0) {
      dispatch({ type: "success", rows: [] });
      return;
    }
    const enrollmentId = enrollments[0].id;
    let cancelled = false;
    dispatch({ type: "loading" });

    studentApiService
      .getStudentNotes(enrollmentId)
      .then((notes) => {
        if (cancelled) return;
        const rows: GradeActivityRow[] = notes.map((n) => ({
          id: n.evaluative_activity,
          title: n.evaluative_activity_title,
          subjectName: n.subject_offering_name ?? "—",
          subjectOfferingId: n.subject_offering ?? null,
          activityTypeName: n.activity_type_name ?? "—",
          activityTypeId: n.activity_type ?? null,
          academicPeriodId: n.academic_period ?? null,
          maxScore: n.max_score !== null ? Number(n.max_score) : 0,
          score: n.numeric_score !== null ? Number(n.numeric_score) : null,
        }));
        dispatch({ type: "success", rows });
      })
      .catch(() => {
        if (!cancelled)
          dispatch({ type: "error", error: "Error al cargar calificaciones" });
      });

    return () => {
      cancelled = true;
    };
  }, [enrollments]);

  const filteredRows = useMemo(() => {
    return state.rows.filter((r) => {
      if (selectedPeriodId && r.academicPeriodId !== selectedPeriodId) return false;
      if (selectedSubject && String(r.subjectOfferingId) !== selectedSubject) return false;
      if (selectedActivityType && String(r.activityTypeId) !== selectedActivityType)
        return false;
      return true;
    });
  }, [state.rows, selectedPeriodId, selectedSubject, selectedActivityType]);

  const totalActivities = filteredRows.length;
  const totalPages = useMemo(
    () => Math.ceil(totalActivities / pageSize) || 1,
    [totalActivities],
  );

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  const handlePeriodChange = useCallback((id: number | null) => {
    setSelectedPeriodId(id);
    setPage(1);
  }, []);

  const handleSubjectChange = useCallback((s: string) => {
    setSelectedSubject(s);
    setPage(1);
  }, []);

  const handleActivityTypeChange = useCallback((t: string) => {
    setSelectedActivityType(t);
    setPage(1);
  }, []);

  return {
    periodOptions,
    selectedPeriodId,
    setSelectedPeriodId: handlePeriodChange,
    subjectOptions,
    selectedSubject,
    setSelectedSubject: handleSubjectChange,
    activityTypeOptions,
    selectedActivityType,
    setSelectedActivityType: handleActivityTypeChange,
    activities: paginatedRows,
    page,
    pageSize,
    totalPages,
    totalActivities,
    onPageChange: setPage,
    loading: state.loading || loadingStudent,
    error: state.error,
  };
};
