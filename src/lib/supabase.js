import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// Prefer anon JWT key (full DB access); fall back to publishable key for compatibility
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const isConfigured =
  supabaseUrl &&
  supabaseKey &&
  !supabaseUrl.includes('your-project');

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const isSupabaseReady = isConfigured;
