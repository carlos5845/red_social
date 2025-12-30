-- Enable RLS (already enabled in initial schema, but good to ensure)
alter table chats enable row level security;
alter table chat_members enable row level security;
alter table messages enable row level security;

-- HELPER FUNCTION TO AVOID INFINITE RECURSION
-- This function runs as the creator (postgres/admin) avoiding RLS on the table itself
create or replace function is_chat_member(_chat_id bigint)
returns boolean as $$
begin
  return exists (
    select 1
    from chat_members
    where chat_id = _chat_id
    and user_id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- CHATS POLICIES

-- Users can view chats they are members of
create policy "Users can view chats they belong to"
on chats for select
using (
  is_chat_member(id)
);

-- Users can create chats (DM usually involves creating chat + members)
create policy "Users can create chats"
on chats for insert
with check (auth.role() = 'authenticated');

-- CHAT MEMBERS POLICIES

-- Users can view members of chats they belong to
create policy "Users can view members of their chats"
on chat_members for select
using (
  is_chat_member(chat_id)
);

-- Users can add members (usually themselves and one other for DM)
-- Open to authenticated users to support initial creation
create policy "Users can add members"
on chat_members for insert
with check (auth.role() = 'authenticated');

-- MESSAGES POLICIES

-- Users can view messages in chats they belong to
create policy "Users can view messages in their chats"
on messages for select
using (
  is_chat_member(chat_id)
);

-- Users can insert messages in chats they belong to
create policy "Users can insert messages in their chats"
on messages for insert
with check (
  is_chat_member(chat_id)
  and
  auth.uid() = sender_id
);
