import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { UserRoleEnum } from "@features/auth";
import { selectAuthUser } from "@features/auth/auth.slice";
import {
  findAcademicPeriodByDate,
  getTodayLocal,
} from "@features/academic/academic-period/academic-period.utils";
import { useAcademicPeriodOptions } from "@shared/hooks/useAcademicPeriodOptions";
import { useTeacherSubjectSectionOptions } from "@shared/hooks/useTeacherSubjectSectionOptions";
import { useAppSelector } from "@shared/redux/hooks";

import { evaluativeActivityService } from "../../evaluative-activities/evaluative-activities.service";
import { gradebookService } from "../gradebook.service";
import { resolveGradingContext } from "../gradebook.resolve-context";
import {
  canEditStudentScore,
  formatSaveErrors,
  getGlobalGradingLockReason,
  hasInvalidRosterScores,
  isPartialSaveResult,
  rosterHasChanges,
} from "../gradebook.utils";

import type {
  GradebookStateT,
  GradeRosterEntryT,
} from "../gradebook.types";

interface OptionT {
  label: string;
  value: string;
}

const initialState: GradebookStateT = {
  teacherSubjectSectionId: null,
  academicPeriodId: null,
  evaluativeActivityId: null,
  roster: [],
  maxScore: null,
  gradingContext: null,
  loadingRoster: false,
  saving: false,
  loaded: false,
  error: null,
  success: false,
};

export const useGradebook = () => {
  const user = useAppSelector(selectAuthUser);
  const [searchParams] = useSearchParams();
  const { academicPeriodOptions, loading: loadingPeriods } =
    useAcademicPeriodOptions();
  const [state, setState] = useState<GradebookStateT>(initialState);

  const {
    teacherSubjectSectionOptions: sectionOptions,
    loading: loadingSections,
  } = useTeacherSubjectSectionOptions();

  const [activityOptions, setActivityOptions] = useState<OptionT[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  const [extendDueDateOpen, setExtendDueDateOpen] = useState(false);
  const [extendingDueDate, setExtendingDueDate] = useState(false);
  const [extendDueDateError, setExtendDueDateError] = useState<string | null>(
    null,
  );

  const didInitFromParams = useRef(false);
  const autoLoadPending = useRef(false);

  useEffect(() => {
    if (academicPeriodOptions.length > 0 && state.academicPeriodId === null) {
      const today = getTodayLocal();
      const matched = findAcademicPeriodByDate(academicPeriodOptions, today);
      const targetId = matched
        ? Number(matched.value)
        : Number(academicPeriodOptions[0].value);
      setState((prev) => ({ ...prev, academicPeriodId: targetId }));
    }
  }, [academicPeriodOptions, state.academicPeriodId]);

  useEffect(() => {
    if (didInitFromParams.current) return;
    const tss = Number(searchParams.get("tss"));
    const activity = Number(searchParams.get("activity"));
    if (!tss || !activity) return;
    if (user?.role === UserRoleEnum.TEACHER) {
      if (loadingSections) return;
      const isOwnSection = sectionOptions.some((o) => Number(o.value) === tss);
      if (!isOwnSection) {
        didInitFromParams.current = true;
        setState((prev) => ({
          ...prev,
          error: "No tiene acceso a esta clase.",
        }));
        return;
      }
    }
    didInitFromParams.current = true;
    autoLoadPending.current = true;
    setState((prev) => ({
      ...prev,
      teacherSubjectSectionId: tss,
      evaluativeActivityId: activity,
    }));
    setLoadingActivities(true);
  }, [searchParams, user, loadingSections, sectionOptions]);

  const setTeacherSubjectSectionId = useCallback((id: number | null) => {
    setState((prev) => ({
      ...prev,
      teacherSubjectSectionId: id,
      evaluativeActivityId: null,
      roster: [],
      gradingContext: null,
      loaded: false,
      success: false,
    }));
    setActivityOptions([]);
  }, []);

  const setAcademicPeriodId = useCallback((id: number | null) => {
    setState((prev) => ({
      ...prev,
      academicPeriodId: id,
      evaluativeActivityId: null,
      roster: [],
      gradingContext: null,
      loaded: false,
      success: false,
    }));
    setActivityOptions([]);
  }, []);

  useEffect(() => {
    const id = state.teacherSubjectSectionId;
    const periodId = state.academicPeriodId;
    if (!id || !periodId) {
      setActivityOptions([]);
      setLoadingActivities(false);
      return;
    }
    let cancelled = false;
    setLoadingActivities(true);
    evaluativeActivityService
      .list({
        page: 1,
        pageSize: 100,
        filters: {
          teacher_subject_section: id,
          academic_period: periodId,
        },
      })
      .then((items) => {
        if (cancelled) return;
        const safeItems = Array.isArray(items) ? items : [];
        setActivityOptions(
          safeItems
            .filter((a) => a?.id != null)
            .map((a) => ({
              label: a.due_date
                ? `${a.title} (entrega: ${a.due_date})`
                : a.title,
              value: String(a.id),
            })),
        );
      })
      .catch((err) => {
        if (!cancelled) {
          setActivityOptions([]);
          setState((prev) => ({
            ...prev,
            error:
              err instanceof Error
                ? err.message
                : "Error al cargar actividades evaluativas",
          }));
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingActivities(false);
      });
    return () => {
      cancelled = true;
    };
  }, [state.teacherSubjectSectionId, state.academicPeriodId]);

  const setEvaluativeActivityId = useCallback((id: number | null) => {
    setState((prev) => ({
      ...prev,
      evaluativeActivityId: id,
      roster: [],
      gradingContext: null,
      loaded: false,
      success: false,
    }));
  }, []);

  const updateScore = useCallback(
    (enrollmentId: number, numericScore: number | null) => {
      setState((prev) => {
        const entry = prev.roster.find((e) => e.enrollmentId === enrollmentId);
        if (
          entry &&
          !canEditStudentScore(entry, prev.gradingContext).allowed &&
          entry.originalNumericScore !== null
        ) {
          return prev;
        }
        return {
          ...prev,
          roster: prev.roster.map((e) =>
            e.enrollmentId === enrollmentId ? { ...e, numericScore } : e,
          ),
        };
      });
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
      const response = await gradebookService.getRoster({
        evaluativeActivityId,
        teacherSubjectSectionId,
      });

      const maxScore = response.evaluative_activity?.max_score
        ? Number(response.evaluative_activity.max_score)
        : null;

      const gradingContext = await resolveGradingContext(
        evaluativeActivityId,
        response.evaluative_activity,
        response.academic_period,
      );

      const roster: GradeRosterEntryT[] = (response.students ?? []).map((s) => {
        const score = s.note?.numeric_score ?? null;
        const observation = s.note?.teacher_observation ?? "";
        return {
          enrollmentId: s.enrollment_id,
          studentName: s.student_name,
          noteId: s.note?.id ?? null,
          numericScore: score,
          originalNumericScore: score,
          teacherObservation: observation,
          originalTeacherObservation: observation,
        };
      });

      setState((prev) => ({
        ...prev,
        roster,
        maxScore,
        gradingContext,
        loadingRoster: false,
        loaded: true,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loadingRoster: false,
        error:
          err instanceof Error ? err.message : "Error al cargar estudiantes",
      }));
    }
  }, [state.teacherSubjectSectionId, state.evaluativeActivityId]);

  useEffect(() => {
    if (
      autoLoadPending.current &&
      state.teacherSubjectSectionId &&
      state.evaluativeActivityId
    ) {
      autoLoadPending.current = false;
      loadRoster();
    }
  }, [state.teacherSubjectSectionId, state.evaluativeActivityId, loadRoster]);

  const saveGrades = useCallback(async () => {
    const { evaluativeActivityId, teacherSubjectSectionId, roster, gradingContext } =
      state;
    if (!evaluativeActivityId || !teacherSubjectSectionId) return;

    if (getGlobalGradingLockReason(gradingContext)) {
      setState((prev) => ({
        ...prev,
        error:
          "No se pueden guardar calificaciones: el período no está habilitado.",
      }));
      return;
    }

    const blockedChanges = roster.filter((entry) => {
      const scoreChanged =
        entry.numericScore !== entry.originalNumericScore &&
        !(entry.numericScore === null && entry.originalNumericScore === null);
      return scoreChanged && !canEditStudentScore(entry, gradingContext).allowed;
    });
    if (blockedChanges.length > 0) {
      setState((prev) => ({
        ...prev,
        error:
          "Hay cambios de nota bloqueados por la fecha de entrega. Extienda el plazo o revierta esos valores.",
      }));
      return;
    }

    const records = roster
      .filter((e) => e.numericScore !== null || e.teacherObservation)
      .map((e) => ({
        enrollment: e.enrollmentId,
        numeric_score: e.numericScore,
        teacher_observation: e.teacherObservation,
      }));

    if (records.length === 0) {
      setState((prev) => ({
        ...prev,
        error: "Ingrese al menos una calificación antes de guardar.",
      }));
      return;
    }

    if (hasInvalidRosterScores(roster, state.maxScore)) {
      setState((prev) => ({
        ...prev,
        error:
          "Hay notas fuera del rango permitido. Revise los valores ingresados.",
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      saving: true,
      error: null,
      success: false,
    }));

    try {
      const result = await gradebookService.saveGrades({
        evaluative_activity_id: evaluativeActivityId,
        teacher_subject_section_id: teacherSubjectSectionId,
        records,
      });

      if (isPartialSaveResult(result) && result.errors?.length) {
        const detail = formatSaveErrors(result);
        setState((prev) => ({
          ...prev,
          saving: false,
          error: detail || "Algunos registros no pudieron guardarse.",
          success: Boolean(result.created?.length),
        }));
        if (result.created?.length) {
          await loadRoster();
        }
        return;
      }

      setState((prev) => ({
        ...prev,
        saving: false,
        success: true,
      }));

      await loadRoster();
    } catch (err) {
      setState((prev) => ({
        ...prev,
        saving: false,
        error:
          err instanceof Error
            ? err.message
            : "Error al guardar calificaciones",
        success: false,
      }));
    }
  }, [
    state.evaluativeActivityId,
    state.teacherSubjectSectionId,
    state.roster,
    state.maxScore,
    state.gradingContext,
    loadRoster,
  ]);

  const extendDueDate = useCallback(
    async (dueDate: string, reason: string) => {
      const { gradingContext } = state;
      if (!gradingContext) return;

      setExtendingDueDate(true);
      setExtendDueDateError(null);

      try {
        await evaluativeActivityService.update({
          id: gradingContext.activityId,
          data: {
            due_date: dueDate,
            due_date_change_reason: reason,
          },
        });
        setExtendDueDateOpen(false);
        await loadRoster();
      } catch (err) {
        setExtendDueDateError(
          err instanceof Error
            ? err.message
            : "No se pudo actualizar la fecha de entrega",
        );
      } finally {
        setExtendingDueDate(false);
      }
    },
    [state.gradingContext, loadRoster],
  );

  const gradedCount = state.roster.filter(
    (e) => e.numericScore !== null,
  ).length;
  const canLoad = !!(
    state.teacherSubjectSectionId && state.evaluativeActivityId
  );
  const periodBlocked = !!getGlobalGradingLockReason(state.gradingContext);
  const hasChanges = rosterHasChanges(state.roster);
  const canSave =
    state.loaded &&
    !state.saving &&
    !periodBlocked &&
    !hasInvalidRosterScores(state.roster, state.maxScore) &&
    hasChanges;

  return {
    ...state,
    sectionOptions,
    periodOptions: academicPeriodOptions.map((p) => ({
      label: p.label,
      value: p.value,
    })),
    activityOptions,
    gradedCount,
    isLoading: loadingSections,
    loadingPeriods,
    loadingActivities,
    canLoad,
    canSave,
    extendDueDateOpen,
    extendingDueDate,
    extendDueDateError,
    setTeacherSubjectSectionId,
    setAcademicPeriodId,
    setEvaluativeActivityId,
    updateScore,
    updateObservation,
    loadRoster,
    saveGrades,
    openExtendDueDate: () => {
      setExtendDueDateError(null);
      setExtendDueDateOpen(true);
    },
    closeExtendDueDate: () => setExtendDueDateOpen(false),
    extendDueDate,
  };
};
