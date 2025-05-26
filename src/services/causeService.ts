import { supabase } from '@/lib/supabase';

export const causeService = {
  async getAll() {
    try {
      console.log('Iniciando getAll en causeService');
      
      const { data, error } = await supabase
        .from('general_causes')
        .select(`
          id,
          cause_type_id,
          name,
          description,
          is_active,
          created_at,
          cause_types (
            name,
            description
          )
        `)
        .eq('is_active', true)
        .order('name');

      console.log('Respuesta de Supabase:', { data, error });

      if (error) {
        console.error('Error de Supabase:', error);
        throw error;
      }

      return data || [];
      
    } catch (error) {
      console.error('Error en causeService.getAll:', error);
      throw error;
    }
  }
}; 