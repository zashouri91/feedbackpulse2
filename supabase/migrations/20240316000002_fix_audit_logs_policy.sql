-- Drop the existing insert policy
DROP POLICY IF EXISTS "Users can insert audit logs" ON audit_logs;

-- Create a new insert policy that allows users to insert logs for their organization
CREATE POLICY "Users can insert audit logs" ON audit_logs
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    organization_id IN (
      SELECT organization_id FROM profiles
      WHERE id = auth.uid()
    )
  );
