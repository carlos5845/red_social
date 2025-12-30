-- RPC function to create a DM atomically
-- This bypasses the RLS issue where a user can't select the chat they just created because they aren't a member yet

create or replace function create_dm(target_user_id uuid)
returns bigint
language plpgsql
security definer
as $$
declare
  new_chat_id bigint;
begin
  -- 1. Create chat
  insert into chats (type)
  values ('dm')
  returning id into new_chat_id;

  -- 2. Add members (current user and target user)
  insert into chat_members (chat_id, user_id)
  values 
    (new_chat_id, auth.uid()),
    (new_chat_id, target_user_id);

  return new_chat_id;
end;
$$;
