import { supabase } from '@/lib/supabase';

class PartNumberService {
  async getAll() {
    const { data, error } = await supabase
      .from('part_numbers')
      .select('*')
      .order('code');
    
    if (error) throw error;
    return data;
  }

  async getByCode(code: string) {
    const { data, error } = await supabase
      .from('part_numbers')
      .select('*')
      .eq('code', code)
      .single();
    
    if (error) throw error;
    return data;
  }

  async getRunRatesByCode(code: string) {
    const { data, error } = await supabase
      .from('part_numbers')
      .select(`
        code,
        description,
        run_rates (*)
      `)
      .eq('code', code)
      .single();
    
    if (error) throw error;
    return data;
  }
}

export const partNumberService = new PartNumberService(); 