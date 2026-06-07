export interface PromotionStatusT {
  id: number;
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
  order: number;
}
