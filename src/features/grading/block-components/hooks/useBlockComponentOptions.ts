import { useEffect, useMemo, useReducer } from "react";

import { findAcademicPeriodByDate } from "@features/academic/academic-period/academic-period.utils";
import { useCatalogOptions } from "@shared/hooks/useCatalogOptions";
import { useAcademicPeriodOptions } from "@shared/hooks/useAcademicPeriodOptions";
import { STATUS_OPTIONS } from "@shared/hooks/useStatusOptions";
import { evaluationBlockService } from "@features/grading/evaluation-blocks/evaluation-blocks.service";

import { blockComponentService } from "../block-components.service";

interface BlockComponentOption {
  label: string;
  value: string;
  internalWeight: string;
}

interface BlockComponentOptionsState {
  options: BlockComponentOption[];
  loading: boolean;
  error: string | null;
}

type BlockComponentOptionsAction =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success"; options: BlockComponentOption[] }
  | { type: "error"; error: string };

function blockComponentOptionsReducer(
  state: BlockComponentOptionsState,
  action: BlockComponentOptionsAction,
): BlockComponentOptionsState {
  switch (action.type) {
    case "idle":
      return { options: [], loading: false, error: null };
    case "loading":
      return { ...state, loading: true, error: null };
    case "success":
      return { options: action.options, loading: false, error: null };
    case "error":
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
}

export const useBlockComponentOptions = (
  teacherSubjectSectionId: number | null | undefined,
  referenceDate: string | null | undefined,
) => {
  const { academicPeriodOptions, loading: loadingPeriods } =
    useAcademicPeriodOptions();
  const [state, dispatch] = useReducer(blockComponentOptionsReducer, {
    options: [],
    loading: false,
    error: null,
  });

  const resolvedPeriod = useMemo(() => {
    if (!referenceDate) return null;
    return findAcademicPeriodByDate(academicPeriodOptions, referenceDate);
  }, [academicPeriodOptions, referenceDate]);

  const academicPeriodId = resolvedPeriod
    ? Number(resolvedPeriod.value)
    : null;

  useEffect(() => {
    if (
      !teacherSubjectSectionId ||
      teacherSubjectSectionId <= 0 ||
      loadingPeriods
    ) {
      dispatch({ type: "idle" });
      return;
    }

    if (!referenceDate) {
      dispatch({ type: "idle" });
      return;
    }

    if (!academicPeriodId) {
      dispatch({
        type: "error",
        error: "No hay un período académico vigente para la fecha seleccionada.",
      });
      return;
    }

    let cancelled = false;
    dispatch({ type: "loading" });
    blockComponentService
      .listByTeacherSubjectSection(teacherSubjectSectionId, academicPeriodId)
      .then((items) => {
        if (cancelled) return;
        dispatch({
          type: "success",
          options: items.map((i) => ({
            label: `${i.evaluation_block_name} - ${i.name}`,
            value: String(i.id),
            internalWeight: String(i.internal_weight),
          })),
        });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        dispatch({
          type: "error",
          error:
            err instanceof Error
              ? err.message
              : "No se pudieron cargar los bloques.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [
    teacherSubjectSectionId,
    referenceDate,
    academicPeriodId,
    loadingPeriods,
  ]);

  return {
    blockComponentOptions: state.options,
    blockComponentsLoading: state.loading || loadingPeriods,
    blockComponentsError: state.error,
    academicPeriodName: resolvedPeriod?.label ?? null,
  };
};

export const useBlockComponentFilterCatalogs = () => {
  const { academicPeriodOptions } = useAcademicPeriodOptions();

  const { options: evaluationBlockOptions, loading: loadingBlocks } = useCatalogOptions(
    () => evaluationBlockService.list({ page: 1, pageSize: 100 }).then((r) => r.items),
    [],
    (b) => ({ label: b.name, value: String(b.id) }),
  );

  return { evaluationBlockOptions, academicPeriodOptions, statusOptions: STATUS_OPTIONS, loadingBlocks };
};
