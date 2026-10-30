-- Run once in the Supabase SQL editor. This is setup SQL, not a CLI migration.
-- Create an admin user in Authentication first, then assign trusted app_metadata
-- {"resume_admin": true} using the server-only Admin API or dashboard.
-- Sign in through Resume Manager > Connect storage admin account afterward.
-- The browser-local /admin passcode does not grant storage write permissions.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('resumes', 'resumes', true, 6291456, array['application/pdf'])
on conflict (id) do update set public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public can discover active resume"
on storage.objects for select to anon, authenticated
using (bucket_id = 'resumes' and name = 'resume.pdf');

create policy "Resume admins can upload"
on storage.objects for insert to authenticated
with check (bucket_id = 'resumes' and name = 'resume.pdf'
  and (select auth.jwt())->'app_metadata'->>'resume_admin' = 'true');

create policy "Resume admins can replace"
on storage.objects for update to authenticated
using (bucket_id = 'resumes' and name = 'resume.pdf'
  and (select auth.jwt())->'app_metadata'->>'resume_admin' = 'true')
with check (bucket_id = 'resumes' and name = 'resume.pdf'
  and (select auth.jwt())->'app_metadata'->>'resume_admin' = 'true');

create policy "Resume admins can delete"
on storage.objects for delete to authenticated
using (bucket_id = 'resumes' and name = 'resume.pdf'
  and (select auth.jwt())->'app_metadata'->>'resume_admin' = 'true');
