import { supabase } from '@/lib/supabase';

export const valueStreamService = {
  async getAll() {
    try {
      console.log('Iniciando getAll en valueStreamService');
      
      const { data, error } = await supabase
        .from('value_streams')
        .select('*')
        .eq('is_active', true)
        .order('name');

      console.log('Respuesta de Supabase:', { data, error });

      if (error) {
        console.error('Error de Supabase:', error);
        throw error;
      }

      // Asegurarnos que data no sea null
      return data || [];
      
    } catch (error) {
      console.error('Error en valueStreamService.getAll:', error);
      throw error;
    }
  },

  async getLines(valueStreamId: string) {
    try {
      console.log('Iniciando getLines para valueStreamId:', valueStreamId);
      
      const { data, error } = await supabase
        .from('production_lines')
        .select('*')
        .eq('value_stream_id', valueStreamId)
        .eq('is_active', true)
        .order('name');

      console.log('Respuesta de Supabase:', { data, error });

      if (error) {
        console.error('Error de Supabase:', error);
        throw error;
      }

      // Asegurarnos que data no sea null
      return data || [];
      
    } catch (error) {
      console.error('Error en valueStreamService.getLines:', error);
      throw error;
    }
  }
}; 