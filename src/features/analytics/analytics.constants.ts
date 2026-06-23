export const ANALYTICS_ENDPOINTS = {
  DASHBOARD_OVERVIEW: (periodId: number) =>
    `/api/analytics/dashboard/overview/?period_id=${periodId}`,
  DASHBOARD_RISK_DISTRIBUTION: (periodId: number) =>
    `/api/analytics/dashboard/risk_distribution/?period_id=${periodId}`,
  DASHBOARD_STUDENTS_AT_RISK: (params: {
    period_id: number;
    risk_label?: string;
  }) => {
    const qs = new URLSearchParams({ period_id: String(params.period_id) });
    if (params.risk_label) qs.set("risk_label", params.risk_label);
    return `/api/analytics/dashboard/students_at_risk/?${qs.toString()}`;
  },
  DASHBOARD_SECTION_SUMMARY: (sectionId: number) =>
    `/api/analytics/dashboard/section_summary/?section_id=${sectionId}`,
  DASHBOARD_ENROLLMENT_TREND: (schoolYearId?: number) => {
    const qs = schoolYearId
      ? `?school_year_id=${schoolYearId}`
      : "";
    return `/api/analytics/dashboard/enrollment_trend/${qs}`;
  },
  EARLY_ALERTS_LIST: "/api/analytics/early-alerts/",
} as const;

export const RISK_SCORE_ENDPOINTS = {
  LIST: "/api/analytics/student-risk-scores/",
  DETAIL: (id: number) => `/api/analytics/student-risk-scores/${id}/`,
  CALCULATE: "/api/analytics/student-risk-scores/calculate/",
  BATCH_CALCULATE: "/api/analytics/student-risk-scores/batch_calculate/",
  FEATURE_SNAPSHOTS: "/api/analytics/feature-snapshots/",
  RECALCULATE_PERIOD: "/api/analytics/dashboard/recalculate_period/",
} as const;

export const ANALYTICS_RISK_PERMISSIONS = {
  VIEW: "analytics.view_risk_score",
  VIEW_FEATURE_SNAPSHOT: "analytics.view_feature_snapshot",
  VIEW_RISK_FACTOR: "analytics.view_risk_factor",
  VIEW_STUDENT_RISK_FACTOR: "analytics.view_student_risk_factor",
  CREATE_STUDENT_RISK_FACTOR: "analytics.create_student_risk_factor",
  VIEW_EARLY_ALERT: "analytics.view_early_alert",
} as const;
