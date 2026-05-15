-- Execute este arquivo no SQL Editor do Supabase.
-- Depois, crie o seu usuário em Authentication > Users e desative cadastro público se quiser acesso fechado.

create table if not exists public.pic_records (
  id text primary key,
  data jsonb not null,
  updated_by text,
  updated_at timestamptz not null default now()
);

create table if not exists public.pic_texts (
  id text primary key,
  data jsonb not null,
  updated_by text,
  updated_at timestamptz not null default now()
);

create table if not exists public.pic_evidences (
  id text primary key,
  data jsonb not null,
  updated_by text,
  created_at timestamptz not null default now()
);

create table if not exists public.pic_allowed_users (
  email text primary key
);

-- Troque este e-mail pelo seu e-mail real antes de usar.
insert into public.pic_allowed_users (email)
values ('jg72005@gmail.com')
on conflict (email) do nothing;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists pic_records_touch on public.pic_records;
create trigger pic_records_touch before update on public.pic_records
for each row execute function public.touch_updated_at();

drop trigger if exists pic_texts_touch on public.pic_texts;
create trigger pic_texts_touch before update on public.pic_texts
for each row execute function public.touch_updated_at();

alter table public.pic_records enable row level security;
alter table public.pic_texts enable row level security;
alter table public.pic_evidences enable row level security;
alter table public.pic_allowed_users enable row level security;

create or replace function public.pic_is_allowed()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.pic_allowed_users
    where lower(email) = lower(auth.jwt() ->> 'email')
  );
$$;

drop policy if exists "pic_records_authenticated" on public.pic_records;
create policy "pic_records_authenticated" on public.pic_records
for all to authenticated
using (public.pic_is_allowed())
with check (public.pic_is_allowed());

drop policy if exists "pic_texts_authenticated" on public.pic_texts;
create policy "pic_texts_authenticated" on public.pic_texts
for all to authenticated
using (public.pic_is_allowed())
with check (public.pic_is_allowed());

drop policy if exists "pic_evidences_authenticated" on public.pic_evidences;
create policy "pic_evidences_authenticated" on public.pic_evidences
for all to authenticated
using (public.pic_is_allowed())
with check (public.pic_is_allowed());
