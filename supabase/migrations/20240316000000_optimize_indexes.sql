-- Drop duplicate indexes
DROP INDEX IF EXISTS idx_feedback_survey;  -- Covered by idx_feedback_responses_survey_rating
DROP INDEX IF EXISTS idx_feedback_created_at;  -- Covered by idx_feedback_responses_created_at_survey
DROP INDEX IF EXISTS idx_recent_feedback;  -- Covered by idx_feedback_responses_analytics

-- Optimize existing indexes
DROP INDEX IF EXISTS idx_feedback_responses_analytics;
CREATE INDEX idx_feedback_responses_analytics ON feedback_responses (
    survey_id,
    created_at DESC,  -- Add DESC for better performance on recent data queries
    rating,
    group_id,  -- Add group_id for group-based analytics
    location_id  -- Add location_id for location-based analytics
) INCLUDE (comment);  -- Include comment for full data retrieval without additional lookups

-- Add index for time-range queries with filters
CREATE INDEX idx_feedback_responses_time_filtered ON feedback_responses (
    created_at DESC,
    survey_id,
    rating
) WHERE rating IS NOT NULL;  -- Partial index for rated feedback only

-- Add index for group analytics
CREATE INDEX idx_feedback_responses_group_analytics ON feedback_responses (
    group_id,
    created_at DESC,
    rating
) INCLUDE (survey_id, location_id)
WHERE rating IS NOT NULL;

-- Add index for location analytics
CREATE INDEX idx_feedback_responses_location_analytics ON feedback_responses (
    location_id,
    created_at DESC,
    rating
) INCLUDE (survey_id, group_id)
WHERE rating IS NOT NULL;

-- Add index to improve survey join performance
CREATE INDEX idx_feedback_responses_survey_join ON feedback_responses (survey_id)
INCLUDE (rating, created_at);

-- Add statistics for query optimization
ANALYZE feedback_responses;
