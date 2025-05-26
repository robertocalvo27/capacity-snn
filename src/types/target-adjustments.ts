export interface CorrectionFactor {
  id: string;
  name: string;
  factor: number;
  description?: string;
  created_at: string;
}

export interface TargetAdjustment {
  id: string;
  line_id: string;
  correction_factor_id: string;
  date: string;
  created_at: string;
} 