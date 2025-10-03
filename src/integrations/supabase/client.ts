import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://seqcczrzxoqlpqbxyxsz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlcWNjenJ6eG9xbHBxYnh5eHN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NjgzNjYsImV4cCI6MjA3NDA0NDM2Nn0.a09p913eEVld6G3L1ggLV_-zpzNKU4ZVtjm-ojzCLgY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    // Configurações adicionais de autenticação
    detectSessionInUrl: true,
  }
});