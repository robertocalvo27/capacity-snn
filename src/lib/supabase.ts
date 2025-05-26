import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

// Load from environment variables using Vite's import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dxmrspqgpgesetowcbgd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4bXJzcHFncGdlc2V0b3djYmdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxOTI5ODMsImV4cCI6MjA1NDc2ODk4M30.ZPWyOF1id1IswevG4wSlhkopiafhTo2FSB99XLvNN64';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Optional: Add response interceptor for error handling
supabase.handleError = (error: any) => {
  console.error('Supabase error:', error);
  // Add your error handling logic here
}; 