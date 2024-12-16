-- Create sessions table for managing user sessions
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create permissions table
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create role_permissions table for mapping roles to permissions
CREATE TABLE role_permissions (
    role VARCHAR(50) NOT NULL,
    permission_id UUID NOT NULL REFERENCES permissions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role, permission_id)
);

-- Add indexes
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_sessions_tokens ON sessions(access_token, refresh_token);

-- Create trigger for updating updated_at
CREATE TRIGGER update_sessions_updated_at
    BEFORE UPDATE ON sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default permissions
INSERT INTO permissions (name, description) VALUES
    ('analytics.view', 'View analytics dashboards'),
    ('analytics.export', 'Export analytics data'),
    ('analytics.view.detailed', 'View detailed metrics'),
    ('analytics.view.financial', 'View financial metrics'),
    ('analytics.customize', 'Customize analytics dashboards'),
    ('analytics.share', 'Share analytics reports'),
    ('survey.create', 'Create new surveys'),
    ('survey.update', 'Update existing surveys'),
    ('survey.delete', 'Delete surveys'),
    ('feedback.submit', 'Submit feedback'),
    ('user.create', 'Create new users'),
    ('user.update', 'Update user information'),
    ('user.delete', 'Delete users'),
    ('settings.update', 'Update system settings');

-- Insert default role permissions for admin
INSERT INTO role_permissions (role, permission_id)
SELECT 'admin', id FROM permissions;
