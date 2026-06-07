export interface GradeTypeT {
  id: number;
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
  order: number;
  applicable_subniveles: number[];
}
