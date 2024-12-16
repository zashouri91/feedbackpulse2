-- Fix profiles table to match auth expectations
ALTER TABLE profiles
DROP COLUMN user_id,
ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES users(id);

-- Insert default role permissions for manager
INSERT INTO role_permissions (role, permission_id)
SELECT 'manager', id 
FROM permissions 
WHERE name IN (
    'analytics.view',
    'analytics.export',
    'analytics.view.detailed',
    'analytics.share',
    'survey.create',
    'survey.update',
    'feedback.submit',
    'user.update'
);

-- Insert default role permissions for user
INSERT INTO role_permissions (role, permission_id)
SELECT 'user', id 
FROM permissions 
WHERE name IN (
    'analytics.view',
    'feedback.submit'
);

-- Ensure default roles exist in profiles
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS profiles_role_check,
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('admin', 'manager', 'user'));
