-- Run once in the Supabase SQL editor. This is setup SQL, not a CLI migration.
-- Reuse the existing GitHub OAuth Supabase session; no separate storage login.
-- Authenticated users can manage only resumes/resume.pdf.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('resumes', 'resumes', true, 6291456, array['application/pdf'])
on conflict (id) do update set public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can discover active resume" on storage.objects;
drop policy if exists "Resume admins can upload" on storage.objects;
drop policy if exists "Resume admins can replace" on storage.objects;
drop policy if exists "Resume admins can delete" on storage.objects;

create policy "Public can discover active resume"
on storage.objects for select to anon, authenticated
using (bucket_id = 'resumes' and name = 'resume.pdf');

create policy "Resume admins can upload"
on storage.objects for insert to authenticated
with check (bucket_id = 'resumes' and name = 'resume.pdf');

create policy "Resume admins can replace"
on storage.objects for update to authenticated
using (bucket_id = 'resumes' and name = 'resume.pdf')
with check (bucket_id = 'resumes' and name = 'resume.pdf');

create policy "Resume admins can delete"
on storage.objects for delete to authenticated
using (bucket_id = 'resumes' and name = 'resume.pdf');
