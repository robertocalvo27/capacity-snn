import { supabase } from '@/lib/supabase';
import type { CorrectionFactor, TargetAdjustment } from '@/types';

class TargetAdjustmentService {
  async getAllCorrectionFactors() {
    const { data, error } = await supabase
      .from('correction_factors')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  }

  async createCorrectionFactor(factor: Omit<CorrectionFactor, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('correction_factors')
      .insert(factor)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async createAdjustment(adjustment: Omit<TargetAdjustment, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('target_adjustments')
      .insert(adjustment)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getAllAdjustments() {
    const { data, error } = await supabase
      .from('target_adjustments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async getByLineAndDate(lineId: string, date: string) {
    const { data, error } = await supabase
      .from('target_adjustments')
      .select('*')
      .eq('line_id', lineId)
      .eq('date', date)
      .order('created_at');
    
    if (error) throw error;
    return data;
  }
}

export const targetAdjustmentService = new TargetAdjustmentService(); 