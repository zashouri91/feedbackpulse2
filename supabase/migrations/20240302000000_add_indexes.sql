-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_survey_responses ON feedback_responses (survey_id);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback_responses (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback_responses (user_id);
CREATE INDEX IF NOT EXISTS idx_survey_org ON surveys (organization_id);
CREATE INDEX IF NOT EXISTS idx_survey_created ON surveys (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_org_domain ON organizations (domain);
CREATE INDEX IF NOT EXISTS idx_profile_org ON profiles (organization_id);
CREATE INDEX IF NOT EXISTS idx_profile_email ON profiles (email);

-- Add statistics for query optimization
ANALYZE feedback_responses;
ANALYZE surveys;