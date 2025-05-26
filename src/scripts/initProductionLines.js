import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dxmrspqgpgesetowcbgd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4bXJzcHFncGdlc2V0b3djYmdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTE5Mjk4MywiZXhwIjoyMDU0NzY4OTgzfQ.ALI1Ixte7yyhy3VBGrQ8136Q_LUg_6UIR8ILhC3zq4g'

const supabase = createClient(supabaseUrl, supabaseKey)

const productionLines = [
  // ENT - Endoscopy
  { id: 'L06', name: 'Línea 06', value_stream_id: 'ENT', is_active: true },
  { id: 'L07', name: 'Línea 07', value_stream_id: 'ENT', is_active: true },
  { id: 'L10', name: 'Línea 10 y 11 (Rapid Rhino)', value_stream_id: 'ENT', is_active: true },

  // JR - Joint Repair
  { id: 'L15', name: 'Línea 15', value_stream_id: 'JR', is_active: true },
  { id: 'L16', name: 'Línea 16', value_stream_id: 'JR', is_active: true },
  { id: 'L18', name: 'Línea 18', value_stream_id: 'JR', is_active: true },
  { id: 'L08C1', name: 'L08 Celda 1', value_stream_id: 'JR', is_active: true },
  { id: 'L08C2', name: 'L08 Celda 2', value_stream_id: 'JR', is_active: true },
  { id: 'L08C3', name: 'L08 Celda 3', value_stream_id: 'JR', is_active: true },
  { id: 'L08C4', name: 'L08 Celda 4', value_stream_id: 'JR', is_active: true },
  { id: 'L08C5', name: 'L08 Celda 5', value_stream_id: 'JR', is_active: true },
  { id: 'L08C6', name: 'L08 Celda 6', value_stream_id: 'JR', is_active: true },
  { id: 'L08C7', name: 'L08 Celda 7', value_stream_id: 'JR', is_active: true },
  { id: 'L08C8', name: 'L08 Celda 8', value_stream_id: 'JR', is_active: true },
  { id: 'L08C9', name: 'L08 Celda 9', value_stream_id: 'JR', is_active: true },
  { id: 'L08C10', name: 'L08 Celda 10', value_stream_id: 'JR', is_active: true },
  { id: 'L08C11', name: 'L08 Celda 11', value_stream_id: 'JR', is_active: true },
  { id: 'L08C12', name: 'L08 Celda 12', value_stream_id: 'JR', is_active: true },
  { id: 'L08C13', name: 'L08 Celda 13', value_stream_id: 'JR', is_active: true },
  { id: 'L08C14', name: 'L08 Celda 14', value_stream_id: 'JR', is_active: true },

  // SM - Sports Medicine
  { id: 'L02', name: 'Línea 02', value_stream_id: 'SM', is_active: true },
  { id: 'L03', name: 'Línea 03', value_stream_id: 'SM', is_active: true },
  { id: 'L04', name: 'Línea 04', value_stream_id: 'SM', is_active: true },
  { id: 'L05', name: 'Línea 05', value_stream_id: 'SM', is_active: true },
  { id: 'L09', name: 'Línea 09', value_stream_id: 'SM', is_active: true },
  { id: 'L17', name: 'Línea 17', value_stream_id: 'SM', is_active: true },

  // FIX - Fixation
  { id: 'L12', name: 'Línea 12', value_stream_id: 'FIX', is_active: true },
  { id: 'L13', name: 'Línea 13', value_stream_id: 'FIX', is_active: true },
  { id: 'L14', name: 'Línea 14', value_stream_id: 'FIX', is_active: true },
  { id: 'L14.5', name: 'Línea 14.5', value_stream_id: 'FIX', is_active: true },
  { id: 'CER3', name: 'Cer 3', value_stream_id: 'FIX', is_active: true }
]

async function initProductionLines() {
  console.log('🚀 Iniciando carga de Production Lines...')
  
  try {
    const { data, error } = await supabase
      .from('production_lines')
      .upsert(productionLines)
      .select()
    
    if (error) throw error
    
    console.log('✅ Production Lines insertadas:', data.length)
    console.log(data)
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

initProductionLines() 