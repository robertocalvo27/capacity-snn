import { supabase } from '@/lib/supabase';

interface ProductionEntry {
  id: string;                    // Formato: "{hora}-{timestamp}"
  hour: string;                  // Formato: "HH:mm"
  real_head_count: number;       // HC presente en línea
  additional_hc?: number;        // HC adicional/soporte
  programmed_stop_id?: string;   // Referencia a programmed_stops
  work_order: string;            
  part_number_id: string;        // Referencia a part_numbers
  hourly_target: number;         // Meta calculada por hora
  hourly_target_fc?: number;     // Meta a capacidad completa
  daily_production: number;      // Producción real
  delta: number;                 // Diferencia producción vs meta
  downtime?: number;             // Tiempo muerto en minutos
  registered_at: Date;           // Timestamp del registro
  is_overtime?: boolean;         // Indicador de hora extra
}

export const productionEntryService = {
  async getLineConfiguration(lineId: string) {
    const { data, error } = await supabase
      .from('production_lines')
      .select(`
        *,
        value_stream:value_streams(*),
        part_numbers(*)
      `)
      .eq('id', lineId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getRunRates(partNumberCode: string, shift: number) {
    const { data, error } = await supabase
      .from('run_rates')
      .select('*')
      .eq('part_number_code', partNumberCode)
      .eq('shift', shift)
      .order('head_count');
    
    if (error) throw error;
    return data;
  },

  async getCurrentShiftEntries(lineId: string, date: string, shift: number) {
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

  async getAll() {
    // ... implementación
  },

  async getByLineAndDate(lineId: string, date: string) {
    // ... implementación
  },

  async create(entry: Omit<ProductionEntry, 'id'>) {
    // ... implementación
  },

  async update(id: string, entry: Partial<ProductionEntry>) {
    // ... implementación
  }
}; 