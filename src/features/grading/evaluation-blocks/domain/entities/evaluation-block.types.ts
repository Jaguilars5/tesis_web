export interface EvaluationBlockT {
  id: number;
  academic_period_name: string;
  name: string;
  weight_percentage: number;
  is_active: boolean;
  academic_period: number;
  evaluation_type: number | null;
}

export type EvaluationBlockCreateT = Omit<EvaluationBlockT, "id" | "is_active" | "academic_period_name">;

export type EvaluationBlockUpdateT = Partial<EvaluationBlockT> & { id: number };
