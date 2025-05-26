import { supabase } from '@/lib/supabase';
import type { ProgrammedStop, ProductionProgrammedStop } from '@/types';

class ProgrammedStopService {
  async getAll() {
    const { data, error } = await supabase
      .from('programmed_stops')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  }

  async create(stop: Omit<ProgrammedStop, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('programmed_stops')
      .insert(stop)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async update(id: string, stop: Partial<ProgrammedStop>) {
    const { data, error } = await supabase
      .from('programmed_stops')
      .update(stop)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async delete(id: string) {
    const { error } = await supabase
      .from('programmed_stops')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async associateWithEntry(entryId: string, stopId: string) {
    const { data, error } = await supabase
      .from('production_programmed_stops')
      .insert({
        production_entry_id: entryId,
        programmed_stop_id: stopId
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getByEntry(entryId: string) {
    const { data, error } = await supabase
      .from('production_programmed_stops')
      .select(`
        *,
        programmed_stops (*)
      `)
      .eq('production_entry_id', entryId);
    
    if (error) throw error;
    return data;
  }
}

export const programmedStopService = new ProgrammedStopService(); 