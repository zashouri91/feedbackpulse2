-- Create the initial organization
insert into organizations (id, name, domain)
values (
  '00000000-0000-0000-0000-000000000001',
  'Default Organization',
  'feedbackpulse.com'
);

-- This is a template for creating an admin user
-- Uncomment and replace the values with actual data when needed

/*
-- Create the admin profile
-- Note: Replace 'ADMIN_USER_ID' with the actual UUID from Supabase Auth after creating the user
insert into profiles (
  id,
  email,
  full_name,
  role,
  organization_id,
  permissions
) values (
  'ADMIN_USER_ID', -- This needs to be replaced with the actual UUID from Supabase Auth
  'admin@example.com', -- Replace with your email
  'Admin User',
  'admin',
  '00000000-0000-0000-0000-000000000001',
  array[
    'analytics.view',
    'analytics.export',
    'analytics.view.detailed',
    'analytics.view.financial',
    'analytics.customize',
    'analytics.share'
  ]
);
*/
