import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dxmrspqgpgesetowcbgd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4bXJzcHFncGdlc2V0b3djYmdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTE5Mjk4MywiZXhwIjoyMDU0NzY4OTgzfQ.ALI1Ixte7yyhy3VBGrQ8136Q_LUg_6UIR8ILhC3zq4g'

const supabase = createClient(supabaseUrl, supabaseKey)

const partNumbers = [
  { code: '29508', description: 'Part Number 29508', labor_std: 0.88, total_hc: 6, value_stream_id: 'SM' },
  { code: '88000', description: 'Part Number 88000', labor_std: 0.70, total_hc: 6, value_stream_id: 'SM' },
  { code: '29375', description: 'Part Number 29375', labor_std: 0.55, total_hc: 6, value_stream_id: 'SM' },
  { code: '66000', description: 'Part Number 66000', labor_std: 0.327, total_hc: 6, value_stream_id: 'SM' },
  { code: '110000', description: 'Part Number 110000', labor_std: 0.787, total_hc: 6, value_stream_id: 'SM' },
  { code: '24984', description: 'Part Number 24984', labor_std: 0.486, total_hc: 6, value_stream_id: 'SM' },
  { code: '99000', description: 'Part Number 99000', labor_std: 0.594, total_hc: 6, value_stream_id: 'SM' },
  { code: '15078', description: 'Part Number 15078', labor_std: 0.565, total_hc: 6, value_stream_id: 'SM' },
  { code: '87015', description: 'Part Number 87015', labor_std: 0.533, total_hc: 6, value_stream_id: 'SM' },
  { code: '86990', description: 'Part Number 86990', labor_std: 0.565, total_hc: 6, value_stream_id: 'SM' },
  { code: '113001', description: 'Part Number 113001', labor_std: 0.937, total_hc: 6, value_stream_id: 'SM' }
]

async function initPartNumbers() {
  console.log('🚀 Iniciando carga de Part Numbers...')
  
  try {
    const { data, error } = await supabase
      .from('part_numbers')
      .upsert(partNumbers)
      .select()
    
    if (error) throw error
    
    console.log('✅ Part Numbers insertados:', data.length)
    console.log(data)
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

initPartNumbers() 