// Supabase client stub — replace with real credentials when connecting to a live project
// import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Mock client for local development
export const supabase = {
  url: SUPABASE_URL,
  key: SUPABASE_ANON_KEY,
  from: (table: string) => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
  }),
  auth: {
    signIn: () => Promise.resolve({ user: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
  },
  storage: {
    from: (bucket: string) => ({
      upload: () => Promise.resolve({ data: null, error: null }),
      download: () => Promise.resolve({ data: null, error: null }),
      getPublicUrl: (path: string) => ({
        data: { publicUrl: `/mock/${path}` },
      }),
    }),
  },
};
