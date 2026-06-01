import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const isConfigured =
  supabaseUrl &&
  supabaseKey &&
  !supabaseUrl.includes('your-project') &&
  !supabaseKey.includes('your-publishable');

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const isSupabaseReady = isConfigured;
