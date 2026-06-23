import { useCallback, useEffect, useState } from "react";

import { UserRoleEnum } from "@features/auth";
import { selectAuthUser } from "@features/auth/auth.slice";
import { teacherSubjectSectionService } from "@features/academic/teacher-subject-section";
import { enrollmentService } from "@features/students/enrollments/enrollments.service";
import { useAppSelector } from "@shared/redux/hooks";

import { evaluativeActivityService } from "../evaluative-activities/evaluative-activities.service";
import { studentNoteService } from "../student-notes/student-notes.service";

import type { TeacherSubjectSectionListParamsT } from "@features/academic/teacher-subject-section/teacher-subject-section.types";
import type { GradebookStateT, GradeRosterEntryT } from "./gradebook.types";

interface OptionT {
  label: string;
  value: string;
}

const initialState: GradebookStateT = {
  teacherSubjectSectionId: null,
  evaluativeActivityId: null,
  roster: [],
  loadingRoster: false,
  saving: false,
  loaded: false,
  error: null,
  success: false,
};

export const useGradebook = () => {
  const user = useAppSelector(selectAuthUser);
  const [state, setState] = useState<GradebookStateT>(initialState);

  const [sectionOptions, setSectionOptions] = useState<OptionT[]>([]);
  const [loadingSections, setLoadingSections] = useState(true);

  const [activityOptions, setActivityOptions] = useState<OptionT[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [maxScore, setMaxScore] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoadingSections(true);
    const params: TeacherSubjectSectionListParamsT = { page: 1, pageSize: 100 };
    if (user?.role === UserRoleEnum.TEACHER) {
      params.filters = { user: user.id, is_active: true };
    }
    teacherSubjectSectionService
      .list(params)
      .then((items) => {
        if (cancelled) return;
        setSectionOptions(
          items.map((i) => ({
            label: `${i.subject_offering_name} - ${i.subject_offering_section_name ?? ""}`,
            value: String(i.id),
          })),
        );
      })
      .catch(() => {
        if (!cancelled) setSectionOptions([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingSections(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const setTeacherSubjectSectionId = useCallback((id: number | null) => {
    setState((prev) => ({
      ...prev,
      teacherSubjectSectionId: id,
      evaluativeActivityId: null,
      roster: [],
      loaded: false,
      success: false,
    }));
    setActivityOptions([]);
    setMaxScore(null);
    setLoadingActivities(!!id);
  }, []);

  useEffect(() => {
    const id = state.teacherSubjectSectionId;
    if (!id) return;
    let cancelled = false;
    evaluativeActivityService
      .list({ page: 1, pageSize: 100, filters: { teacher_subject_section: id } })
      .then((items) => {
        if (cancelled) return;
        setActivityOptions(
          items.map((a) => ({ label: a.title, value: String(a.id) })),
        );
      })
      .catch(() => {
        if (!cancelled) setActivityOptions([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingActivities(false);
      });
    return () => {
      cancelled = true;
    };
  }, [state.teacherSubjectSectionId]);

  const setEvaluativeActivityId = useCallback((id: number | null) => {
    setState((prev) => ({
      ...prev,
      evaluativeActivityId: id,
      roster: [],
      loaded: false,
      success: false,
    }));
  }, []);

  const updateScore = useCallback(
    (enrollmentId: number, numericScore: number | null) => {
      setState((prev) => ({
        ...prev,
        roster: prev.roster.map((e) =>
          e.enrollmentId === enrollmentId ? { ...e, numericScore } : e,
        ),
      }));
    },
    [],
  );

  const updateObservation = useCallback(
    (enrollmentId: number, teacherObservation: string) => {
      setState((prev) => ({
        ...prev,
        roster: prev.roster.map((e) =>
          e.enrollmentId === enrollmentId ? { ...e, teacherObservation } : e,
        ),
      }));
    },
    [],
  );

  const loadRoster = useCallback(async () => {
    const { teacherSubjectSectionId, evaluativeActivityId } = state;
    if (!teacherSubjectSectionId || !evaluativeActivityId) return;

    setState((prev) => ({
      ...prev,
      loadingRoster: true,
      error: null,
      loaded: false,
      success: false,
    }));

    try {
      const [tss, activity] = await Promise.all([
        teacherSubjectSectionService.get(teacherSubjectSectionId),
        evaluativeActivityService.get(evaluativeActivityId),
      ]);
      const sectionId = tss.subject_offering_section;
      if (!sectionId) throw new Error("La clase no tiene una sección asignada");
      setMaxScore(activity.max_score ? Number(activity.max_score) : null);

      const [enrollments, notes] = await Promise.all([
        enrollmentService.listBySection({ section_id: sectionId, status: "ACT" }),
        studentNoteService.list({
          page: 1,
          pageSize: 100,
          filters: { evaluative_activity: evaluativeActivityId },
        }),
      ]);

      const notesMap = new Map(notes.map((n) => [n.enrollment, n]));
      const roster: GradeRosterEntryT[] = enrollments.map((e) => {
        const note = notesMap.get(e.id);
        return {
          enrollmentId: e.id,
          studentName: e.student_name,
          noteId: note?.id ?? null,
          numericScore: note?.numeric_score ?? null,
          teacherObservation: note?.teacher_observation ?? "",
        };
      });

      setState((prev) => ({ ...prev, roster, loadingRoster: false, loaded: true }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loadingRoster: false,
        error: err instanceof Error ? err.message : "Error al cargar estudiantes",
      }));
    }
  }, [state.teacherSubjectSectionId, state.evaluativeActivityId]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveGrades = useCallback(async () => {
    const { evaluativeActivityId, roster } = state;
    if (!evaluativeActivityId) return;

    setState((prev) => ({ ...prev, saving: true, error: null, success: false }));

    try {
      const operations = roster
        .filter((e) => e.noteId !== null || e.numericScore !== null)
        .map((e) => {
          if (e.noteId !== null) {
            return studentNoteService.update({
              id: e.noteId,
              data: {
                numeric_score: e.numericScore,
                teacher_observation: e.teacherObservation,
              },
            });
          }
          return studentNoteService.create({
            enrollment: e.enrollmentId,
            evaluative_activity: evaluativeActivityId,
            grading_mode: "NUMERIC",
            numeric_score: e.numericScore,
            qualitative_scale: null,
            teacher_observation: e.teacherObservation,
            created_by: null,
            modified_by: null,
          });
        });

      await Promise.all(operations);
      setState((prev) => ({ ...prev, saving: false, success: true }));
      await loadRoster();
    } catch (err) {
      setState((prev) => ({
        ...prev,
        saving: false,
        error: err instanceof Error ? err.message : "Error al guardar calificaciones",
        success: false,
      }));
    }
  }, [state.evaluativeActivityId, state.roster, loadRoster]); // eslint-disable-line react-hooks/exhaustive-deps

  const gradedCount = state.roster.filter((e) => e.numericScore !== null).length;
  const canLoad = !!(state.teacherSubjectSectionId && state.evaluativeActivityId);
  const canSave = state.loaded && !state.saving;

  return {
    ...state,
    sectionOptions,
    activityOptions,
    maxScore,
    gradedCount,
    isLoading: loadingSections,
    loadingActivities,
    canLoad,
    canSave,
    setTeacherSubjectSectionId,
    setEvaluativeActivityId,
    updateScore,
    updateObservation,
    loadRoster,
    saveGrades,
  };
};
