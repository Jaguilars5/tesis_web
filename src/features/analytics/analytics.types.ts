export type RiskLabelT = "rojo" | "amarillo" | "verde";
export type AlertTypeT =
  | "low_attendance"
  | "failing_grades"
  | "behavioral"
  | "dropout_risk"
  | "socioemotional";
export type UrgencyLevelT = "low" | "medium" | "high" | "critical";

export interface RiskDistributionT {
  rojo: number;
  amarillo: number;
  verde: number;
}

export interface DashboardOverviewT {
  period_id: number;
  total_students: number;
  attendance_rate_avg: number;
  formative_avg: number;
  summative_avg: number;
  failing_count: number;
  risk_distribution: RiskDistributionT;
  active_alerts: number;
  avg_severe_incidents: number;
}

export type RiskDistributionByGradeT = Record<
  string,
  RiskDistributionT & { total: number }
>;

export interface StudentAtRiskT {
  student_id: number;
  student_name: string;
  risk_score: number;
  risk_label: RiskLabelT;
}

export interface EnrollmentTrendPointT {
  month: string;
  count: number;
}

export interface EarlyAlertT {
  id: number;
  enrollment: number;
  enrollment_name: string;
  academic_period: number;
  academic_period_name: string;
  alert_type: AlertTypeT | null;
  description: string;
  urgency_level: UrgencyLevelT | null;
  attended: boolean;
  attended_by_user: number | null;
  attended_by_user_name: string;
  detected_at: string;
  attended_at: string | null;
  response_actions: string;
  created_at: string;
  updated_at: string;
}

export interface SectionSummaryT {
  section_id: number;
  total_students: number;
  attendance_rate_avg: number;
  formative_avg: number;
  risk_distribution: RiskDistributionT;
}

export interface StudentRiskScoreT {
  id: number;
  enrollment: number;
  enrollment_name: string;
  academic_period: number;
  academic_period_name: string;
  risk_score: number;
  risk_label: RiskLabelT;
  model_version: string;
  calculated_at: string;
  risk_factors: StudentRiskFactorT[];
}

export interface StudentRiskFactorT {
  id: number;
  student_risk_score: number;
  risk_factor: number;
  risk_factor_name: string;
  contribution_weight: number;
  created_at: string;
}

export interface StudentFeatureSnapshotT {
  id: number;
  enrollment: number;
  enrollment_name: string;
  academic_period: number;
  academic_period_name: string;
  attendance_rate: number;
  consecutive_absences_max: number;
  tardiness_count: number;
  justified_absences: number;
  unjustified_absences: number;
  formative_avg_normalized: number;
  summative_avg_normalized: number;
  grade_trend_slope: number;
  failing_subjects_count: number;
  conduct_score: number;
  severe_incidents_count: number;
  family_notified_ratio: number;
  prev_period_avg_grade: number | null;
  age_grade_gap: number;
  is_repeat: boolean;
  has_special_needs: boolean;
  created_at: string;
  updated_at: string;
}

export interface BatchCalcResultT {
  task_id: string | null;
  status: "PENDING" | "NO_STUDENTS";
}

export interface DashboardOverviewParamsT {
  period_id: number;
}

export interface StudentsAtRiskParamsT {
  period_id: number;
  risk_label?: RiskLabelT;
}

export interface SectionSummaryParamsT {
  section_id: number;
}

export interface EnrollmentTrendParamsT {
  school_year_id?: number;
}

export interface EarlyAlertListParamsT {
  page?: number;
  pageSize?: number;
  ordering?: string;
  attended?: boolean;
  urgency_level?: UrgencyLevelT;
  search?: string;
}

export interface RiskScoreListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  risk_label?: RiskLabelT;
  academic_period?: number;
  ordering?: string;
}

export interface FeatureSnapshotListParamsT {
  enrollment?: number;
  academic_period?: number;
}

export interface RecalculatePeriodParamsT {
  academic_period_id: number;
}

export interface CalculateRiskParamsT {
  student_id: number;
  academic_period_id: number;
}

export interface AnalyticsServiceT {
  getOverview(params: DashboardOverviewParamsT): Promise<DashboardOverviewT>;
  getRiskDistribution(params: DashboardOverviewParamsT): Promise<RiskDistributionByGradeT>;
  getStudentsAtRisk(params: StudentsAtRiskParamsT): Promise<StudentAtRiskT[]>;
  getSectionSummary(params: SectionSummaryParamsT): Promise<SectionSummaryT>;
  getEnrollmentTrend(params?: EnrollmentTrendParamsT): Promise<EnrollmentTrendPointT[]>;
  listEarlyAlerts(params?: EarlyAlertListParamsT): Promise<EarlyAlertT[]>;
  listRiskScores(params?: RiskScoreListParamsT): Promise<{ results: StudentRiskScoreT[]; count: number }>;
  getRiskScore(id: number): Promise<StudentRiskScoreT>;
  listFeatureSnapshots(params?: FeatureSnapshotListParamsT): Promise<StudentFeatureSnapshotT[]>;
  recalculatePeriod(params: RecalculatePeriodParamsT): Promise<BatchCalcResultT>;
  calculateRisk(params: CalculateRiskParamsT): Promise<BatchCalcResultT>;
}
