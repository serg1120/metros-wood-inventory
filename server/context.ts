import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';
import type { SupabaseClient, User } from '@supabase/supabase-js';

interface CreateContextOptions {
  supabase: SupabaseClient<Database>;
  user: User | null;
}

export async function createContextInner(opts: CreateContextOptions) {
  return {
    supabase: opts.supabase,
    user: opts.user,
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createContext(_opts: CreateNextContextOptions) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return createContextInner({
    supabase,
    user,
  });
}

export type Context = Awaited<ReturnType<typeof createContext>>;
