-- Memberships store which user has joined which group (group_id maps to your static groups)
create table if not exists public.memberships (
  user_id uuid not null references auth.users(id) on delete cascade,
  group_id integer not null,
  joined_at timestamp with time zone default now() not null,
  primary key (user_id, group_id)
);

create index if not exists memberships_user_id_idx on public.memberships(user_id);
create index if not exists memberships_group_id_idx on public.memberships(group_id);

alter table public.memberships enable row level security;

create policy if not exists "select own memberships"
on public.memberships
for select
to authenticated
using (auth.uid() = user_id);

create policy if not exists "insert own memberships"
on public.memberships
for insert
to authenticated
with check (auth.uid() = user_id);

create policy if not exists "delete own memberships"
on public.memberships
for delete
to authenticated
using (auth.uid() = user_id);

-- Messages in each group
create table if not exists public.messages (
  id bigserial primary key,
  group_id integer not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (length(content) > 0),
  created_at timestamp with time zone default now() not null
);

create index if not exists messages_group_id_created_at_idx on public.messages(group_id, created_at);
create index if not exists messages_user_id_idx on public.messages(user_id);

alter table public.messages enable row level security;

create policy if not exists "select messages if member"
on public.messages
for select
to authenticated
using (
  exists (
    select 1 from public.memberships m
    where m.group_id = messages.group_id
      and m.user_id = auth.uid()
  )
);

create policy if not exists "insert messages if member"
on public.messages
for insert
to authenticated
with check (
  auth.uid() = user_id and
  exists (
    select 1 from public.memberships m
    where m.group_id = messages.group_id
      and m.user_id = auth.uid()
  )
);
