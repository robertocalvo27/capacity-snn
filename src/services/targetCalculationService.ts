import { supabase } from '../lib/supabase';
import { targetAdjustmentService } from './targetAdjustmentService';

export const targetCalculationService = {
  async calculateEffectiveTarget(
    baseTarget: number,
    entryDate: string,
    shift: number,
    lineId: string,
    hour: string
  ): Promise<{
    effectiveTarget: number;
    availableMinutes: number;
    adjustmentPercentage: number;
  }> {
    // 1. Obtener paros programados para esta hora
    const { data: stops } = await supabase
      .from('production_programmed_stops')
      .select(`
        programmed_stops (
          duration
        )
      `)
      .eq('production_entry_id', `${lineId}-${entryDate}-${hour}`);

    // 2. Calcular tiempo disponible
    const totalStopTime = stops?.reduce((acc, stop) => 
      acc + (stop.programmed_stops?.duration || 0), 0) || 0;
    const availableMinutes = 60 - totalStopTime;

    // 3. Obtener ajustes de meta aplicables
    const targetWithAdjustment = await targetAdjustmentService
      .calculateAdjustedTarget(baseTarget, entryDate, shift, lineId, hour);
    
    const adjustmentPercentage = ((baseTarget - targetWithAdjustment) / baseTarget) * 100;

    // 4. Calcular meta efectiva considerando ambos factores
    const effectiveTarget = Math.floor(
      targetWithAdjustment * (availableMinutes / 60)
    );

    return {
      effectiveTarget,
      availableMinutes,
      adjustmentPercentage
    };
  }
}; 