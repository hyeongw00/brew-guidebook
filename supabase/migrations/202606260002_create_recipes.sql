create extension if not exists pgcrypto;

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  image_url text,
  method text,
  category text,
  temperature text,
  coffee_amount text,
  water_amount text,
  water_temp text,
  brew_time text,
  grind_size text,
  roast_level text,
  bean_id text,
  bean_name text,
  roastery text,
  grinder text,
  gear jsonb default '[]'::jsonb,
  steps jsonb default '[]'::jsonb,
  tasting_notes jsonb default '[]'::jsonb,
  tags jsonb default '[]'::jsonb,
  taste jsonb default '{}'::jsonb,
  is_public boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_recipes_updated_at on public.recipes;
create trigger set_recipes_updated_at
before update on public.recipes
for each row
execute function public.set_updated_at();

alter table public.recipes enable row level security;

drop policy if exists "Public recipes are viewable by everyone" on public.recipes;
create policy "Public recipes are viewable by everyone"
on public.recipes
for select
using (is_public = true or auth.uid() = user_id);

drop policy if exists "Users can insert their own recipes" on public.recipes;
create policy "Users can insert their own recipes"
on public.recipes
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own recipes" on public.recipes;
create policy "Users can update their own recipes"
on public.recipes
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own recipes" on public.recipes;
create policy "Users can delete their own recipes"
on public.recipes
for delete
using (auth.uid() = user_id);

grant select, insert, update, delete on public.recipes to authenticated;
grant select on public.recipes to anon;
