import { supabase } from "./supabase";
import {
  dbRecipeToRecipe,
  recipeInputToInsertPayload,
  recipeInputToUpdatePayload,
  type CreateRecipeInput,
  type DbRecipeWithProfile,
  type UpdateRecipeInput,
} from "./database.types";
import type { Recipe } from "./mock-data";

const recipeSelect = `
  id,user_id,title,description,image_url,method,category,temperature,
  coffee_amount,water_amount,water_temp,brew_time,grind_size,roast_level,
  bean_id,bean_name,roastery,grinder,gear,steps,tasting_notes,tags,taste,
  is_public,created_at,updated_at,
  profiles:profiles(id,email,username,full_name,avatar_url,bio,created_at,updated_at)
`;

function requireSupabase() {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }
  return supabase;
}

function logAndThrow(context: string, error: unknown): never {
  console.error(`[Supabase recipes] ${context}`, error);
  throw error;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function getRecipes(): Promise<Recipe[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("recipes")
    .select(recipeSelect)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error) logAndThrow("Failed to fetch recipes", error);
  return ((data ?? []) as DbRecipeWithProfile[]).map(dbRecipeToRecipe);
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  if (!isUuid(id)) return null;

  const client = requireSupabase();
  const { data, error } = await client
    .from("recipes")
    .select(recipeSelect)
    .eq("id", id)
    .maybeSingle();

  if (error) logAndThrow(`Failed to fetch recipe ${id}`, error);
  return data ? dbRecipeToRecipe(data as DbRecipeWithProfile) : null;
}

export async function getRecipesByUser(userId: string): Promise<Recipe[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("recipes")
    .select(recipeSelect)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) logAndThrow(`Failed to fetch recipes for user ${userId}`, error);
  return ((data ?? []) as DbRecipeWithProfile[]).map(dbRecipeToRecipe);
}

export async function createRecipe(input: CreateRecipeInput, userId: string): Promise<Recipe> {
  const client = requireSupabase();
  const payload = recipeInputToInsertPayload(input, userId);
  const { data, error } = await client
    .from("recipes")
    .insert(payload)
    .select(recipeSelect)
    .single();

  if (error) logAndThrow("Failed to create recipe", error);
  return dbRecipeToRecipe(data as DbRecipeWithProfile);
}

export async function updateRecipe(
  id: string,
  input: UpdateRecipeInput,
  userId: string,
): Promise<Recipe> {
  const client = requireSupabase();
  const payload = recipeInputToUpdatePayload(input);
  const { data, error } = await client
    .from("recipes")
    .update(payload)
    .eq("id", id)
    .eq("user_id", userId)
    .select(recipeSelect)
    .single();

  if (error) logAndThrow(`Failed to update recipe ${id}`, error);
  return dbRecipeToRecipe(data as DbRecipeWithProfile);
}

export async function deleteRecipe(id: string, userId: string): Promise<void> {
  const client = requireSupabase();
  const { error } = await client
    .from("recipes")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) logAndThrow(`Failed to delete recipe ${id}`, error);
}
