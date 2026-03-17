-- Drop the existing function with its specific signature
DROP FUNCTION IF EXISTS log_validation_failure(text, uuid, text, text, jsonb, text, text);

-- Recreate with the simpler signature that matches our code
CREATE OR REPLACE FUNCTION log_validation_failure(
  p_user_id UUID,
  p_endpoint TEXT,
  p_field_name TEXT,
  p_error_type TEXT,
  p_ip_address TEXT,
  p_request_data JSONB DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  INSERT INTO validation_logs (user_id, endpoint, field_name, error_type, ip_address, request_data)
  VALUES (p_user_id, p_endpoint, p_field_name, p_error_type, p_ip_address, p_request_data);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION log_validation_failure(UUID, TEXT, TEXT, TEXT, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION log_validation_failure(UUID, TEXT, TEXT, TEXT, TEXT, JSONB) TO anon;