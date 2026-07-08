
export const env = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
  },
  AIApi: {
    key: process.env.NEXT_PUBLIC_AI_KEY as string,
  },
  database: {
    url: process.env.NEXT_PUBLIC_DATABASE_URL as string,
  },
}