-- TaskMate schema: profiles, tasks, matches, messages
-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query).

-- 1. Profiles ---------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default 'New user',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

-- Auto-create a profile row whenever someone signs up.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', 'New user'));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Tasks --------------------------------------------------------------
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  poster_id uuid not null references public.profiles (id) on delete cascade,
  type text not null check (type in ('grocery', 'dryClean', 'doctor', 'pharmacy', 'petStore', 'errand')),
  title text not null,
  location text not null,
  time_window text not null,
  note text,
  created_at timestamptz not null default now()
);

alter table public.tasks enable row level security;

create policy "Tasks are viewable by authenticated users"
  on public.tasks for select
  to authenticated
  using (true);

create policy "Users can insert their own tasks"
  on public.tasks for insert
  to authenticated
  with check (poster_id = auth.uid());

-- 3. Matches --------------------------------------------------------------
create table public.matches (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks (id) on delete cascade,
  user_a uuid not null references public.profiles (id) on delete cascade,
  user_b uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'matched' check (status in ('pending', 'matched', 'declined')),
  created_at timestamptz not null default now()
);

alter table public.matches enable row level security;

create policy "Users can view their own matches"
  on public.matches for select
  to authenticated
  using (auth.uid() = user_a or auth.uid() = user_b);

create policy "Users can create matches they initiate"
  on public.matches for insert
  to authenticated
  with check (auth.uid() = user_a);

-- 4. Messages --------------------------------------------------------------
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

create policy "Users can view messages in their own matches"
  on public.messages for select
  to authenticated
  using (
    exists (
      select 1 from public.matches
      where matches.id = messages.match_id
        and (matches.user_a = auth.uid() or matches.user_b = auth.uid())
    )
  );

create policy "Users can send messages in their own matches"
  on public.messages for insert
  to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.matches
      where matches.id = messages.match_id
        and (matches.user_a = auth.uid() or matches.user_b = auth.uid())
    )
  );

-- 5. Realtime ---------------------------------------------------------------
-- Lets the chat screen subscribe to new messages as they're inserted.
alter publication supabase_realtime add table public.messages;
