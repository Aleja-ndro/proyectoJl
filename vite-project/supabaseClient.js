import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nduxzxwgsoywcndrrggf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kdXh6eHdnc295d2NuZHJyZ2dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1NjM1NTEsImV4cCI6MjA1OTEzOTU1MX0.rkjGjQnRxWhnGQSmYTgiu4SNZA9mkajD5BAZJvvsuM0';

export const supabase = createClient(supabaseUrl, supabaseKey);
