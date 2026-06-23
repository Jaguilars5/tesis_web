import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type {
  DashboardOverviewT,
  EarlyAlertT,
  EnrollmentTrendPointT,
  RiskDistributionByGradeT,
  StudentAtRiskT,
} from "./analytics.types";

export interface AnalyticsStateT {
  overview: DashboardOverviewT | null;
  riskDistribution: RiskDistributionByGradeT | null;
  studentsAtRisk: StudentAtRiskT[];
  enrollmentTrend: EnrollmentTrendPointT[];
  earlyAlerts: EarlyAlertT[];
  status: RequestStatusT;
  error: string | null;
}

const initialState: AnalyticsStateT = {
  overview: null,
  riskDistribution: null,
  studentsAtRisk: [],
  enrollmentTrend: [],
  earlyAlerts: [],
  status: "idle",
  error: null,
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    loadPending(state) {
      state.status = "loading";
      state.error = null;
    },
    loadError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    overviewLoaded(state, action: PayloadAction<DashboardOverviewT>) {
      state.overview = action.payload;
      state.status = "succeeded";
    },
    riskDistributionLoaded(state, action: PayloadAction<RiskDistributionByGradeT>) {
      state.riskDistribution = action.payload;
      state.status = "succeeded";
    },
    studentsAtRiskLoaded(state, action: PayloadAction<StudentAtRiskT[]>) {
      state.studentsAtRisk = action.payload;
      state.status = "succeeded";
    },
    enrollmentTrendLoaded(state, action: PayloadAction<EnrollmentTrendPointT[]>) {
      state.enrollmentTrend = action.payload;
      state.status = "succeeded";
    },
    earlyAlertsLoaded(state, action: PayloadAction<EarlyAlertT[]>) {
      state.earlyAlerts = action.payload;
      state.status = "succeeded";
    },
    clearAnalyticsError(state) {
      state.error = null;
    },
    resetAnalyticsState() {
      return initialState;
    },
  },
});

export const {
  loadPending,
  loadError,
  overviewLoaded,
  riskDistributionLoaded,
  studentsAtRiskLoaded,
  enrollmentTrendLoaded,
  earlyAlertsLoaded,
  clearAnalyticsError,
  resetAnalyticsState,
} = analyticsSlice.actions;

export const selectOverview = (state: RootState): DashboardOverviewT | null =>
  state.analytics.dashboard.overview;

export const selectRiskDistribution = (state: RootState): RiskDistributionByGradeT | null =>
  state.analytics.dashboard.riskDistribution;

export const selectStudentsAtRisk = (state: RootState): StudentAtRiskT[] =>
  state.analytics.dashboard.studentsAtRisk;

export const selectEnrollmentTrend = (state: RootState): EnrollmentTrendPointT[] =>
  state.analytics.dashboard.enrollmentTrend;

export const selectEarlyAlerts = (state: RootState): EarlyAlertT[] =>
  state.analytics.dashboard.earlyAlerts;

export const selectAnalyticsStatus = (state: RootState): RequestStatusT =>
  state.analytics.dashboard.status;

export const selectAnalyticsError = (state: RootState): string | null =>
  state.analytics.dashboard.error;

export const analyticsReducer = analyticsSlice.reducer;
export default analyticsSlice.reducer;
