-- Enable RLS for comments
alter table comments enable row level security;

-- Policies
create policy "Comments are viewable by everyone"
on comments for select
using (true);

create policy "Users can create their own comments"
on comments for insert
with check (auth.uid() = user_id);

create policy "Users can delete their own comments"
on comments for delete
using (auth.uid() = user_id);

-- Trigger for comments_count
create or replace function update_comments_count()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update posts set comments_count = comments_count + 1 where id = new.post_id;
  elsif (TG_OP = 'DELETE') then
    update posts set comments_count = comments_count - 1 where id = old.post_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger on_comment_change
after insert or delete on comments
for each row execute procedure update_comments_count();

-- Enable Realtime
alter publication supabase_realtime add table comments;
