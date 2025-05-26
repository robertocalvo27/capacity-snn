import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dxmrspqgpgesetowcbgd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4bXJzcHFncGdlc2V0b3djYmdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTE5Mjk4MywiZXhwIjoyMDU0NzY4OTgzfQ.ALI1Ixte7yyhy3VBGrQ8136Q_LUg_6UIR8ILhC3zq4g'

const supabase = createClient(supabaseUrl, supabaseKey)

const runRates = [
  { part_number_code: '29508', rate: 88, head_count: 20 },
  { part_number_code: '88000', rate: 101, head_count: 20 },
  { part_number_code: '29375', rate: 108, head_count: 20 },
  { part_number_code: '66000', rate: 90, head_count: 20 },
  { part_number_code: '110000', rate: 117, head_count: 20 },
  { part_number_code: '24984', rate: 169, head_count: 20 },
  { part_number_code: '99000', rate: 119, head_count: 20 },
  { part_number_code: '15078', rate: 81, head_count: 20 },
  { part_number_code: '87015', rate: 103, head_count: 20 },
  { part_number_code: '86990', rate: 94, head_count: 20 },
  { part_number_code: '113001', rate: 76, head_count: 20 }
]

async function initRunRates() {
  console.log('🚀 Iniciando carga de Run Rates...')
  
  try {
    const { data, error } = await supabase
      .from('run_rates')
      .upsert(runRates)
      .select()
    
    if (error) throw error
    
    console.log('✅ Run Rates insertados:', data.length)
    console.log(data)
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

initRunRates() 