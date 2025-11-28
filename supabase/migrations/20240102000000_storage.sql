-- Create a storage bucket for avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

-- Policy to allow authenticated users to upload avatars
create policy "Authenticated users can upload avatars"
on storage.objects for insert
with check (
  bucket_id = 'avatars' and
  auth.role() = 'authenticated'
);

-- Policy to allow authenticated users to update their own avatars
create policy "Users can update their own avatars"
on storage.objects for update
using (
  bucket_id = 'avatars' and
  auth.uid() = owner
);

-- Policy to allow public access to view avatars
create policy "Public access to avatars"
on storage.objects for select
using ( bucket_id = 'avatars' );

-- Policy to allow users to delete their own avatars
create policy "Users can delete their own avatars"
on storage.objects for delete
using (
  bucket_id = 'avatars' and
  auth.uid() = owner
);
