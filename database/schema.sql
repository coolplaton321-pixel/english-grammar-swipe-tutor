-- Schema installed by the Supabase migration create_english_student_topic_ratings.
-- Target: existing plato-maths-school project (iljziesnhngxpbcrjvww).
-- The English application has its own table; maths rows are not changed.
create table public.english_student_topic_ratings (
  owner_id uuid not null references auth.users(id) on delete cascade,
  student_id text not null check (student_id in ('taras','marina','anton')),
  topic_id text not null check (topic_id ~ '^[a-z][a-z0-9-]{0,63}$'),
  rating text not null default 'grey' check (rating in ('grey','red','yellow','green')),
  primary key (owner_id,student_id,topic_id)
);
alter table public.english_student_topic_ratings enable row level security;
revoke all on public.english_student_topic_ratings from public,anon,authenticated;
grant select,insert,update on public.english_student_topic_ratings to authenticated;
create policy english_teacher_reads_own_colours on public.english_student_topic_ratings
  for select to authenticated using ((select auth.uid())=owner_id and ((select auth.jwt())->>'is_anonymous') is distinct from 'true');
create policy english_teacher_creates_own_colours on public.english_student_topic_ratings
  for insert to authenticated with check ((select auth.uid())=owner_id and ((select auth.jwt())->>'is_anonymous') is distinct from 'true');
create policy english_teacher_updates_own_colours on public.english_student_topic_ratings
  for update to authenticated using ((select auth.uid())=owner_id and ((select auth.jwt())->>'is_anonymous') is distinct from 'true')
  with check ((select auth.uid())=owner_id and ((select auth.jwt())->>'is_anonymous') is distinct from 'true');
comment on table public.english_student_topic_ratings is 'Private English grammar colours per teacher and student; separate from maths. Explicit grey ratings preserve resets.';
