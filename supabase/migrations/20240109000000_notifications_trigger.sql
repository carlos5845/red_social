-- Trigger to create notification on like
create or replace function handle_new_like()
returns trigger as $$
begin
  -- Get the post author
  declare
    post_author_id uuid;
  begin
    select user_id into post_author_id from posts where id = new.post_id;

    -- Only create notification if liker is not the author
    if post_author_id != new.user_id then
      insert into notifications (user_id, actor_id, type, entity_id, entity_type)
      values (post_author_id, new.user_id, 'like', new.post_id, 'post');
    end if;
  end;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_like_created
after insert on post_likes
for each row execute procedure handle_new_like();

-- Enable Realtime for notifications
alter publication supabase_realtime add table notifications;

-- Policy for notifications (if not exists, but initial schema had it enabled, just ensuring policies)
-- Users can view their own notifications
create policy "Users can view their own notifications"
on notifications for select
using (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
create policy "Users can update their own notifications"
on notifications for update
using (auth.uid() = user_id);
