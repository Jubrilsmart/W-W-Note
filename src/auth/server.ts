import { env } from "@/config/env";
import { createServerClient, type CookieMethodsServer } from "@supabase/ssr"; // 💡 Import the explicit type
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  const client = createServerClient(
    env.supabase.url,
    env.supabase.anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Safe to ignore in pure Server Components if middleware handles sync
          }
        },
      } as CookieMethodsServer, // 💡 Typecast this line to satisfy the internal typescript validator
    }
  );
  return client;
}


export async function getUser() {
  const { auth } = await createClient();

  const userObject = await auth.getUser()
  if (userObject.error) {
    console.error(userObject.error);
    return null;
  }
  return userObject.data.user;
}