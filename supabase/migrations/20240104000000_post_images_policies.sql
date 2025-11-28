-- Add RLS policies for post_images table

-- Allow public access to view post images
create policy "Public post images are viewable by everyone"
on post_images for select
using (true);

-- Allow authenticated users to insert post images
create policy "Authenticated users can insert post images"
on post_images for insert
with check (auth.role() = 'authenticated');

-- Allow users to delete images if they own the parent post
-- Note: This requires a join or a more complex check. 
-- For simplicity and since we rely on CASCADE delete from posts, 
-- we might not strictly need a manual delete policy for the MVP 
-- unless we implement "remove image from post" feature.
-- But let's add a basic one just in case.
create policy "Users can delete their own post images"
on post_images for delete
using (
  exists (
    select 1 from posts
    where posts.id = post_images.post_id
    and posts.user_id = auth.uid()
  )
);
