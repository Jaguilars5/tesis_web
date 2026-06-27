import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { UserRoleEnum } from "@features/auth";
import { selectAuthUser } from "@features/auth/auth.slice";
import { teacherSubjectSectionService } from "@features/academic/teacher-subject-section";
import { useAppSelector } from "@shared/redux/hooks";

import { evaluativeActivityService } from "../../evaluative-activities/evaluative-activities.service";
import { gradebookService } from "../gradebook.service";

import type { TeacherSubjectSectionListParamsT } from "@features/academic/teacher-subject-section/teacher-subject-section.types";
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
  evaluativeActivityId: null,
  roster: [],
  maxScore: null,
  loadingRoster: false,
  saving: false,
  loaded: false,
  error: null,
  success: false,
};

export const useGradebook = () => {
  const user = useAppSelector(selectAuthUser);
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<GradebookStateT>(initialState);

  const [sectionOptions, setSectionOptions] = useState<OptionT[]>([]);
  const [loadingSections, setLoadingSections] = useState(true);

  const [activityOptions, setActivityOptions] = useState<OptionT[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  const didInitFromParams = useRef(false);
  const autoLoadPending = useRef(false);

  useEffect(() => {
    let cancelled = false;
    setLoadingSections(true);
    const params: TeacherSubjectSectionListParamsT = {
      page: 1,
      pageSize: 100,
    };
    if (user?.role === UserRoleEnum.TEACHER) {
      params.filters = { user: user.id, is_active: true };
    }
    teacherSubjectSectionService
      .list(params)
      .then(({ items }) => {
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
      loaded: false,
      success: false,
    }));
    setActivityOptions([]);
    setLoadingActivities(!!id);
  }, []);

  useEffect(() => {
    const id = state.teacherSubjectSectionId;
    if (!id) return;
    let cancelled = false;
    evaluativeActivityService
      .list({
        page: 1,
        pageSize: 100,
        filters: { teacher_subject_section: id },
      })
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
      const response = await gradebookService.getRoster({
        evaluativeActivityId,
        teacherSubjectSectionId,
      });

      const maxScore = response.evaluative_activity.max_score
        ? Number(response.evaluative_activity.max_score)
        : null;

      const roster: GradeRosterEntryT[] = response.students.map((s) => ({
        enrollmentId: s.enrollment_id,
        studentName: s.student_name,
        noteId: s.note?.id ?? null,
        numericScore: s.note?.numeric_score ?? null,
        teacherObservation: s.note?.teacher_observation ?? "",
      }));

      setState((prev) => ({
        ...prev,
        roster,
        maxScore,
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
    const { evaluativeActivityId, teacherSubjectSectionId, roster } = state;
    if (!evaluativeActivityId || !teacherSubjectSectionId) return;

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
        error: "Ingrese al menos una calificaci\u00f3n antes de guardar.",
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
      await gradebookService.saveGrades({
        evaluative_activity_id: evaluativeActivityId,
        teacher_subject_section_id: teacherSubjectSectionId,
        records,
      });

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
    loadRoster,
  ]);

  const gradedCount = state.roster.filter(
    (e) => e.numericScore !== null,
  ).length;
  const canLoad = !!(
    state.teacherSubjectSectionId && state.evaluativeActivityId
  );
  const canSave = state.loaded && !state.saving;

  return {
    ...state,
    sectionOptions,
    activityOptions,
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
