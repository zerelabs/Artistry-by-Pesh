import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Missing Supabase credentials. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.");
}

const isValidUrl = (url) => {
  try {
    return Boolean(new URL(url));
  } catch(e) {
    return false;
  }
}

const finalUrl = (supabaseUrl && isValidUrl(supabaseUrl)) ? supabaseUrl : 'https://placeholder.supabase.co';

export const supabase = createClient(
  finalUrl,
  supabaseAnonKey || 'placeholder-key'
);
