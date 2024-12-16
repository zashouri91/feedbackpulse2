-- Add RLS policies for groups table
CREATE POLICY "Users can view groups in their organization"
  ON groups FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.organization_id = groups.organization_id
    )
  );

CREATE POLICY "Users can manage groups in their organization"
  ON groups FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.organization_id = organization_id
      AND p.role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Users can update groups in their organization"
  ON groups FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.organization_id = groups.organization_id
      AND p.role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Users can delete groups in their organization"
  ON groups FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.organization_id = groups.organization_id
      AND p.role IN ('admin', 'manager')
    )
  );

-- Add RLS policies for locations table
CREATE POLICY "Users can view locations in their organization"
  ON locations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.organization_id = locations.organization_id
    )
  );

CREATE POLICY "Users can manage locations in their organization"
  ON locations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.organization_id = organization_id
      AND p.role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Users can update locations in their organization"
  ON locations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.organization_id = locations.organization_id
      AND p.role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Users can delete locations in their organization"
  ON locations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.organization_id = locations.organization_id
      AND p.role IN ('admin', 'manager')
    )
  );
