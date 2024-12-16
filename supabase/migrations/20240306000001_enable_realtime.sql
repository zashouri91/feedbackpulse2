-- Enable real-time for locations and groups tables
alter publication supabase_realtime add table locations;
alter publication supabase_realtime add table groups;
