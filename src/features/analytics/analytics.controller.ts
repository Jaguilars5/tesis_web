import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { useCallback } from "react";

import { analyticsService } from "./analytics.service";
import {
  loadPending,
  loadError,
  overviewLoaded,
  riskDistributionLoaded,
  studentsAtRiskLoaded,
  enrollmentTrendLoaded,
  earlyAlertsLoaded,
  selectOverview,
  selectRiskDistribution,
  selectStudentsAtRisk,
  selectEnrollmentTrend,
  selectEarlyAlerts,
  selectAnalyticsStatus,
  selectAnalyticsError,
} from "./analytics.slice";
import {
  riskScoresLoadPending,
  riskScoresLoadError,
  riskScoresLoaded,
  riskScoreDetailLoaded,
  riskScoreSnapshotLoaded,
  calculationStarted,
  calculationFinished,
  calculationNoStudents,
  calculationFailed,
  resetCalculationStatus,
  clearRiskScoreError,
  selectRiskScores,
  selectRiskScoresTotalCount,
  selectSelectedRiskScore,
  selectSelectedSnapshot,
  selectRiskScoresStatus,
  selectRiskScoresError,
  selectCalcTaskId,
  selectCalcStatus,
} from "./risk-score.slice";

import type {
  DashboardOverviewParamsT,
  EnrollmentTrendParamsT,
  FeatureSnapshotListParamsT,
  RecalculatePeriodParamsT,
  RiskScoreListParamsT,
  StudentsAtRiskParamsT,
} from "./analytics.types";

export const useDirectorDashboard = () => {
  const dispatch = useAppDispatch();
  const overview = useAppSelector(selectOverview);
  const riskDistribution = useAppSelector(selectRiskDistribution);
  const studentsAtRisk = useAppSelector(selectStudentsAtRisk);
  const enrollmentTrend = useAppSelector(selectEnrollmentTrend);
  const criticalAlerts = useAppSelector(selectEarlyAlerts);
  const status = useAppSelector(selectAnalyticsStatus);
  const error = useAppSelector(selectAnalyticsError);

  const loadOverview = useCallback(
    async (params: DashboardOverviewParamsT) => {
      dispatch(loadPending());
      try {
        const data = await analyticsService.getOverview(params);
        dispatch(overviewLoaded(data));
      } catch (err) {
        dispatch(loadError(err instanceof Error ? err.message : "Error al cargar overview"));
      }
    },
    [dispatch],
  );

  const loadRiskDistribution = useCallback(
    async (params: DashboardOverviewParamsT) => {
      try {
        const data = await analyticsService.getRiskDistribution(params);
        dispatch(riskDistributionLoaded(data));
      } catch (err) {
        dispatch(loadError(err instanceof Error ? err.message : "Error al cargar distribucion de riesgo"));
      }
    },
    [dispatch],
  );

  const loadStudentsAtRisk = useCallback(
    async (params: StudentsAtRiskParamsT) => {
      try {
        const data = await analyticsService.getStudentsAtRisk(params);
        dispatch(studentsAtRiskLoaded(data));
      } catch (err) {
        dispatch(loadError(err instanceof Error ? err.message : "Error al cargar estudiantes en riesgo"));
      }
    },
    [dispatch],
  );

  const loadEnrollmentTrend = useCallback(
    async (params?: EnrollmentTrendParamsT) => {
      try {
        const data = await analyticsService.getEnrollmentTrend(params);
        dispatch(enrollmentTrendLoaded(data));
      } catch (err) {
        dispatch(loadError(err instanceof Error ? err.message : "Error al cargar tendencia"));
      }
    },
    [dispatch],
  );

  const loadCriticalAlerts = useCallback(
    async () => {
      try {
        const data = await analyticsService.listEarlyAlerts({
          attended: false,
          page: 1,
          pageSize: 5,
          ordering: "-detected_at",
        });
        dispatch(earlyAlertsLoaded(data));
      } catch (err) {
        dispatch(loadError(err instanceof Error ? err.message : "Error al cargar alertas"));
      }
    },
    [dispatch],
  );

  const loadDirectorDashboard = useCallback(
    async (params: DashboardOverviewParamsT) => {
      dispatch(loadPending());
      try {
        const [overview, riskDist, students, trend, alerts] = await Promise.all([
          analyticsService.getOverview(params),
          analyticsService.getRiskDistribution(params),
          analyticsService.getStudentsAtRisk({ ...params, risk_label: "rojo" }),
          analyticsService.getEnrollmentTrend(undefined),
          analyticsService.listEarlyAlerts({
            attended: false,
            page: 1,
            pageSize: 5,
            ordering: "-detected_at",
          }),
        ]);
        dispatch(overviewLoaded(overview));
        dispatch(riskDistributionLoaded(riskDist));
        dispatch(studentsAtRiskLoaded(students));
        dispatch(enrollmentTrendLoaded(trend));
        dispatch(earlyAlertsLoaded(alerts));
      } catch (err) {
        dispatch(loadError(err instanceof Error ? err.message : "Error al cargar dashboard"));
      }
    },
    [dispatch],
  );

  return {
    overview,
    riskDistribution,
    studentsAtRisk,
    enrollmentTrend,
    criticalAlerts,
    isLoading: status === "loading",
    error,
    loadOverview,
    loadRiskDistribution,
    loadStudentsAtRisk,
    loadEnrollmentTrend,
    loadCriticalAlerts,
    loadDirectorDashboard,
  };
};

export const useRiskScoreController = () => {
  const dispatch = useAppDispatch();
  const scores = useAppSelector(selectRiskScores);
  const totalCount = useAppSelector(selectRiskScoresTotalCount);
  const selectedScore = useAppSelector(selectSelectedRiskScore);
  const selectedSnapshot = useAppSelector(selectSelectedSnapshot);
  const status = useAppSelector(selectRiskScoresStatus);
  const error = useAppSelector(selectRiskScoresError);
  const calcTaskId = useAppSelector(selectCalcTaskId);
  const calcStatus = useAppSelector(selectCalcStatus);

  const loadScores = useCallback(
    async (params?: RiskScoreListParamsT) => {
      dispatch(riskScoresLoadPending());
      try {
        const data = await analyticsService.listRiskScores(params);
        dispatch(riskScoresLoaded(data));
      } catch (err) {
        dispatch(riskScoresLoadError(err instanceof Error ? err.message : "Error al cargar puntajes"));
      }
    },
    [dispatch],
  );

  const loadDetail = useCallback(
    async (id: number) => {
      dispatch(riskScoresLoadPending());
      try {
        const data = await analyticsService.getRiskScore(id);
        dispatch(riskScoreDetailLoaded(data));
      } catch (err) {
        dispatch(riskScoresLoadError(err instanceof Error ? err.message : "Error al cargar detalle"));
      }
    },
    [dispatch],
  );

  const loadSnapshot = useCallback(
    async (params: FeatureSnapshotListParamsT) => {
      try {
        const snapshots = await analyticsService.listFeatureSnapshots(params);
        dispatch(riskScoreSnapshotLoaded(snapshots.length > 0 ? snapshots[0] : null));
      } catch (err) {
        dispatch(riskScoresLoadError(err instanceof Error ? err.message : "Error al cargar snapshot"));
      }
    },
    [dispatch],
  );

  const recalculate = useCallback(
    async (params: RecalculatePeriodParamsT) => {
      dispatch(calculationStarted());
      try {
        const result = await analyticsService.recalculatePeriod(params);
        if (result.status === "NO_STUDENTS") {
          dispatch(calculationNoStudents());
        } else {
          dispatch(calculationFinished({ taskId: result.task_id }));
        }
      } catch (err) {
        dispatch(calculationFailed(err instanceof Error ? err.message : "Error al recalcular"));
      }
    },
    [dispatch],
  );

  const resetCalc = useCallback(
    () => dispatch(resetCalculationStatus()),
    [dispatch],
  );

  const clearError = useCallback(
    () => dispatch(clearRiskScoreError()),
    [dispatch],
  );

  return {
    scores,
    totalCount,
    selectedScore,
    selectedSnapshot,
    isLoading: status === "loading",
    error,
    calcTaskId,
    calcStatus,
    loadScores,
    loadDetail,
    loadSnapshot,
    recalculate,
    resetCalc,
    clearError,
  };
};
