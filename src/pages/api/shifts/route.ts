import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('API: GET /api/shifts - Iniciando');
    
    if (!supabase) {
      console.error('API Error: Supabase client not initialized');
      return new Response(JSON.stringify({ error: 'Database connection error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('API: Ejecutando query a Supabase');
    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .order('start_time');

    console.log('API Response:', { data, error });

    if (error) {
      console.error('API Supabase Error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('API Unexpected Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 