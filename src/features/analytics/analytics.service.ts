import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type {
  BatchCalcResultT,
  CalculateRiskParamsT,
  DashboardOverviewParamsT,
  DashboardOverviewT,
  EarlyAlertListParamsT,
  EarlyAlertT,
  EnrollmentTrendParamsT,
  EnrollmentTrendPointT,
  FeatureSnapshotListParamsT,
  RecalculatePeriodParamsT,
  RiskDistributionByGradeT,
  RiskScoreListParamsT,
  SectionSummaryParamsT,
  SectionSummaryT,
  StudentAtRiskT,
  StudentFeatureSnapshotT,
  StudentRiskScoreT,
  StudentsAtRiskParamsT,
} from "./analytics.types";
import { ANALYTICS_ENDPOINTS, RISK_SCORE_ENDPOINTS } from "./analytics.constants";

import type { PaginatedResponseApi, ResponseApi } from "@shared/types/api.response.types";

class AnalyticsService {
  async getOverview(params: DashboardOverviewParamsT): Promise<DashboardOverviewT> {
    try {
      const { data } = await apiClient.get<ResponseApi<DashboardOverviewT>>(
        ANALYTICS_ENDPOINTS.DASHBOARD_OVERVIEW(params.period_id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async getRiskDistribution(params: DashboardOverviewParamsT): Promise<RiskDistributionByGradeT> {
    try {
      const { data } = await apiClient.get<ResponseApi<RiskDistributionByGradeT>>(
        ANALYTICS_ENDPOINTS.DASHBOARD_RISK_DISTRIBUTION(params.period_id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async getStudentsAtRisk(params: StudentsAtRiskParamsT): Promise<StudentAtRiskT[]> {
    try {
      const { data } = await apiClient.get<ResponseApi<StudentAtRiskT[]>>(
        ANALYTICS_ENDPOINTS.DASHBOARD_STUDENTS_AT_RISK(params),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async getSectionSummary(params: SectionSummaryParamsT): Promise<SectionSummaryT> {
    try {
      const { data } = await apiClient.get<ResponseApi<SectionSummaryT>>(
        ANALYTICS_ENDPOINTS.DASHBOARD_SECTION_SUMMARY(params.section_id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async getEnrollmentTrend(params?: EnrollmentTrendParamsT): Promise<EnrollmentTrendPointT[]> {
    try {
      const { data } = await apiClient.get<ResponseApi<EnrollmentTrendPointT[]>>(
        ANALYTICS_ENDPOINTS.DASHBOARD_ENROLLMENT_TREND(params?.school_year_id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async listEarlyAlerts(params?: EarlyAlertListParamsT): Promise<EarlyAlertT[]> {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 20;
      const search = params?.search
        ? `&search=${encodeURIComponent(params.search)}`
        : "";
      const ordering = params?.ordering
        ? `&ordering=${encodeURIComponent(params.ordering)}`
        : "";
      const attended =
        params?.attended !== undefined ? `&attended=${params.attended}` : "";
      const urgency = params?.urgency_level
        ? `&urgency_level=${params.urgency_level}`
        : "";

      const { data } = await apiClient.get<PaginatedResponseApi<EarlyAlertT>>(
        `${ANALYTICS_ENDPOINTS.EARLY_ALERTS_LIST}?page=${page}&page_size=${pageSize}${search}${ordering}${attended}${urgency}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async listRiskScores(params?: RiskScoreListParamsT): Promise<{ results: StudentRiskScoreT[]; count: number }> {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 20;
      const qs = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
      });
      if (params?.search) qs.set("search", params.search);
      if (params?.risk_label) qs.set("risk_label", params.risk_label);
      if (params?.academic_period) qs.set("academic_period", String(params.academic_period));
      if (params?.ordering) qs.set("ordering", params.ordering);

      const { data } = await apiClient.get<PaginatedResponseApi<StudentRiskScoreT>>(
        `${RISK_SCORE_ENDPOINTS.LIST}?${qs.toString()}`,
      );
      return { results: data.data.results, count: data.data.count };
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async getRiskScore(id: number): Promise<StudentRiskScoreT> {
    try {
      const { data } = await apiClient.get<ResponseApi<StudentRiskScoreT>>(
        RISK_SCORE_ENDPOINTS.DETAIL(id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async listFeatureSnapshots(params?: FeatureSnapshotListParamsT): Promise<StudentFeatureSnapshotT[]> {
    try {
      const qs = new URLSearchParams();
      if (params?.enrollment) qs.set("enrollment", String(params.enrollment));
      if (params?.academic_period) qs.set("academic_period", String(params.academic_period));

      const { data } = await apiClient.get<PaginatedResponseApi<StudentFeatureSnapshotT>>(
        `${RISK_SCORE_ENDPOINTS.FEATURE_SNAPSHOTS}?${qs.toString()}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async recalculatePeriod(params: RecalculatePeriodParamsT): Promise<BatchCalcResultT> {
    try {
      const { data } = await apiClient.post<ResponseApi<BatchCalcResultT>>(
        RISK_SCORE_ENDPOINTS.RECALCULATE_PERIOD,
        { academic_period_id: params.academic_period_id },
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async calculateRisk(params: CalculateRiskParamsT): Promise<BatchCalcResultT> {
    try {
      const { data } = await apiClient.post<ResponseApi<BatchCalcResultT>>(
        RISK_SCORE_ENDPOINTS.CALCULATE,
        {
          student_id: params.student_id,
          academic_period_id: params.academic_period_id,
        },
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const analyticsService = new AnalyticsService();
