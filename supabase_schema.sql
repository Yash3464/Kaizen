-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Create profiles table linked to auth.users
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  streak integer default 0 not null,
  xp integer default 0 not null,
  level integer default 1 not null,
  xp_to_next_level integer default 1000 not null,
  consistency_score integer default 100 not null,
  friend_count integer default 0 not null,
  total_completed integer default 0 not null,
  theme_color text default '#B5945F' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create friendships table
create table public.friendships (
  id uuid default gen_random_uuid() primary key,
  user_id_1 uuid references public.profiles(id) on delete cascade not null,
  user_id_2 uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id_1, user_id_2),
  check (user_id_1 < user_id_2)
);

-- Create friend requests table
create table public.friend_requests (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  receiver_id uuid references public.profiles(id) on delete cascade not null,
  status text default 'pending' not null, -- 'pending', 'accepted', 'rejected'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (sender_id, receiver_id)
);

-- Create habits table
create table public.habits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  category text not null, -- 'Physical', 'Focus', 'Mind', 'Growth'
  icon text not null,
  color text not null,
  target text not null,
  streak integer default 0 not null,
  visibility text default 'Friends' not null, -- 'Private', 'Friends', 'Public'
  reminder_time text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create habit logs (history) table
create table public.habit_logs (
  id uuid default gen_random_uuid() primary key,
  habit_id uuid references public.habits(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  logged_date date default current_date not null,
  status text not null, -- 'completed', 'skipped', 'missed'
  notes text,
  mood text,
  missed_reason text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (habit_id, logged_date)
);

-- Create activities feed table
create table public.activities (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  action text not null, -- 'completed habit', 'achieved perfect day', 'joined challenge'
  habit_name text,
  streak integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create activity reactions table
create table public.reactions (
  id uuid default gen_random_uuid() primary key,
  activity_id uuid references public.activities(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null, -- '🔥', '⚡️', '💪', '👑', etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (activity_id, user_id, type)
);

-- Create activity comments table
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  activity_id uuid references public.activities(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create challenges table
create table public.challenges (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  members_count integer default 0 not null,
  days_remaining integer not null,
  creator_id uuid references public.profiles(id) on delete set null,
  creator_name text not null,
  reward_xp integer default 500 not null,
  badge_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create challenge members table
create table public.challenge_members (
  id uuid default gen_random_uuid() primary key,
  challenge_id uuid references public.challenges(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  progress integer default 0 not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (challenge_id, user_id)
);

-- Create chat messages table
create table public.chat_messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  receiver_username text not null, -- links to receiver username
  text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- TRIGGERS & FUNCTIONS --

-- Trigger: create profile when new auth.users joins
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url, theme_color)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'name', 'New Warrior'),
    coalesce(new.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80'),
    '#B5945F'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Trigger: increment/decrement friend counts
create or replace function public.handle_friend_count()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update public.profiles set friend_count = friend_count + 1 where id = new.user_id_1 or id = new.user_id_2;
  elsif (TG_OP = 'DELETE') then
    update public.profiles set friend_count = greatest(0, friend_count - 1) where id = old.user_id_1 or id = old.user_id_2;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger on_friendship_change
  after insert or delete on public.friendships
  for each row execute procedure public.handle_friend_count();


-- Trigger: increment/decrement challenge members count
create or replace function public.handle_challenge_members_count()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update public.challenges set members_count = members_count + 1 where id = new.challenge_id;
  elsif (TG_OP = 'DELETE') then
    update public.challenges set members_count = greatest(0, members_count - 1) where id = old.challenge_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger on_challenge_membership_change
  after insert or delete on public.challenge_members
  for each row execute procedure public.handle_challenge_members_count();


-- ROW LEVEL SECURITY (RLS) POLICIES --

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.friendships enable row level security;
alter table public.friend_requests enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.activities enable row level security;
alter table public.reactions enable row level security;
alter table public.comments enable row level security;
alter table public.challenges enable row level security;
alter table public.challenge_members enable row level security;
alter table public.chat_messages enable row level security;

-- Profiles Policies
create policy "Profiles viewable by everyone" on public.profiles for select using ( true );
create policy "Users can update their own profile" on public.profiles for update using ( auth.uid() = id );

-- Friendships Policies
create policy "Viewable by members" on public.friendships for select using ( auth.uid() = user_id_1 or auth.uid() = user_id_2 );
create policy "Create/Delete by members" on public.friendships for all using ( auth.uid() = user_id_1 or auth.uid() = user_id_2 );

-- Friend Requests Policies
create policy "Requests viewable by sender or receiver" on public.friend_requests for select using ( auth.uid() = sender_id or auth.uid() = receiver_id );
create policy "Send friend requests" on public.friend_requests for insert with check ( auth.uid() = sender_id );
create policy "Respond/delete requests" on public.friend_requests for all using ( auth.uid() = sender_id or auth.uid() = receiver_id );

-- Habits Policies
create policy "Users manage own habits" on public.habits for all using ( auth.uid() = user_id );
create policy "Friends/Public view habits" on public.habits for select using (
  visibility = 'Public' or
  auth.uid() = user_id or
  (visibility = 'Friends' and exists (
    select 1 from public.friendships
    where (user_id_1 = auth.uid() and user_id_2 = user_id)
       or (user_id_2 = auth.uid() and user_id_1 = user_id)
  ))
);

-- Habit Logs Policies
create policy "Users manage own logs" on public.habit_logs for all using ( auth.uid() = user_id );
create policy "Viewable if owner or habit visible" on public.habit_logs for select using (
  auth.uid() = user_id or
  exists (
    select 1 from public.habits h
    where h.id = habit_id and (
      h.visibility = 'Public' or
      (h.visibility = 'Friends' and exists (
        select 1 from public.friendships
        where (user_id_1 = auth.uid() and user_id_2 = h.user_id)
           or (user_id_2 = auth.uid() and user_id_1 = h.user_id)
      ))
    )
  )
);

-- Activities Policies
create policy "Activities viewable by everyone" on public.activities for select using ( true );
create policy "Users insert own activities" on public.activities for insert with check ( auth.uid() = user_id );

-- Reactions Policies
create policy "Reactions viewable by everyone" on public.reactions for select using ( true );
create policy "Users manage own reactions" on public.reactions for all using ( auth.uid() = user_id );

-- Comments Policies
create policy "Comments viewable by everyone" on public.comments for select using ( true );
create policy "Users manage own comments" on public.comments for all using ( auth.uid() = user_id );

-- Challenges Policies
create policy "Challenges viewable by everyone" on public.challenges for select using ( true );
create policy "Users insert challenges" on public.challenges for insert with check ( auth.uid() = creator_id );

-- Challenge Members Policies
create policy "Members viewable by everyone" on public.challenge_members for select using ( true );
create policy "Users manage challenge membership" on public.challenge_members for all using ( auth.uid() = user_id );

-- Chat Messages Policies
create policy "Messages viewable by sender or recipient" on public.chat_messages for select using (
  auth.uid() = sender_id or
  exists (
    select 1 from public.profiles p where p.username = receiver_username and p.id = auth.uid()
  )
);
create policy "Send chat messages" on public.chat_messages for insert with check ( auth.uid() = sender_id );
