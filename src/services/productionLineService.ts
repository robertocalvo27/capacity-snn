import { supabase } from '@/lib/supabase';

export const productionLineService = {
  async getAll() {
    try {
      console.log('Iniciando getAll en productionLineService');
      
      const { data, error } = await supabase
        .from('production_lines')
        .select('*')
        .eq('is_active', true)
        .order('name');

      console.log('Respuesta de Supabase:', { data, error });

      if (error) {
        console.error('Error de Supabase:', error);
        throw error;
      }

      return data || [];
      
    } catch (error) {
      console.error('Error en productionLineService.getAll:', error);
      throw error;
    }
  }
}; 