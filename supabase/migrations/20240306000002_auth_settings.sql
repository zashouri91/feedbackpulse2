-- Set up auth settings
alter table auth.users enable row level security;

-- Create policies for auth.users
create policy "Users can view their own user data."
  on auth.users for select
  using ( auth.uid() = id );

-- Set up refresh token settings
alter table auth.refresh_tokens enable row level security;

create policy "Users can use their own refresh tokens."
  on auth.refresh_tokens for all
  using ( auth.uid() = user_id );

-- Enable secure password recovery
update auth.config
set value = jsonb_set(
  value,
  '{security}',
  '{"disableEmailSignup": false, "enablePasswordRecovery": true}'
);

-- Set up email templates for auth
update auth.config
set value = jsonb_set(
  value,
  '{mailer}',
  '{
    "site_url": "http://localhost:5173",
    "autoconfirm": false,
    "secure_email_change_enabled": true,
    "invite_enabled": true
  }'
);
