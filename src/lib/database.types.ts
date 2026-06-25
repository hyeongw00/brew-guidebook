import { mockRecipes, type Gear, type Recipe, type TasteProfile } from "./mock-data";
import type { SupabaseProfile } from "./supabase";

export type RecipeCategory = Recipe["category"];
export type RecipeTemperature = Recipe["temperature"];

export type DbRecipe = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  method: string | null;
  category: string | null;
  temperature: string | null;
  coffee_amount: string | null;
  water_amount: string | null;
  water_temp: string | null;
  brew_time: string | null;
  grind_size: string | null;
  roast_level: string | null;
  bean_id: string | null;
  bean_name: string | null;
  roastery: string | null;
  grinder: string | null;
  gear: unknown;
  steps: unknown;
  tasting_notes: unknown;
  tags: unknown;
  taste: unknown;
  is_public: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};

export type DbRecipeWithProfile = DbRecipe & {
  profiles?: SupabaseProfile | SupabaseProfile[] | null;
};

export type CreateRecipeInput = {
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  method?: string | null;
  category?: RecipeCategory | string | null;
  temperature?: RecipeTemperature | string | null;
  coffeeAmount?: number | string | null;
  waterAmount?: number | string | null;
  waterTemp?: number | string | null;
  brewTime?: string | null;
  grindSize?: string | null;
  roastLevel?: string | null;
  beanId?: string | null;
  beanName?: string | null;
  roastery?: string | null;
  grinder?: string | null;
  gear?: Gear[];
  steps?: string[];
  tastingNotes?: string[];
  tags?: string[];
  taste?: TasteProfile;
  isPublic?: boolean;
};

export type UpdateRecipeInput = Partial<CreateRecipeInput>;

export type RecipeInsertPayload = {
  user_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  method: string | null;
  category: string | null;
  temperature: string | null;
  coffee_amount: string | null;
  water_amount: string | null;
  water_temp: string | null;
  brew_time: string | null;
  grind_size: string | null;
  roast_level: string | null;
  bean_id: string | null;
  bean_name: string | null;
  roastery: string | null;
  grinder: string | null;
  gear: Gear[];
  steps: string[];
  tasting_notes: string[];
  tags: string[];
  taste: TasteProfile;
  is_public: boolean;
};

const fallbackRecipe = mockRecipes[0];
const fallbackTaste: TasteProfile = {
  acidity: 3,
  sweetness: 3,
  body: 3,
  bitterness: 2,
  cleanliness: 3,
};

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function asGearArray(value: unknown): Gear[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is Gear => {
    if (!item || typeof item !== "object") return false;
    const gear = item as Partial<Gear>;
    return (
      typeof gear.name === "string" &&
      ["dripper", "grinder", "kettle", "scale"].includes(String(gear.type))
    );
  });
}

function asTasteProfile(value: unknown): TasteProfile {
  if (!value || typeof value !== "object") return fallbackTaste;
  const taste = value as Partial<Record<keyof TasteProfile, unknown>>;
  return {
    acidity: typeof taste.acidity === "number" ? taste.acidity : fallbackTaste.acidity,
    sweetness: typeof taste.sweetness === "number" ? taste.sweetness : fallbackTaste.sweetness,
    body: typeof taste.body === "number" ? taste.body : fallbackTaste.body,
    bitterness: typeof taste.bitterness === "number" ? taste.bitterness : fallbackTaste.bitterness,
    cleanliness: typeof taste.cleanliness === "number" ? taste.cleanliness : fallbackTaste.cleanliness,
  };
}

function numberFromText(value: string | null | undefined) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function categoryFromText(value: string | null | undefined): RecipeCategory {
  return ["pourover", "espresso", "coldbrew", "latte", "other"].includes(String(value))
    ? (value as RecipeCategory)
    : "other";
}

function temperatureFromText(value: string | null | undefined): RecipeTemperature {
  return value === "iced" ? "iced" : "hot";
}

function profileFromJoin(row: DbRecipeWithProfile) {
  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
  return profile ?? null;
}

export function dbRecipeToRecipe(row: DbRecipeWithProfile): Recipe {
  const profile = profileFromJoin(row);
  const authorName = profile?.full_name ?? profile?.username ?? undefined;

  return {
    id: row.id,
    image: row.image_url || fallbackRecipe.image,
    title: row.title,
    authorId: row.user_id,
    author: authorName,
    beanId: row.bean_id ?? undefined,
    beanName: row.bean_name || "원두 미지정",
    roastery: row.roastery || "—",
    method: row.method || "기타",
    category: categoryFromText(row.category),
    temperature: temperatureFromText(row.temperature),
    dose: numberFromText(row.coffee_amount),
    water: numberFromText(row.water_amount),
    waterTemp: numberFromText(row.water_temp),
    grinder: row.grinder || "—",
    grindSize: row.grind_size || "—",
    brewTime: row.brew_time || "—",
    taste: asTasteProfile(row.taste),
    gear: asGearArray(row.gear),
    saves: 0,
    tastingNotes: asStringArray(row.tasting_notes),
    review: row.description || "—",
    steps: asStringArray(row.steps),
    createdAt: row.created_at ? row.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
  };
}

export function recipeInputToInsertPayload(input: CreateRecipeInput, userId: string): RecipeInsertPayload {
  return {
    user_id: userId,
    title: input.title.trim(),
    description: input.description ?? null,
    image_url: input.imageUrl ?? null,
    method: input.method ?? null,
    category: input.category ?? null,
    temperature: input.temperature ?? null,
    coffee_amount: input.coffeeAmount == null ? null : String(input.coffeeAmount),
    water_amount: input.waterAmount == null ? null : String(input.waterAmount),
    water_temp: input.waterTemp == null ? null : String(input.waterTemp),
    brew_time: input.brewTime ?? null,
    grind_size: input.grindSize ?? null,
    roast_level: input.roastLevel ?? null,
    bean_id: input.beanId ?? null,
    bean_name: input.beanName ?? null,
    roastery: input.roastery ?? null,
    grinder: input.grinder ?? null,
    gear: input.gear ?? [],
    steps: input.steps ?? [],
    tasting_notes: input.tastingNotes ?? [],
    tags: input.tags ?? [],
    taste: input.taste ?? fallbackTaste,
    is_public: input.isPublic ?? true,
  };
}

export function recipeInputToUpdatePayload(input: UpdateRecipeInput): Partial<RecipeInsertPayload> {
  const payload: Partial<RecipeInsertPayload> = {};
  if (input.title !== undefined) payload.title = input.title.trim();
  if (input.description !== undefined) payload.description = input.description;
  if (input.imageUrl !== undefined) payload.image_url = input.imageUrl;
  if (input.method !== undefined) payload.method = input.method;
  if (input.category !== undefined) payload.category = input.category;
  if (input.temperature !== undefined) payload.temperature = input.temperature;
  if (input.coffeeAmount !== undefined) payload.coffee_amount = input.coffeeAmount == null ? null : String(input.coffeeAmount);
  if (input.waterAmount !== undefined) payload.water_amount = input.waterAmount == null ? null : String(input.waterAmount);
  if (input.waterTemp !== undefined) payload.water_temp = input.waterTemp == null ? null : String(input.waterTemp);
  if (input.brewTime !== undefined) payload.brew_time = input.brewTime;
  if (input.grindSize !== undefined) payload.grind_size = input.grindSize;
  if (input.roastLevel !== undefined) payload.roast_level = input.roastLevel;
  if (input.beanId !== undefined) payload.bean_id = input.beanId;
  if (input.beanName !== undefined) payload.bean_name = input.beanName;
  if (input.roastery !== undefined) payload.roastery = input.roastery;
  if (input.grinder !== undefined) payload.grinder = input.grinder;
  if (input.gear !== undefined) payload.gear = input.gear;
  if (input.steps !== undefined) payload.steps = input.steps;
  if (input.tastingNotes !== undefined) payload.tasting_notes = input.tastingNotes;
  if (input.tags !== undefined) payload.tags = input.tags;
  if (input.taste !== undefined) payload.taste = input.taste;
  if (input.isPublic !== undefined) payload.is_public = input.isPublic;
  return payload;
}
