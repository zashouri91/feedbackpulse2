-- Enable RLS on auth tables
alter table auth.users enable row level security;
alter table auth.refresh_tokens enable row level security;

-- Create policies for auth tables
create policy "Users can view their own data."
  on auth.users for select
  using ( auth.uid() = id );

create policy "Users can use their own refresh tokens."
  on auth.refresh_tokens for all
  using ( auth.uid()::text = user_id );

-- Configure auth settings
alter table auth.users replica identity full;
alter table auth.refresh_tokens replica identity full;
