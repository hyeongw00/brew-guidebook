import { useSyncExternalStore } from "react";
import {
  createClient,
  type AuthError,
  type AuthChangeEvent,
  type Session,
  type SupabaseClient,
  type User,
} from "@supabase/supabase-js";
import { setAuthenticatedProfile, type Profile } from "./store";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isBrowser = typeof window !== "undefined";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabaseConfigError = isSupabaseConfigured
  ? null
  : "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.";

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(`[Supabase] ${supabaseConfigError}`);
}

function getBrowserStorage() {
  if (!isBrowser) return undefined;

  try {
    const testKey = "brew-guidebook:supabase-storage-test";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch (error) {
    console.warn("[Supabase] localStorage is unavailable; auth persistence may be limited.", error);
    return undefined;
  }
}

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        flowType: "pkce",
        storage: getBrowserStorage(),
        storageKey: "brew-guidebook-auth",
      },
    })
  : null;

export type SupabaseProfile = {
  id: string;
  email: string | null;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

const profileColumns = "id,email,username,full_name,avatar_url,bio,created_at,updated_at";

type AuthState = {
  isConfigured: boolean;
  isLoading: boolean;
  session: Session | null;
  user: User | null;
  profile: SupabaseProfile | null;
  error: string | null;
};

const initialAuthState: AuthState = {
  isConfigured: isSupabaseConfigured,
  isLoading: isSupabaseConfigured,
  session: null,
  user: null,
  profile: null,
  error: supabaseConfigError,
};

let authState = initialAuthState;
let hasInitializedAuth = false;
let oauthCallbackPromise: Promise<Session | null> | null = null;
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const emit = () => listeners.forEach((listener) => listener());

function setAuthState(next: Partial<AuthState>) {
  authState = { ...authState, ...next };
  emit();
}

function metadataString(user: User, key: string) {
  const value: unknown = user.user_metadata?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function usernameFromUser(user: User) {
  const emailPrefix = user.email?.split("@")[0] ?? "coffee_user";
  const name = metadataString(user, "name");
  const source = name ?? emailPrefix;
  const username = source
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 32);

  return username || emailPrefix;
}

function profileFromUser(user: User): SupabaseProfile {
  return {
    id: user.id,
    email: user.email ?? null,
    username: usernameFromUser(user),
    full_name: metadataString(user, "full_name") ?? metadataString(user, "name"),
    avatar_url: metadataString(user, "avatar_url") ?? metadataString(user, "picture"),
    bio: null,
  };
}

function toAppProfile(profile: SupabaseProfile): Partial<Profile> {
  return {
    username: profile.username ?? undefined,
    displayName: profile.full_name ?? profile.username ?? undefined,
    avatarUrl: profile.avatar_url ?? "",
    bio: profile.bio ?? "Google 계정으로 로그인했습니다.",
  };
}

export async function ensureProfile(user: User) {
  if (!supabase) return null;

  const profile = profileFromUser(user);
  if (import.meta.env.DEV) {
    console.info("[Supabase] Ensuring profile", {
      id: profile.id,
      email: profile.email,
      username: profile.username,
    });
  }

  const { data: upsertedProfile, error: upsertError } = await supabase
    .from("profiles")
    .upsert(profile, { onConflict: "id", ignoreDuplicates: false })
    .select(profileColumns)
    .single<SupabaseProfile>();

  if (upsertError) {
    console.error("[Supabase] Failed to upsert profile", upsertError);
    throw upsertError;
  }

  if (import.meta.env.DEV) {
    console.info("[Supabase] Profile upserted", upsertedProfile);
  }

  const { data: selectedProfile, error: selectError } = await supabase
    .from("profiles")
    .select(profileColumns)
    .eq("id", user.id)
    .single<SupabaseProfile>();

  if (selectError) {
    console.error("[Supabase] Failed to select profile after upsert", selectError);
    throw selectError;
  }

  return selectedProfile;
}

async function applySession(session: Session | null, ensuredProfile?: SupabaseProfile | null) {
  if (!session?.user) {
    setAuthenticatedProfile(null);
    setAuthState({
      isLoading: false,
      session: null,
      user: null,
      profile: null,
      error: null,
    });
    return;
  }

  setAuthState({
    isLoading: true,
    session,
    user: session.user,
    error: null,
  });

  try {
    const profile = ensuredProfile ?? (await ensureProfile(session.user));
    setAuthenticatedProfile(profile ? toAppProfile(profile) : null);
    setAuthState({
      isLoading: false,
      session,
      user: session.user,
      profile,
      error: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load Supabase profile.";
    console.error("[Supabase] Failed to ensure auth profile", error);
    setAuthenticatedProfile(toAppProfile(profileFromUser(session.user)));
    setAuthState({
      isLoading: false,
      session,
      user: session.user,
      profile: null,
      error: message,
    });
  }
}

export async function applySupabaseSession(
  session: Session | null,
  ensuredProfile?: SupabaseProfile | null,
) {
  await applySession(session, ensuredProfile);
}

function cleanOAuthCallbackUrl() {
  if (!isBrowser) return;

  window.history.replaceState({}, document.title, window.location.pathname);
}

function getOAuthCodeFromUrl() {
  if (!isBrowser) return null;

  return new URL(window.location.href).searchParams.get("code");
}

async function exchangeOAuthCodeFromUrl(): Promise<Session | null> {
  if (!supabase || !isBrowser) return null;

  const code = getOAuthCodeFromUrl();
  if (!code) return null;

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("[Supabase] Failed to exchange OAuth code for session", error);
    throw error;
  }

  return data.session;
}

export async function handleSupabaseOAuthCallback(): Promise<Session | null> {
  if (!supabase || !isBrowser) return null;
  if (!getOAuthCodeFromUrl()) return null;
  if (oauthCallbackPromise) return oauthCallbackPromise;

  oauthCallbackPromise = (async () => {
    console.info("[auth] handling oauth code");

    try {
      const callbackSession = await exchangeOAuthCodeFromUrl();
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("[Supabase] Failed to read session after OAuth callback", error);
        setAuthState({
          isLoading: false,
          error: error.message,
        });
        return callbackSession;
      }

      const restoredSession = data.session ?? callbackSession;
      if (restoredSession) {
        await applySession(restoredSession);
      }

      return restoredSession;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to handle OAuth callback.";
      setAuthState({
        isLoading: false,
        error: message,
      });
      return null;
    } finally {
      cleanOAuthCallbackUrl();
    }
  })().finally(() => {
    oauthCallbackPromise = null;
  });

  return oauthCallbackPromise;
}

export function initializeSupabaseAuth() {
  if (hasInitializedAuth) return;
  hasInitializedAuth = true;

  if (!supabase || !isBrowser) {
    setAuthState({ isLoading: false });
    return;
  }

  supabase.auth.onAuthStateChange((event: AuthChangeEvent, session) => {
    if (!["SIGNED_IN", "TOKEN_REFRESHED", "INITIAL_SESSION", "SIGNED_OUT"].includes(event)) {
      return;
    }
    if (import.meta.env.DEV) {
      console.info("[Supabase] Auth state changed", event, session?.user?.id ?? null);
    }
    globalThis.setTimeout(() => {
      void applySession(session);
    }, 0);
  });

  handleSupabaseOAuthCallback().then((callbackSession) => {
    if (callbackSession) {
      if (import.meta.env.DEV) {
        console.info("[Supabase] OAuth callback session restored", callbackSession.user.id);
      }
      void applySession(callbackSession);
      return;
    }

    void supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        setAuthState({
          isLoading: false,
          error: error.message,
        });
        return;
      }
      if (data.session?.user && import.meta.env.DEV) {
        console.info("[Supabase] Restored auth session", data.session.user.id);
      }
      void applySession(data.session);
    });
  });
}

export function useSupabaseAuth(): AuthState {
  return useSyncExternalStore(
    subscribe,
    () => authState,
    () => initialAuthState,
  );
}

export async function loginWithGoogle() {
  if (!supabase) {
    return { error: new Error(supabaseConfigError ?? "Supabase is not configured.") };
  }

  const redirectTo = isBrowser ? `${window.location.origin}/profile` : undefined;

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
    },
  });

  return { error };
}

export async function logout(): Promise<{ error: AuthError | Error | null }> {
  if (!supabase) {
    return { error: new Error(supabaseConfigError ?? "Supabase is not configured.") };
  }

  const { error } = await supabase.auth.signOut();
  if (!error) setAuthenticatedProfile(null);
  return { error };
}
