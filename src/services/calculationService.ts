import { supabase } from '@/lib/supabase';

interface EffectiveTargetParams {
  baseTarget: number;
  date: string;
  shift: number;
  lineId: string;
  hour: string;
}

class CalculationService {
  async getEffectiveTarget(params: EffectiveTargetParams) {
    const { baseTarget, date, shift, lineId, hour } = params;

    const { data, error } = await supabase
      .rpc('calculate_effective_target', {
        base_target: baseTarget,
        target_date: date,
        shift_number: shift,
        line_id: lineId,
        hour: hour
      });
    
    if (error) throw error;
    return data;
  }
}

export const calculationService = new CalculationService(); 