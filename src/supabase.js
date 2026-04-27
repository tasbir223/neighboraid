import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://jwccariuobcniszfbhdi.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3Y2Nhcml1b2JjbmlzemZiaGRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MjE5NjcsImV4cCI6MjA5MjI5Nzk2N30.Wll6Uxeyjvouj7lt8uBrVf3hg_HnxT6BjFbthj57WCw'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
