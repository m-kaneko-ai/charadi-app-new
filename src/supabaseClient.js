import { createClient } from '@supabase/supabase-js';

// あなたのSupabase URLとAPIキーを入力してください
const supabaseUrl = 'https://gbrqbfegebcqvfcducmf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdicnFiZmVnZWJjcXZmY2R1Y21mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MjMwNjcsImV4cCI6MjA1OTM5OTA2N30.mUH90j35f9yWcD1M5DsctV_6rTaquILBFBkTSKNTv30';

export const supabase = createClient(supabaseUrl, supabaseKey);