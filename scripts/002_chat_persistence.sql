-- Memberships: which user joined which group (group ids are from in-memory list)
create table if not exists public.memberships (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  group_id integer not null,
  joined_at timestamptz not null default now(),
  unique (user_id, group_id)
);

-- Messages: persisted chat per group
create table if not exists public.messages (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  group_id integer not null,
  content text not null check (char_length(trim(content)) > 0),
  created_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_memberships_user on public.memberships(user_id);
create index if not exists idx_memberships_group on public.memberships(group_id);
create index if not exists idx_messages_group_created on public.messages(group_id, created_at);

-- Enable RLS
alter table public.memberships enable row level security;
alter table public.messages enable row level security;

-- Membership policies: only see and write your own
drop policy if exists "Select own memberships" on public.memberships;
create policy "Select own memberships" on public.memberships
  for select using (auth.uid() = user_id);

drop policy if exists "Insert own membership" on public.memberships;
create policy "Insert own membership" on public.memberships
  for insert with check (auth.uid() = user_id);

drop policy if exists "Delete own membership" on public.memberships;
create policy "Delete own membership" on public.memberships
  for delete using (auth.uid() = user_id);

-- Messages policies: only read/write in groups you joined
drop policy if exists "Select messages in joined groups" on public.messages;
create policy "Select messages in joined groups" on public.messages
  for select using (
    exists (
      select 1 from public.memberships m
      where m.user_id = auth.uid() and m.group_id = messages.group_id
    )
  );

drop policy if exists "Insert messages in joined groups" on public.messages;
create policy "Insert messages in joined groups" on public.messages
  for insert with check (
    exists (
      select 1 from public.memberships m
      where m.user_id = auth.uid() and m.group_id = messages.group_id
    )
  );

-- Realtime: stream inserts from messages (memberships optional)
create publication if not exists supabase_realtime;
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.memberships;
