import { supabase } from '@/lib/supabase';

interface ProductionCause {
  id: string;
  production_entry_id: string;
  cause_type_id: string;
  general_cause_id: number;
  specific_details: string;
  affected_units: number;
  downtime_minutes: number;
  created_at: string;
  created_by: string;
}

export const productionCauseService = {
  async getAll() {
    try {
      console.log('Iniciando getAll en productionCauseService');
      
      const { data, error } = await supabase
        .from('production_causes')
        .select(`
          id,
          production_entry_id,
          cause_type_id,
          general_cause_id,
          specific_details,
          affected_units,
          downtime_minutes,
          created_at,
          created_by,
          general_causes (
            name,
            description
          ),
          cause_types (
            name,
            description
          )
        `)
        .order('created_at', { ascending: false });

      console.log('Respuesta de Supabase:', { data, error });

      if (error) {
        console.error('Error de Supabase:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error en productionCauseService.getAll:', error);
      throw error;
    }
  },

  async getByProductionEntry(productionEntryId: string) {
    try {
      console.log('Iniciando getByProductionEntry en productionCauseService');
      
      const { data, error } = await supabase
        .from('production_causes')
        .select(`
          id,
          production_entry_id,
          cause_type_id,
          general_cause_id,
          specific_details,
          affected_units,
          downtime_minutes,
          created_at,
          created_by,
          general_causes (
            name,
            description
          ),
          cause_types (
            name,
            description
          )
        `)
        .eq('production_entry_id', productionEntryId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error en productionCauseService.getByProductionEntry:', error);
      throw error;
    }
  },

  async create(cause: Omit<ProductionCause, 'id' | 'created_at'>) {
    try {
      console.log('Iniciando create en productionCauseService');
      
      const { data, error } = await supabase
        .from('production_causes')
        .insert([cause])
        .select();

      if (error) throw error;

      return data?.[0];
    } catch (error) {
      console.error('Error en productionCauseService.create:', error);
      throw error;
    }
  }
}; 