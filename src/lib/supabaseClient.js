// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gbrqbfegebcqvfcducmf.supabase.co'; // ← あなたの Project URL に差し替え
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdicnFiZmVnZWJjcXZmY2R1Y21mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MjMwNjcsImV4cCI6MjA1OTM5OTA2N30.mUH90j35f9yWcD1M5DsctV_6rTaquILBFBkTSKNTv30'; // ← Supabaseのanonキーに差し替え

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
