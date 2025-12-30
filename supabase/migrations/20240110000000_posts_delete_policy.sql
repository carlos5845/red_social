-- Add delete policy for posts
-- Users can only delete their own posts

create policy "Users can delete their own posts"
on posts for delete
using (auth.uid() = user_id);
