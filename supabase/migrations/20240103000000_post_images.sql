-- Create a storage bucket for post images
insert into storage.buckets (id, name, public)
values ('post_images', 'post_images', true);

-- Policy to allow authenticated users to upload post images
create policy "Authenticated users can upload post images"
on storage.objects for insert
with check (
  bucket_id = 'post_images' and
  auth.role() = 'authenticated'
);

-- Policy to allow public access to view post images
create policy "Public access to post images"
on storage.objects for select
using ( bucket_id = 'post_images' );

-- Policy to allow users to delete their own post images
create policy "Users can delete their own post images"
on storage.objects for delete
using (
  bucket_id = 'post_images' and
  auth.uid() = owner
);
