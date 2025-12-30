-- Fix infinite recursion by using a security definer function

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

-- Drop existing recursive policies to be safe
drop policy if exists "Users can view chats they belong to" on chats;
drop policy if exists "Users can view members of their chats" on chat_members;
drop policy if exists "Users can view messages in their chats" on messages;
drop policy if exists "Users can insert messages in their chats" on messages;

-- Re-create policies using the helper function

-- CHATS
create policy "Users can view chats they belong to"
on chats for select
using ( is_chat_member(id) );

-- CHAT MEMBERS
create policy "Users can view members of their chats"
on chat_members for select
using ( is_chat_member(chat_id) );

-- MESSAGES
create policy "Users can view messages in their chats"
on messages for select
using ( is_chat_member(chat_id) );

create policy "Users can insert messages in their chats"
on messages for insert
with check (
  is_chat_member(chat_id)
  and
  auth.uid() = sender_id
);
