-- Narratives table
create table if not exists narratives (
  id text primary key,
  title text not null,
  score integer not null check (score >= 0 and score <= 100),
  tag text not null default 'Stable',
  summary text,
  detailed_report text,
  coins_in_space jsonb default '[]'::jsonb,
  upcoming_coins jsonb default '[]'::jsonb,
  news jsonb default '[]'::jsonb,
  ai_summary text,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Coins table
create table if not exists coins (
  id text primary key,
  symbol text not null,
  name text not null,
  price text,
  change_24h text,
  positive boolean default true,
  description text,
  token_metrics jsonb default '[]'::jsonb,
  news jsonb default '[]'::jsonb,
  social_activity jsonb default '[]'::jsonb,
  similar_coin_ids text[] default '{}',
  ai_summary text,
  ai_score integer check (ai_score >= 0 and ai_score <= 100),
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger narratives_updated_at before update on narratives
  for each row execute function update_updated_at();

create trigger coins_updated_at before update on coins
  for each row execute function update_updated_at();

-- RLS: public read, service-role write
alter table narratives enable row level security;
alter table coins enable row level security;

create policy "Public can read narratives" on narratives for select using (true);
create policy "Service role can write narratives" on narratives for all using (auth.role() = 'service_role');

create policy "Public can read coins" on coins for select using (true);
create policy "Service role can write coins" on coins for all using (auth.role() = 'service_role');
