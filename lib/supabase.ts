import { createClient } from '@supabase/supabase-js'

// // log ตรวจสอบค่า env (ใช้เฉพาะตอน debug)
// console.log("SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
// console.log("SUPABASE_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0,10) + "...")

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
