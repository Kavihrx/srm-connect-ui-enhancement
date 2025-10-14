-- new safe setup script for memberships + messages with RLS and realtime, avoiding IF NOT EXISTS where unsupported

-- 1) Tables
create table if not exists public.memberships (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  group_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, group_id)
);

create table if not exists public.messages (
  id bigserial primary key,
  group_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (length(content) > 0),
  created_at timestamptz not null default now()
);

-- 2) Indexes
create index if not exists idx_memberships_user_group on public.memberships (user_id, group_id);
create index if not exists idx_messages_group_created on public.messages (group_id, created_at desc);
create index if not exists idx_messages_user_created on public.messages (user_id, created_at desc);

-- 3) Enable Row Level Security
alter table public.memberships enable row level security;
alter table public.messages enable row level security;

-- 4) Policies (use DO blocks to avoid “already exists” errors; CREATE POLICY does not support IF NOT EXISTS)
-- memberships: select/insert/delete own
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'memberships' and polname = 'select_own_memberships'
  ) then
    execute $pol$
      create policy select_own_memberships
      on public.memberships
      for select
      using (auth.uid() = user_id);
    $pol$;
  end if;
end$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'memberships' and polname = 'insert_own_memberships'
  ) then
    execute $pol$
      create policy insert_own_memberships
      on public.memberships
      for insert
      with check (auth.uid() = user_id);
    $pol$;
  end if;
end$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'memberships' and polname = 'delete_own_memberships'
  ) then
    execute $pol$
      create policy delete_own_memberships
      on public.memberships
      for delete
      using (auth.uid() = user_id);
    $pol$;
  end if;
end$$;

-- messages: members of a group can read that group's messages
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'messages' and polname = 'select_group_messages_if_member'
  ) then
    execute $pol$
      create policy select_group_messages_if_member
      on public.messages
      for select
      using (exists (
        select 1
        from public.memberships m
        where m.user_id = auth.uid()
          and m.group_id = messages.group_id
      ));
    $pol$;
  end if;
end$$;

-- messages: only members can insert messages for that group
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'messages' and polname = 'insert_group_messages_if_member'
  ) then
    execute $pol$
      create policy insert_group_messages_if_member
      on public.messages
      for insert
      with check (exists (
        select 1
        from public.memberships m
        where m.user_id = auth.uid()
          and m.group_id = messages.group_id
      ));
    $pol$;
  end if;
end$$;

-- (optional) delete own messages
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'messages' and polname = 'delete_own_messages'
  ) then
    execute $pol$
      create policy delete_own_messages
      on public.messages
      for delete
      using (auth.uid() = user_id);
    $pol$;
  end if;
end$$;

-- 5) Realtime publication add (Supabase uses publication "supabase_realtime")
-- Add public.messages to supabase_realtime if not already present
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'messages'
  ) then
    execute 'alter publication supabase_realtime add table public.messages';
  end if;
end$$;

-- Add public.memberships to supabase_realtime if not already present (useful if you want to reflect live joins)
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'memberships'
  ) then
    execute 'alter publication supabase_realtime add table public.memberships';
  end if;
end$$;

-- 6) Grants (Supabase default roles: authenticated, anon)
-- You may fine-tune grants as needed; RLS is the primary protection.
grant select, insert, delete on table public.memberships to authenticated;
grant select, insert, delete on table public.messages to authenticated;
