-- Add RLS policies for post_likes table

-- Allow users to view their own likes (needed for isLiked check)
create policy "Users can view their own likes"
on post_likes for select
using (auth.uid() = user_id);

-- Allow authenticated users to insert their own likes
create policy "Users can create their own likes"
on post_likes for insert
with check (auth.uid() = user_id);

-- Allow users to delete their own likes
create policy "Users can delete their own likes"
on post_likes for delete
using (auth.uid() = user_id);
