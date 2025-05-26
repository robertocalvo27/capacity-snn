import { supabase } from '../lib/supabase';
import type { ProductionEntry } from '../types/production';
import { targetCalculationService } from './targetCalculationService';

export const productionService = {
  async getPartNumbersByLine(lineId: string) {
    const { data, error } = await supabase
      .from('production_lines')
      .select(`
        value_stream_id,
        part_numbers (
          code,
          labor_std,
          total_hc,
          run_rates (*)
        )
      `)
      .eq('id', lineId)
      .single();

    if (error) throw error;
    return data;
  },

  async saveProductionEntry(entry: ProductionEntry) {
    // Calcular meta efectiva
    const { effectiveTarget, availableMinutes, adjustmentPercentage } = 
      await targetCalculationService.calculateEffectiveTarget(
        entry.hourly_target,
        entry.entry_date,
        entry.shift,
        entry.line_id,
        entry.hour
      );

    // Guardar entrada con meta ajustada
    const { data, error } = await supabase
      .from('production_entries')
      .insert({
        ...entry,
        hourly_target: effectiveTarget,
        available_minutes: availableMinutes,
        target_adjustment_percentage: adjustmentPercentage
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}; 