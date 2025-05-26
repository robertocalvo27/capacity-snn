import { supabase } from '../lib/supabase';
import type { 
  ProductionEntry, 
  PartNumber,
  ProductionLine,
  ValueStream 
} from '../types/production';

export const productionService = {
  // Producción
  async saveEntry(entry: ProductionEntry) {
    const { data, error } = await supabase
      .from('production_entries')
      .upsert(entry);
    
    if (error) throw error;
    return data;
  },

  async getEntriesByShift(lineId: string, date: string, shift: number) {
    const { data, error } = await supabase
      .from('production_entries')
      .select('*')
      .eq('line_id', lineId)
      .eq('entry_date', date)
      .eq('shift', shift)
      .order('hour');

    if (error) throw error;
    return data;
  },

  // Part Numbers y Run Rates
  async getPartNumbersByValueStream(valueStreamId: string) {
    const { data, error } = await supabase
      .from('part_numbers')
      .select(`
        *,
        run_rates(*)
      `)
      .eq('value_stream_id', valueStreamId);

    if (error) throw error;
    return data;
  }
};

export const testDatabaseConnection = async () => {
  try {
    // Probar value_streams
    const { data: valueStreams, error: vsError } = await supabase
      .from('value_streams')
      .select('*');
    
    if (vsError) throw vsError;
    console.log('Value Streams:', valueStreams);
    
    return true;
  } catch (error) {
    console.error('Error de conexión:', error);
    return false;
  }
}; 