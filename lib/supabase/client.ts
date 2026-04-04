import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Browser client — usa a Anon Key (segura para o cliente).
 * Acesso restrito pelas RLS policies do Supabase.
 */
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
