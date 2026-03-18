-- USERS (extends Supabase auth.users)
create table public.users (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text unique not null,
  full_name    text,
  avatar_url   text,
  role         text default 'student' check (role in ('student','admin')),
  xp           integer default 0,
  level        integer default 1,
  streak_days  integer default 0,
  last_active  timestamptz default now(),
  created_at   timestamptz default now()
);

-- Trigger to insert user into public.users on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, full_name, email, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email, COALESCE(new.raw_user_meta_data->>'role', 'student'));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- COURSES
create table public.courses (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  thumbnail_url text,
  category      text,
  difficulty    text default 'beginner' check (difficulty in ('beginner','intermediate','advanced')),
  tags          text[],
  is_published  boolean default false,
  created_by    uuid references public.users(id) on delete set null,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- LESSONS (courses have multiple lessons)
create table public.lessons (
  id           uuid primary key default gen_random_uuid(),
  course_id    uuid references public.courses(id) on delete cascade,
  title        text not null,
  description  text,
  video_url    text,
  content_md   text,          -- rich markdown content
  duration_sec integer,
  order_index  integer not null,
  xp_reward    integer default 50,
  created_at   timestamptz default now()
);

-- ENROLLMENTS
create table public.enrollments (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references public.users(id) on delete cascade,
  course_id    uuid references public.courses(id) on delete cascade,
  enrolled_at  timestamptz default now(),
  unique(user_id, course_id)
);

-- PROGRESS (per lesson)
create table public.progress (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references public.users(id) on delete cascade,
  course_id           uuid references public.courses(id) on delete cascade,
  lesson_id           uuid references public.lessons(id) on delete cascade,
  completed           boolean default false,
  watch_time_sec      integer default 0,
  completed_at        timestamptz,
  unique(user_id, lesson_id)
);

-- BADGES
create table public.badges (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  description  text,
  icon_url     text,
  xp_threshold integer,
  criteria     jsonb
);

create table public.user_badges (
  user_id      uuid references public.users(id) on delete cascade,
  badge_id     uuid references public.badges(id) on delete cascade,
  earned_at    timestamptz default now(),
  primary key (user_id, badge_id)
);

-- AI TUTOR CONVERSATIONS
create table public.ai_conversations (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references public.users(id) on delete cascade,
  course_id    uuid references public.courses(id) on delete cascade,
  messages     jsonb default '[]',
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- NOTIFICATIONS
create table public.notifications (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references public.users(id) on delete cascade,
  title        text,
  content      text,
  is_read      boolean default false,
  created_at   timestamptz default now()
);

------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
------------------------------------------------------------------

-- Enable RLS across V2
alter table public.users enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.progress enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.notifications enable row level security;

-- USERS
create policy "Users view own profile" on public.users for select using (auth.uid() = id);
create policy "Users edit own profile" on public.users for update using (auth.uid() = id);
create policy "Admins see all users" on public.users for all using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- COURSES
create policy "Anyone can view published courses" on public.courses for select using (is_published = true);
create policy "Admins manage all courses" on public.courses for all using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- LESSONS
create policy "Anyone can view lessons of published courses" on public.lessons for select using (
  exists (select 1 from public.courses c where c.id = public.lessons.course_id and c.is_published = true)
);
create policy "Admins manage all lessons" on public.lessons for all using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- ENROLLMENTS
create policy "Users manage own enrollments" on public.enrollments for all using (auth.uid() = user_id);

-- PROGRESS
create policy "Users manage own progress" on public.progress for all using (auth.uid() = user_id);

-- BADGES
create policy "Anyone can view badges" on public.badges for select using (true);
create policy "Users see own badges" on public.user_badges for select using (auth.uid() = user_id);

-- AI CONVERSATIONS
create policy "Users manage own conversations" on public.ai_conversations for all using (auth.uid() = user_id);

-- NOTIFICATIONS
create policy "Users manage own notifications" on public.notifications for all using (auth.uid() = user_id);
