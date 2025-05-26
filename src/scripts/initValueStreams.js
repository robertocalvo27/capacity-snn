import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dxmrspqgpgesetowcbgd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4bXJzcHFncGdlc2V0b3djYmdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTE5Mjk4MywiZXhwIjoyMDU0NzY4OTgzfQ.ALI1Ixte7yyhy3VBGrQ8136Q_LUg_6UIR8ILhC3zq4g'

const supabase = createClient(supabaseUrl, supabaseKey)

const valueStreams = [
  { id: 'ENT', name: 'Endoscopy', description: 'Endoscopy Value Stream' },
  { id: 'JR', name: 'Joint Repair', description: 'Joint Repair Value Stream' },
  { id: 'SM', name: 'Sports Medicine', description: 'Sports Medicine Value Stream' },
  { id: 'FIX', name: 'Fixation', description: 'Fixation Value Stream' },
  { id: 'EA', name: 'External Arthroscopy', description: 'External Arthroscopy Value Stream' },
  { id: 'APO', name: 'APO', description: 'APO Value Stream' },
  { id: 'WND', name: 'Wound', description: 'Wound Value Stream' }
]

async function initValueStreams() {
  console.log('🚀 Iniciando carga de Value Streams...')
  
  try {
    const { data, error } = await supabase
      .from('value_streams')
      .upsert(valueStreams)
      .select()
    
    if (error) throw error
    
    console.log('✅ Value Streams insertados:', data.length)
    console.log(data)
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

initValueStreams() 