import { useSyncExternalStore } from "react";
import { mockRecipes, mockBeans, type Recipe, type Bean } from "./mock-data";

export type Profile = {
  username: string;
  bio: string;
  favoriteTaste: string;
  mainGrinder: string;
  mainDripper: string;
  followers: number;
  following: number;
};

type State = {
  recipes: Recipe[];
  beans: Bean[];
  savedIds: Set<string>;
  likedIds: Set<string>;
  followingUsers: Set<string>;
  profile: Profile;
};

let state: State = {
  recipes: mockRecipes,
  beans: mockBeans,
  savedIds: new Set<string>(["1"]),
  likedIds: new Set<string>(),
  followingUsers: new Set<string>(["wave_pour", "morning_cup"]),
  profile: {
    username: "barista_jun",
    bio: "매일 한 잔, 매일 다른 한 잔",
    favoriteTaste: "산미 · 깔끔함",
    mainGrinder: "Comandante C40",
    mainDripper: "Hario V60",
    followers: 312,
    following: 184,
  },
};

const listeners = new Set<() => void>();
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const emit = () => listeners.forEach((l) => l());
const setState = (updater: (prev: State) => State) => {
  state = updater(state);
  emit();
};

const getState = () => state;

function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(state),
  );
}

// ------------- Selectors -------------

export const useRecipes = () => useStore((s) => s.recipes);
export const useBeans = () => useStore((s) => s.beans);
export const useProfile = () => useStore((s) => s.profile);

export const useRecipe = (id: string) =>
  useStore((s) => s.recipes.find((r) => r.id === id));

export const useBean = (id: string) =>
  useStore((s) => s.beans.find((b) => b.id === id));

export const useRecipesByBean = (beanId: string) =>
  useStore((s) => s.recipes.filter((r) => r.beanId === beanId));

export const useSavedRecipes = () =>
  useStore((s) => s.recipes.filter((r) => s.savedIds.has(r.id)));

export const useMyRecipes = () =>
  useStore((s) => s.recipes.filter((r) => r.isMine));

export const useIsSaved = (id: string) => useStore((s) => s.savedIds.has(id));
export const useIsLiked = (id: string) => useStore((s) => s.likedIds.has(id));
export const useIsFollowing = (user: string) =>
  useStore((s) => s.followingUsers.has(user));

export const useSavedCount = () => useStore((s) => s.savedIds.size);

// ------------- Actions -------------

export function toggleSave(id: string) {
  setState((s) => {
    const next = new Set(s.savedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    // bump saves count on the recipe for visual feedback
    const recipes = s.recipes.map((r) =>
      r.id === id
        ? { ...r, saves: r.saves + (next.has(id) ? 1 : -1) }
        : r,
    );
    return { ...s, savedIds: next, recipes };
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
  recipe: Omit<Recipe, "id" | "createdAt" | "saves" | "isMine">,
): Recipe {
  const id = `u${Date.now()}`;
  const created: Recipe = {
    ...recipe,
    id,
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
  setState((s) => ({ ...s, profile: { ...s.profile, ...patch } }));
}

export { getState };
