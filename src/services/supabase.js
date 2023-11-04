import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://ozbjabczccjuytqtofzc.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96YmphYmN6Y2NqdXl0cXRvZnpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk0MjI5NzIsImV4cCI6MjAwNDk5ODk3Mn0.99iCvbybEtYz_qArFkSP1yuVoMuxaKZNMmzp8cGfS2c';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
