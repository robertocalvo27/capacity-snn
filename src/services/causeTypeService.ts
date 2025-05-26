import { supabase } from '@/lib/supabase';

export const causeTypeService = {
  async getAll() {
    try {
      console.log('Iniciando getAll en causeTypeService');
      
      const { data, error } = await supabase
        .from('cause_types')
        .select(`
          id,
          name,
          description,
          created_at
        `)
        .order('name');

      console.log('Respuesta de Supabase:', { data, error });

      if (error) {
        console.error('Error de Supabase:', error);
        throw error;
      }

      return data || [];
      
    } catch (error) {
      console.error('Error en causeTypeService.getAll:', error);
      throw error;
    }
  }
}; 