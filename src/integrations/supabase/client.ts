// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lecaewgqxeaemlmapcky.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlY2Fld2dxeGVhZW1sbWFwY2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwMDA3MzgsImV4cCI6MjA1MDU3NjczOH0.irvJte8nrysjWtOaBDPS5rnrHxs4RX7QDuuyeTqkhfc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);