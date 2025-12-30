-- Allow users to update chats they belong to (for last_message updates)
create policy "Users can update chats they belong to"
on chats for update
using ( is_chat_member(id) );
