import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ceswelpnaixvrablbcgx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlc3dlbHBuYWl4dnJhYmxiY2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1NjIxMTMsImV4cCI6MjA2OTEzODExM30.v0TkuTJuKpm8bgUAc-U6B-f-3Y5hfag-bpvKrEf40H8'

if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

export default supabase