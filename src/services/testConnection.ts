import { supabase } from '../lib/supabase';
import { productionService } from './productionService';
import { targetAdjustmentService } from './targetAdjustmentService';

export const runTests = async () => {
  console.log('🏃 Iniciando pruebas de conexión...');

  try {
    // 1. Probar conexión básica
    console.log('\n1️⃣ Probando conexión a Supabase...');
    const { data: valueStreams, error: vsError } = await supabase
      .from('value_streams')
      .select('*');
    
    if (vsError) throw vsError;
    console.log('✅ Value Streams encontrados:', valueStreams.length);
    console.log(valueStreams);

    // 2. Probar Part Numbers
    console.log('\n2️⃣ Probando Part Numbers...');
    const { data: partNumbers, error: pnError } = await supabase
      .from('part_numbers')
      .select('*');
    
    if (pnError) throw pnError;
    console.log('✅ Part Numbers encontrados:', partNumbers.length);
    console.log(partNumbers[0]); // Muestra el primer part number como ejemplo

    // 3. Probar Run Rates
    console.log('\n3️⃣ Probando Run Rates...');
    const { data: runRates, error: rrError } = await supabase
      .from('run_rates')
      .select('*')
      .limit(5);
    
    if (rrError) throw rrError;
    console.log('✅ Run Rates encontrados:', runRates.length);
    console.log(runRates);

    // 4. Probar Tipos de Causa
    console.log('\n4️⃣ Probando Tipos de Causa...');
    const { data: causeTypes, error: ctError } = await supabase
      .from('cause_types')
      .select('*');
    
    if (ctError) throw ctError;
    console.log('✅ Tipos de Causa encontrados:', causeTypes.length);
    console.log(causeTypes);

    // 5. Probar Causas Generales
    console.log('\n5️⃣ Probando Causas Generales...');
    const { data: generalCauses, error: gcError } = await supabase
      .from('general_causes')
      .select(`
        *,
        cause_types:cause_type_id (name)
      `);
    
    if (gcError) throw gcError;
    console.log('✅ Causas Generales encontradas:', generalCauses.length);
    console.log('Ejemplo de causas por tipo:');
    const causesByType = generalCauses.reduce((acc, curr) => {
      const type = curr.cause_type_id;
      if (!acc[type]) acc[type] = [];
      acc[type].push(curr.name);
      return acc;
    }, {});
    console.log(causesByType);

    // 6. Probar servicio de producción con causas
    console.log('\n6️⃣ Probando productionService con causas...');
    const testEntry = {
      id: `test-${Date.now()}`,
      line_id: 'L07',
      shift: 1,
      entry_date: new Date().toISOString().split('T')[0],
      hour: `${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')}`,
      real_head_count: 6,
      additional_hc: 0,
      work_order: 'TEST-001',
      part_number_code: '13379',
      hourly_target: 56,
      daily_production: 50,
      delta: -6,
      downtime: 30
    };

    const savedEntry = await productionService.saveProductionEntry(testEntry);
    console.log('✅ Entrada de prueba guardada:', savedEntry);

    // 7. Probar registro de causas
    console.log('\n7️⃣ Probando registro de causas...');
    
    // Primero obtenemos un ID válido de causa general
    const { data: generalCause } = await supabase
      .from('general_causes')
      .select('id, name')
      .eq('cause_type_id', 'MQ')
      .eq('name', 'Falla de equipo (línea detenida)')
      .single();

    if (!generalCause) {
      throw new Error('No se encontró la causa general esperada');
    }

    const testCause = {
      production_entry_id: savedEntry.id,
      cause_type_id: 'MQ',
      general_cause_id: generalCause.id,
      specific_details: 'Falla en sensor X-123 durante pruebas',
      affected_units: 6,
      downtime_minutes: 30
    };

    const { data: savedCause, error: causeError } = await supabase
      .from('production_causes')
      .insert(testCause)
      .select()
      .single();

    if (causeError) {
      throw causeError;
    }

    console.log('✅ Causa registrada:', savedCause);

    // 8. Verificar la relación entre entrada y causa
    console.log('\n8️⃣ Verificando relación entrada-causa...');
    const { data: entryWithCauses, error: relationError } = await supabase
      .from('production_entries')
      .select(`
        *,
        production_causes (
          *,
          cause_types (name),
          general_causes (name)
        )
      `)
      .eq('id', savedEntry.id)
      .single();

    if (relationError) {
      throw relationError;
    }

    console.log('✅ Entrada con sus causas:', entryWithCauses);

    // 9. Probar ajustes de meta
    console.log('\n9️⃣ Probando ajustes de meta...');
    
    // Primero insertamos un factor de corrección con ID único
    const testFactor = {
      id: `NEW_STAFF_${Date.now()}`, // ID único usando timestamp
      name: 'Personal Nuevo',
      description: 'Ajuste por personal en entrenamiento'
    };

    const { data: savedFactor, error: factorError } = await supabase
      .from('correction_factors')
      .insert(testFactor)
      .select()
      .single();

    if (factorError) throw factorError;
    console.log('✅ Factor de corrección guardado:', savedFactor);

    // Luego creamos un ajuste usando el nuevo ID
    const testAdjustment = {
      entry_date: new Date().toISOString().split('T')[0],
      shift: 1,
      line_id: 'L07',
      correction_factor_id: testFactor.id, // Usamos el nuevo ID
      description: 'Ajuste por 3 operadores nuevos en entrenamiento',
      adjustment_percentage: 5,
      apply_to_full_shift: true
    };

    const { data: savedAdjustment, error: adjustmentError } = await supabase
      .from('target_adjustments')
      .insert(testAdjustment)
      .select()
      .single();

    if (adjustmentError) throw adjustmentError;
    console.log('✅ Ajuste guardado:', savedAdjustment);

    // Probamos el cálculo de meta ajustada
    const targetWithAdjustment = await targetAdjustmentService.calculateAdjustedTarget(
      56, // meta original
      testAdjustment.entry_date,
      testAdjustment.shift,
      testAdjustment.line_id,
      '18:34'
    );

    console.log('✅ Meta original: 56');
    console.log('✅ Meta ajustada por factor de corrección:', targetWithAdjustment);

    // 10. Probar paros programados
    console.log('\n🔟 Probando paros programados...');
    
    // Primero insertamos algunos paros programados con nombres únicos
    const testStops = [
      {
        name: `Desayuno / café ${Date.now()}`,  // Nombre único
        duration: 25,
        weekday: true,
        saturday: true
      },
      {
        name: `Almuerzo / cena ${Date.now()}`,  // Nombre único
        duration: 35,
        weekday: true,
        saturday: false
      },
      {
        name: `Ejercicios ${Date.now()}`,  // Nombre único
        duration: 5,
        weekday: true,
        saturday: true
      }
    ];

    const { data: savedStops, error: stopsError } = await supabase
      .from('programmed_stops')
      .insert(testStops)
      .select();

    if (stopsError) throw stopsError;
    console.log('✅ Paros programados guardados:', savedStops);

    // Asociamos un paro a la entrada de producción de prueba
    const { data: savedProdStop, error: prodStopError } = await supabase
      .from('production_programmed_stops')
      .insert({
        production_entry_id: savedEntry.id,
        programmed_stop_id: savedStops[0].id  // Asociamos el desayuno
      })
      .select();

    if (prodStopError) throw prodStopError;
    console.log('✅ Paro asociado a entrada:', savedProdStop);

    // Verificamos el cálculo de la meta ajustada considerando el tiempo disponible
    const availableTime = 60 - savedStops[0].duration; // 60 - 25 = 35 minutos
    const targetWithStops = Math.floor(56 * (availableTime / 60)); // 56 es la meta original
    console.log('✅ Meta original por hora:', 56);
    console.log('✅ Meta ajustada por tiempo disponible:', targetWithStops);

    // 11. Probar cálculo completo de meta efectiva
    console.log('\n1️⃣1️⃣ Probando cálculo completo de meta efectiva...');
    
    const testCompleteEntry = {
      id: `test-complete-${Date.now()}`,
      line_id: 'L07',
      shift: 1,
      entry_date: new Date().toISOString().split('T')[0],
      hour: `${new Date().getHours()}:${String(new Date().getMinutes() + 1).padStart(2, '0')}`, // Sumamos 1 minuto
      real_head_count: 6,
      additional_hc: 0,
      work_order: 'TEST-001',
      part_number_code: '13379',
      hourly_target: 56,
      daily_production: 50,
      delta: -6
    };

    const completeEntry = await productionService.saveProductionEntry(testCompleteEntry);
    console.log('✅ Entrada guardada con cálculos completos:', {
      meta_original: testCompleteEntry.hourly_target,
      meta_efectiva: completeEntry.hourly_target,
      minutos_disponibles: completeEntry.available_minutes,
      porcentaje_ajuste: completeEntry.target_adjustment_percentage
    });

    // Verificar que los cálculos sean coherentes
    console.log('\nVerificación de cálculos:');
    console.log('- Tiempo disponible:', 
      completeEntry.available_minutes <= 60 ? '✅' : '❌', 
      `${completeEntry.available_minutes} minutos`
    );
    console.log('- Porcentaje de ajuste:', 
      completeEntry.target_adjustment_percentage !== null ? '✅' : '❌',
      `${completeEntry.target_adjustment_percentage}%`
    );
    console.log('- Meta efectiva es menor que la original:', 
      completeEntry.hourly_target <= testCompleteEntry.hourly_target ? '✅' : '❌',
      `${completeEntry.hourly_target} vs ${testCompleteEntry.hourly_target}`
    );

    console.log('\n✅ Todas las pruebas completadas exitosamente!');
    
  } catch (error) {
    console.error('\n❌ Error durante las pruebas:', error);
  }
};

// Ejecutar las pruebas
runTests(); 