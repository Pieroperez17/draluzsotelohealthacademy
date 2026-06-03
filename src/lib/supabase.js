import { createClient } from '@supabase/supabase-js';

// Anon key is public by design (exposed in every visitor's browser)
const SUPABASE_URL = 'https://etpqawzqpaxlpdaopymi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0cHFhd3pxcGF4bHBkYW9weW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNjI3NTgsImV4cCI6MjA5NTczODc1OH0._zL9TTwf4GANKPBG1gNXymCZNoQ9CErX2TrZFHFfmS0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const isSupabaseReady = true;
