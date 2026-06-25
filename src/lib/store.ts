import { useEffect, useMemo, useSyncExternalStore } from "react";
import { mockRecipes, mockBeans, type Recipe, type Bean } from "./mock-data";

export type User = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  favoriteTasteProfile: string;
  mainGrinder: string;
  mainDripper: string;
  mainKettle: string;
  mainScale: string;
};

export type Profile = User & {
  followers: number;
  following: number;
};

type State = {
  hasHydratedPersistedState: boolean;
  users: Record<string, User>;
  authProfile: Profile | null;
  recipes: Recipe[];
  beans: Bean[];
  savedRecipeIds: Set<string>;
  likedIds: Set<string>;
  followingUsers: Set<string>;
  profile: Profile;
};

type PersistedState = {
  savedRecipeIds?: string[];
  savedIds?: string[];
  likedIds?: string[];
  followingUsers?: string[];
  profile?: Profile;
  userRecipes?: Recipe[];
  communityBeans?: Bean[];
  recipeSaveCounts?: Record<string, number>;
};

const STORAGE_KEY = "brew-guidebook:state:v1";
const CURRENT_USER_ID = "barista_jun";

const baseProfile: Profile = {
  id: CURRENT_USER_ID,
  username: "barista_jun",
  displayName: "barista_jun",
  avatarUrl: "",
  bio: "매일 한 잔, 매일 다른 한 잔",
  favoriteTasteProfile: "산미 · 깔끔함",
  mainGrinder: "Comandante C40",
  mainDripper: "Hario V60",
  mainKettle: "Fellow Stagg EKG",
  mainScale: "Timemore Black Mirror",
  followers: 312,
  following: 184,
};

const baseUsers: Record<string, User> = {
  [CURRENT_USER_ID]: baseProfile,
  morning_cup: {
    id: "morning_cup",
    username: "morning_cup",
    displayName: "morning_cup",
    avatarUrl: "",
    bio: "차갑고 달콤한 커피를 좋아해요",
    favoriteTasteProfile: "단맛 · 바디",
    mainGrinder: "1Zpresso JX-Pro",
    mainDripper: "Hario Mizudashi",
    mainKettle: "—",
    mainScale: "Acaia Pearl",
  },
  espresso_lab: {
    id: "espresso_lab",
    username: "espresso_lab",
    displayName: "espresso_lab",
    avatarUrl: "",
    bio: "에스프레소 추출 실험실",
    favoriteTasteProfile: "바디 · 산미",
    mainGrinder: "Mazzer Mini",
    mainDripper: "La Marzocco Linea Mini",
    mainKettle: "—",
    mainScale: "Acaia Lunar",
  },
  wave_pour: {
    id: "wave_pour",
    username: "wave_pour",
    displayName: "wave_pour",
    avatarUrl: "",
    bio: "푸어오버 레시피를 기록합니다",
    favoriteTasteProfile: "꽃향 · 단맛",
    mainGrinder: "Mahlkönig EK43",
    mainDripper: "Kalita Wave 185",
    mainKettle: "Brewista Artisan",
    mainScale: "—",
  },
  ice_americano: {
    id: "ice_americano",
    username: "ice_americano",
    displayName: "ice_americano",
    avatarUrl: "",
    bio: "아이스 커피 기준점을 찾는 중",
    favoriteTasteProfile: "고소함 · 깔끔함",
    mainGrinder: "Niche Zero",
    mainDripper: "Breville Dual Boiler",
    mainKettle: "—",
    mainScale: "Acaia Lunar",
  },
  press_master: {
    id: "press_master",
    username: "press_master",
    displayName: "press_master",
    avatarUrl: "",
    bio: "프렌치프레스와 긴 여운",
    favoriteTasteProfile: "바디 · 초콜릿",
    mainGrinder: "Baratza Encore",
    mainDripper: "French Press",
    mainKettle: "—",
    mainScale: "—",
  },
};

const baseSavedIds = ["1"];
const baseFollowingUsers = ["wave_pour", "morning_cup"];
const mockRecipeIds = new Set(mockRecipes.map((r) => r.id));
const mockBeanIds = new Set(mockBeans.map((b) => b.id));
const fallbackImage = mockRecipes[0]?.image ?? mockBeans[0]?.image ?? "";

const baseState: State = {
  hasHydratedPersistedState: false,
  users: baseUsers,
  authProfile: null,
  recipes: mockRecipes,
  beans: mockBeans,
  savedRecipeIds: new Set<string>(baseSavedIds),
  likedIds: new Set<string>(),
  followingUsers: new Set<string>(baseFollowingUsers),
  profile: baseProfile,
};

function isBrowserStorageAvailable() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readPersistedState(): PersistedState | null {
  if (!isBrowserStorageAvailable()) return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

function writePersistedState(next: State) {
  if (!isBrowserStorageAvailable()) return;

  const persisted: PersistedState = {
    savedRecipeIds: [...next.savedRecipeIds],
    likedIds: [...next.likedIds],
    followingUsers: [...next.followingUsers],
    profile: next.profile,
    userRecipes: next.recipes.filter((r) => r.isMine),
    communityBeans: next.beans.filter((b) => !mockBeanIds.has(b.id)),
    recipeSaveCounts: Object.fromEntries(next.recipes.map((r) => [r.id, r.saves])),
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
  } catch {
    // Ignore storage write failures so the app still behaves like the mock MVP.
  }
}

function arrayOrFallback<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? (value as T[]) : fallback;
}

function safeImage(image: string | undefined) {
  if (!image || image.startsWith("blob:")) return fallbackImage;
  return image;
}

function normalizeProfile(profile?: Partial<Profile> & { favoriteTaste?: string }): Profile {
  return {
    ...baseProfile,
    ...profile,
    id: baseProfile.id,
    displayName: profile?.displayName ?? profile?.username ?? baseProfile.displayName,
    avatarUrl: profile?.avatarUrl ?? baseProfile.avatarUrl,
    favoriteTasteProfile:
      profile?.favoriteTasteProfile ?? profile?.favoriteTaste ?? baseProfile.favoriteTasteProfile,
    mainKettle: profile?.mainKettle ?? baseProfile.mainKettle,
    mainScale: profile?.mainScale ?? baseProfile.mainScale,
  };
}

function normalizeRecipe(recipe: Recipe & { author?: string; authorName?: string }): Recipe {
  const authorId = recipe.authorId ?? (recipe.isMine ? CURRENT_USER_ID : recipe.author);
  return {
    ...recipe,
    authorId: authorId || "unknown",
    author: undefined,
    image: safeImage(recipe.image),
  };
}

function sanitizeBean(bean: Bean): Bean {
  return { ...bean, image: safeImage(bean.image) };
}

function createStateFromPersisted(persisted: PersistedState): State {
  const saveCounts = persisted.recipeSaveCounts ?? {};
  const savedRecipeIds = persisted.savedRecipeIds ?? persisted.savedIds;
  const profile = normalizeProfile(persisted.profile);
  const users = {
    ...baseUsers,
    [CURRENT_USER_ID]: profile,
  };
  const userRecipes = arrayOrFallback<Recipe>(persisted.userRecipes, []).filter(
    (r) => r.isMine && !mockRecipeIds.has(r.id),
  ).map((r) => normalizeRecipe(r));
  const communityBeans = arrayOrFallback<Bean>(persisted.communityBeans, []).filter(
    (b) => !mockBeanIds.has(b.id),
  ).map(sanitizeBean);

  return {
    hasHydratedPersistedState: true,
    users,
    authProfile: null,
    recipes: [
      ...userRecipes,
      ...mockRecipes.map((r) => ({
        ...r,
        saves: typeof saveCounts[r.id] === "number" ? saveCounts[r.id] : r.saves,
      })),
    ],
    beans: [...communityBeans, ...mockBeans],
    savedRecipeIds: new Set(arrayOrFallback<string>(savedRecipeIds, baseSavedIds)),
    likedIds: new Set(arrayOrFallback<string>(persisted.likedIds, [])),
    followingUsers: new Set(
      arrayOrFallback<string>(persisted.followingUsers, baseFollowingUsers),
    ),
    profile,
  };
}

let state: State = baseState;
let hasHydratedPersistedState = false;

const listeners = new Set<() => void>();
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const emit = () => listeners.forEach((l) => l());
const setState = (updater: (prev: State) => State) => {
  state = updater(state);
  writePersistedState(state);
  emit();
};

const getState = () => state;

function hydratePersistedState() {
  if (hasHydratedPersistedState) return;
  hasHydratedPersistedState = true;

  const persisted = readPersistedState();
  if (!persisted) {
    state = { ...state, hasHydratedPersistedState: true };
    emit();
    return;
  }

  state = createStateFromPersisted(persisted);
  emit();
}

function useStore<T>(selector: (s: State) => T): T {
  useEffect(() => {
    hydratePersistedState();
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(state),
  );
}

// ------------- Selectors -------------

export const useRecipes = () => useStore((s) => s.recipes);
export const useBeans = () => useStore((s) => s.beans);
export const useProfile = () => useStore((s) => s.authProfile ?? s.profile);
export const useHasHydratedPersistedState = () =>
  useStore((s) => s.hasHydratedPersistedState);
export const useUsers = () => useStore((s) => s.users);
export const useUser = (id: string | undefined) =>
  useStore((s) => (id ? s.users[id] : undefined));
export const useRecipeAuthor = (recipe: Recipe | undefined) => useUser(recipe?.authorId);

export const useRecipe = (id: string) =>
  useStore((s) => s.recipes.find((r) => r.id === id));

export const useBean = (id: string) =>
  useStore((s) => s.beans.find((b) => b.id === id));

export const useRecipesByBean = (beanId: string) => {
  const recipes = useRecipes();
  return useMemo(
    () => recipes.filter((r) => r.beanId === beanId),
    [recipes, beanId],
  );
};

export const useSavedRecipeIds = () => useStore((s) => s.savedRecipeIds);

export const useSavedRecipes = () => {
  const recipes = useRecipes();
  const savedRecipeIds = useSavedRecipeIds();
  return useMemo(
    () => recipes.filter((r) => savedRecipeIds.has(r.id)),
    [recipes, savedRecipeIds],
  );
};

export const useMyRecipes = () => {
  const recipes = useRecipes();
  return useMemo(
    () => recipes.filter((r) => r.isMine || r.authorId === CURRENT_USER_ID),
    [recipes],
  );
};

export const useIsSaved = (id: string) => useStore((s) => s.savedRecipeIds.has(id));
export const useIsLiked = (id: string) => useStore((s) => s.likedIds.has(id));
export const useIsFollowing = (user: string) =>
  useStore((s) => s.followingUsers.has(user));
export const useFollowingUsers = () => useStore((s) => s.followingUsers);

export const useSavedCount = () => useStore((s) => s.savedRecipeIds.size);

// ------------- Actions -------------

export function toggleSave(id: string) {
  setState((s) => {
    const next = new Set(s.savedRecipeIds);
    const wasSaved = next.has(id);
    if (wasSaved) next.delete(id);
    else next.add(id);
    // bump saves count on the recipe for visual feedback
    const recipes = s.recipes.map((r) =>
      r.id === id
        ? { ...r, saves: Math.max(0, r.saves + (wasSaved ? -1 : 1)) }
        : r,
    );
    return { ...s, savedRecipeIds: next, recipes };
  });
}

export function toggleLike(id: string) {
  setState((s) => {
    const next = new Set(s.likedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return { ...s, likedIds: next };
  });
}

export function toggleFollow(user: string) {
  setState((s) => {
    const next = new Set(s.followingUsers);
    if (next.has(user)) next.delete(user);
    else next.add(user);
    return { ...s, followingUsers: next };
  });
}

export function addRecipe(
  recipe: Omit<Recipe, "id" | "createdAt" | "saves" | "isMine" | "authorId" | "author">,
): Recipe {
  const id = `u${Date.now()}`;
  const created: Recipe = {
    ...recipe,
    id,
    authorId: CURRENT_USER_ID,
    createdAt: new Date().toISOString().slice(0, 10),
    saves: 0,
    isMine: true,
  };
  setState((s) => ({ ...s, recipes: [created, ...s.recipes] }));
  return created;
}

export function addBean(
  bean: Omit<Bean, "id" | "community"> & { community?: boolean },
): Bean {
  const existing = state.beans.find(
    (b) => b.name.toLowerCase() === bean.name.toLowerCase(),
  );
  if (existing) return existing;
  const id = `ub${Date.now()}`;
  const created: Bean = { ...bean, id, community: true };
  setState((s) => ({ ...s, beans: [created, ...s.beans] }));
  return created;
}

export function updateProfile(patch: Partial<Profile>) {
  setState((s) => {
    const previousProfile = s.authProfile ?? s.profile;
    const profile = normalizeProfile({ ...previousProfile, ...patch });
    const localProfile = s.authProfile ? s.profile : profile;
    return {
      ...s,
      profile: localProfile,
      authProfile: s.authProfile ? profile : null,
      users: {
        ...s.users,
        [CURRENT_USER_ID]: profile,
      },
    };
  });
}

export function setAuthenticatedProfile(profile: Partial<Profile> | null) {
  setState((s) => {
    if (!profile) {
      return {
        ...s,
        authProfile: null,
        users: {
          ...s.users,
          [CURRENT_USER_ID]: s.profile,
        },
      };
    }

    const authProfile = normalizeProfile({
      ...s.profile,
      ...profile,
      id: CURRENT_USER_ID,
    });

    return {
      ...s,
      authProfile,
      users: {
        ...s.users,
        [CURRENT_USER_ID]: authProfile,
      },
    };
  });
}

export { CURRENT_USER_ID, getState };
