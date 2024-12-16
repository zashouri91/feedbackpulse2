-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles in their organization" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authentication service" ON profiles;

-- Add RLS policies for profiles table
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Allow system to create profiles for new users
CREATE POLICY "Enable insert for authentication service"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- Add RLS policies for audit_logs table
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view audit logs in their organization"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.organization_id = (
        SELECT organization_id FROM profiles
        WHERE id = audit_logs.user_id
      )
    )
  );

-- Only allow system to insert audit logs
CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
