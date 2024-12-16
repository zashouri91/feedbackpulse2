-- Create helper functions for RLS
CREATE OR REPLACE FUNCTION public.is_valid_user()
RETURNS boolean AS $$
BEGIN
    -- Check if auth.uid() is properly set and user exists
    RETURN (
        auth.uid() IS NOT NULL
        AND EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND confirmed_at IS NOT NULL
            AND banned_until IS NULL
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_user_organization_id()
RETURNS uuid AS $$
BEGIN
    -- Get organization_id for the current user
    RETURN (
        SELECT organization_id
        FROM profiles
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhance existing RLS policies with auth validation

-- Groups policies
DROP POLICY IF EXISTS "Users can view groups in their organization" ON groups;
CREATE POLICY "Users can view groups in their organization"
ON groups FOR SELECT
USING (
    is_valid_user()
    AND organization_id = get_user_organization_id()
);

DROP POLICY IF EXISTS "Users can manage groups in their organization" ON groups;
CREATE POLICY "Users can manage groups in their organization"
ON groups FOR INSERT
WITH CHECK (
    is_valid_user()
    AND organization_id = get_user_organization_id()
    AND EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'manager')
    )
);

-- Feedback responses policies
DROP POLICY IF EXISTS "Users can view feedback in their organization" ON feedback_responses;
CREATE POLICY "Users can view feedback in their organization"
ON feedback_responses FOR SELECT
USING (
    is_valid_user()
    AND EXISTS (
        SELECT 1 FROM surveys s
        WHERE s.id = feedback_responses.survey_id
        AND s.organization_id = get_user_organization_id()
    )
);

DROP POLICY IF EXISTS "Users can submit feedback" ON feedback_responses;
CREATE POLICY "Users can submit feedback"
ON feedback_responses FOR INSERT
WITH CHECK (
    -- Allow anonymous feedback submission if survey allows it
    (tracking_code IS NOT NULL AND EXISTS (
        SELECT 1 FROM surveys s
        WHERE s.id = survey_id
        AND s.is_active = true
    ))
    OR
    -- Or require valid user and verify survey belongs to user's organization
    (is_valid_user() AND EXISTS (
        SELECT 1 FROM surveys s
        WHERE s.id = survey_id
        AND s.organization_id = get_user_organization_id()
    ))
);

-- Add audit logging trigger
CREATE OR REPLACE FUNCTION public.log_auth_failure()
RETURNS trigger AS $$
BEGIN
    IF NOT is_valid_user() THEN
        INSERT INTO audit_logs (
            action,
            table_name,
            user_id,
            details
        ) VALUES (
            'AUTH_FAILURE',
            TG_TABLE_NAME::text,
            auth.uid(),
            jsonb_build_object(
                'error', 'Invalid or unauthorized user',
                'attempted_operation', TG_OP
            )
        );
        RETURN NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit trigger to sensitive tables
DROP TRIGGER IF EXISTS auth_check_groups ON groups;
CREATE TRIGGER auth_check_groups
    BEFORE INSERT OR UPDATE OR DELETE ON groups
    FOR EACH ROW EXECUTE FUNCTION log_auth_failure();

DROP TRIGGER IF EXISTS auth_check_feedback ON feedback_responses;
CREATE TRIGGER auth_check_feedback
    BEFORE INSERT OR UPDATE OR DELETE ON feedback_responses
    FOR EACH ROW EXECUTE FUNCTION log_auth_failure();
