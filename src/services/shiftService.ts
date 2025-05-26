import { supabase } from '@/lib/supabase';

interface Shift {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  // Agregar otros campos según la estructura de la tabla
}

export const shiftService = {
  async getAll() {
    try {
      console.log('Iniciando getAll en shiftService');
      
      const { data, error } = await supabase
        .from('shifts')
        .select(`
          id,
          name,
          start_time,
          end_time,
          created_at,
          updated_at
        `)
        .order('start_time');

      console.log('Respuesta de Supabase:', { data, error });

      if (error) {
        console.error('Error de Supabase:', error);
        throw error;
      }

      return data || [];
      
    } catch (error) {
      console.error('Error en shiftService.getAll:', error);
      throw error;
    }
  }
}; 