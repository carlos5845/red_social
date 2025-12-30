-- Enable realtime for chat tables
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table chats;
