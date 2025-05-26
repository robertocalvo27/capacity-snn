import { supabase } from '../lib/supabase.js';

export const initializeData = async () => {
  console.log('🚀 Iniciando carga de datos...');

  try {
    // 1. Value Streams
    console.log('\n1️⃣ Insertando Value Streams...');
    const valueStreams = [
      { id: 'ENT', name: 'Endoscopy', description: 'Endoscopy Value Stream' }
    ];

    const { error: vsError } = await supabase
      .from('value_streams')
      .upsert(valueStreams);
    
    if (vsError) throw vsError;
    console.log('✅ Value Streams insertados');

    // 2. Production Lines
    console.log('\n2️⃣ Insertando líneas de producción...');
    const productionLines = [
      { id: 'L07', name: 'Línea 07', value_stream_id: 'ENT', is_active: true },
      { id: 'L08', name: 'Línea 08', value_stream_id: 'ENT', is_active: true },
      { id: 'L09', name: 'Línea 09', value_stream_id: 'ENT', is_active: true },
      { id: 'L10', name: 'Línea 10', value_stream_id: 'ENT', is_active: true }
    ];

    const { error: linesError } = await supabase
      .from('production_lines')
      .upsert(productionLines);
    
    if (linesError) throw linesError;
    console.log('✅ Líneas insertadas');

    // 3. Part Numbers (ejemplo con algunos part numbers)
    console.log('\n3️⃣ Insertando Part Numbers...');
    const partNumbers = [
      {
        code: '13379',
        description: 'FAST-FIX 360 CURVE',
        run_rate_t1: 56,
        run_rate_t2: 52,
        run_rate_t3: 48,
        labor_std: 0.5,
        total_hc: 8,
        value_stream_id: 'ENT'
      },
      // Agregar más part numbers según necesites
    ];

    const { error: pnError } = await supabase
      .from('part_numbers')
      .upsert(partNumbers);
    
    if (pnError) throw pnError;
    console.log('✅ Part Numbers insertados');

    // 4. Programmed Stops
    console.log('\n4️⃣ Insertando Paros Programados...');
    const programmedStops = [
      { name: 'Desayuno / café', duration: 25, weekday: true, saturday: true },
      { name: 'Almuerzo / cena', duration: 35, weekday: true, saturday: false }
    ];

    const { error: stopsError } = await supabase
      .from('programmed_stops')
      .upsert(programmedStops);
    
    if (stopsError) throw stopsError;
    console.log('✅ Paros Programados insertados');

    console.log('\n✅ Inicialización completada exitosamente!');
    
  } catch (error) {
    console.error('\n❌ Error durante la inicialización:', error);
  }
};

// Ejecutar la inicialización
initializeData(); 