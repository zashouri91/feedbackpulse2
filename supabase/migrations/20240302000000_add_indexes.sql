-- Performance indexes for feedback responses
CREATE INDEX idx_feedback_responses_survey_rating ON feedback_responses (survey_id, rating);
CREATE INDEX idx_feedback_responses_created_at_survey ON feedback_responses (created_at, survey_id);
CREATE INDEX idx_feedback_responses_group ON feedback_responses (group_id);
CREATE INDEX idx_feedback_responses_location ON feedback_responses (location_id);
CREATE INDEX idx_feedback_responses_tracking ON feedback_responses (tracking_code);

-- Indexes for analytics queries
CREATE INDEX idx_feedback_responses_analytics ON feedback_responses (survey_id, created_at, rating);
CREATE INDEX idx_feedback_responses_reason ON feedback_responses (survey_id, reason);

-- Indexes for surveys
CREATE INDEX idx_surveys_active_org ON surveys (organization_id, is_active);
CREATE INDEX idx_surveys_created_at ON surveys (created_at);
CREATE INDEX idx_surveys_assigned_to ON surveys USING GIN (assigned_to);

-- Indexes for signatures
CREATE INDEX idx_signatures_user_survey ON signatures (user_id, survey_id);
CREATE INDEX idx_signatures_tracking ON signatures (tracking_code);

-- Indexes for profiles
CREATE INDEX idx_profiles_org_role ON profiles (organization_id, role);
CREATE INDEX idx_profiles_group ON profiles (group_id);
CREATE INDEX idx_profiles_location ON profiles (location_id);

-- Indexes for groups and locations
CREATE INDEX idx_groups_parent ON groups (parent_group_id);
CREATE INDEX idx_groups_org_name ON groups (organization_id, name);
CREATE INDEX idx_locations_org_name ON locations (organization_id, name);

-- Full text search indexes
CREATE INDEX idx_surveys_text_search ON surveys USING GIN (to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_feedback_responses_text_search ON feedback_responses USING GIN (to_tsvector('english', comment));

-- Partial indexes for common queries
CREATE INDEX idx_active_surveys ON surveys (organization_id) WHERE is_active = true;
CREATE INDEX idx_recent_feedback ON feedback_responses (survey_id, created_at) 
WHERE created_at >= NOW() - INTERVAL '30 days';

-- Add statistics for query optimization
ANALYZE feedback_responses;
ANALYZE surveys;
ANALYZE signatures;
ANALYZE profiles;
ANALYZE groups;
ANALYZE locations;