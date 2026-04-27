-- profiles table
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  role text not null check (role in ('startup', 'investor', 'entrepreneur')),
  name text,
  avatar_url text,
  short_bio text,
  long_bio text,
  portfolio_link text,
  company_name text,
  company_website text,
  established_at text,
  stage text,
  location text,
  pitch_video_url text,
  check_size text,
  investment_interests text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- posts table
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  media_url text not null,
  media_type text not null check (media_type in ('image', 'video')),
  caption text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.posts enable row level security;

create policy "Profiles viewable by all" on public.profiles for select using (true);
create policy "Users insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Posts viewable by all" on public.posts for select using (true);
create policy "Users insert own posts" on public.posts for insert with check (auth.uid() = user_id);
create policy "Users delete own posts" on public.posts for delete using (auth.uid() = user_id);

insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('posts', 'posts', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('pitch-videos', 'pitch-videos', true) on conflict do nothing;

create policy "Avatar upload" on storage.objects for insert with check (bucket_id = 'avatars' AND auth.role() = 'authenticated');
create policy "Avatar read" on storage.objects for select using (bucket_id = 'avatars');
create policy "Posts upload" on storage.objects for insert with check (bucket_id = 'posts' AND auth.role() = 'authenticated');
create policy "Posts read" on storage.objects for select using (bucket_id = 'posts');
create policy "Pitch upload" on storage.objects for insert with check (bucket_id = 'pitch-videos' AND auth.role() = 'authenticated');
create policy "Pitch read" on storage.objects for select using (bucket_id = 'pitch-videos');
