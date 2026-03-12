-- =====================================================
-- SMART FUNDI SECURE BACKEND INFRASTRUCTURE
-- =====================================================

-- 1. Create ENUM types for roles and user types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'fundi', 'shop', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM ('trial', 'active', 'expired', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create smart_fundi_users table (extends auth.users)
CREATE TABLE IF NOT EXISTS smart_fundi_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'customer',
    verification_status verification_status DEFAULT 'pending',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    national_id TEXT,
    avatar_url TEXT,
    city TEXT,
    ward TEXT,
    bio TEXT,
    whatsapp TEXT,
    specialty TEXT[], -- For fundis
    shop_name TEXT, -- For shops
    shop_categories TEXT[], -- For shops
    opening_hours JSONB, -- For shops
    subscription_status subscription_status DEFAULT 'trial',
    trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
    subscription_ends_at TIMESTAMP WITH TIME ZONE,
    password_hash TEXT, -- bcrypt hashed password
    password_changed_at TIMESTAMP WITH TIME ZONE,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    phone_verified_at TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_login_ip TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create auth_sessions table for refresh tokens
CREATE TABLE IF NOT EXISTS auth_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES smart_fundi_users(id) ON DELETE CASCADE,
    refresh_token_hash TEXT NOT NULL UNIQUE,
    device_info TEXT,
    ip_address TEXT,
    user_agent TEXT,
    is_valid BOOLEAN DEFAULT TRUE,
    remember_me BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create rate_limits table for tracking API calls
CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier TEXT NOT NULL, -- IP address or user_id
    endpoint TEXT NOT NULL,
    request_count INTEGER DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    window_duration_minutes INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(identifier, endpoint, window_start)
);

-- 5. Create validation_logs table for security monitoring
CREATE TABLE IF NOT EXISTS validation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address TEXT,
    user_id UUID REFERENCES smart_fundi_users(id) ON DELETE SET NULL,
    endpoint TEXT NOT NULL,
    validation_type TEXT NOT NULL,
    input_data JSONB, -- Sanitized input that failed
    error_message TEXT NOT NULL,
    severity TEXT DEFAULT 'warning', -- 'info', 'warning', 'critical'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create rate_limit_violations table for admin review
CREATE TABLE IF NOT EXISTS rate_limit_violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    violation_count INTEGER DEFAULT 1,
    limit_exceeded INTEGER NOT NULL,
    window_minutes INTEGER NOT NULL,
    ip_address TEXT,
    user_id UUID REFERENCES smart_fundi_users(id) ON DELETE SET NULL,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES smart_fundi_users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Create verification_tokens table (email/phone)
CREATE TABLE IF NOT EXISTS verification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES smart_fundi_users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    verification_type TEXT NOT NULL, -- 'email' or 'phone'
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_smart_fundi_users_email ON smart_fundi_users(email);
CREATE INDEX IF NOT EXISTS idx_smart_fundi_users_phone ON smart_fundi_users(phone);
CREATE INDEX IF NOT EXISTS idx_smart_fundi_users_role ON smart_fundi_users(role);
CREATE INDEX IF NOT EXISTS idx_smart_fundi_users_city ON smart_fundi_users(city);
CREATE INDEX IF NOT EXISTS idx_smart_fundi_users_verification ON smart_fundi_users(verification_status);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_user ON auth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_token ON auth_sessions(refresh_token_hash);
CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup ON rate_limits(identifier, endpoint, window_start);
CREATE INDEX IF NOT EXISTS idx_validation_logs_created ON validation_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rate_limit_violations_created ON rate_limit_violations(created_at DESC);

-- 10. Enable RLS on all tables
ALTER TABLE smart_fundi_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE validation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limit_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;

-- 11. Create RLS policies for smart_fundi_users
CREATE POLICY "Users can view their own profile" ON smart_fundi_users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON smart_fundi_users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public can view verified fundis and shops" ON smart_fundi_users
    FOR SELECT USING (
        role IN ('fundi', 'shop') 
        AND verification_status = 'verified' 
        AND is_active = TRUE
    );

CREATE POLICY "Service role can manage all users" ON smart_fundi_users
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- 12. Create RLS policies for auth_sessions
CREATE POLICY "Users can view their own sessions" ON auth_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions" ON auth_sessions
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage sessions" ON auth_sessions
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- 13. Create RLS policies for rate_limits (service role only)
CREATE POLICY "Service role can manage rate limits" ON rate_limits
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- 14. Create RLS policies for validation_logs (admin only)
CREATE POLICY "Admins can view validation logs" ON validation_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM smart_fundi_users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Service role can manage validation logs" ON validation_logs
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- 15. Create RLS policies for rate_limit_violations (admin only)
CREATE POLICY "Admins can view rate limit violations" ON rate_limit_violations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM smart_fundi_users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Service role can manage rate limit violations" ON rate_limit_violations
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- 16. Create RLS policies for password_reset_tokens
CREATE POLICY "Service role can manage password reset tokens" ON password_reset_tokens
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- 17. Create RLS policies for verification_tokens
CREATE POLICY "Service role can manage verification tokens" ON verification_tokens
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- 18. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 19. Create triggers for updated_at
DROP TRIGGER IF EXISTS update_smart_fundi_users_updated_at ON smart_fundi_users;
CREATE TRIGGER update_smart_fundi_users_updated_at
    BEFORE UPDATE ON smart_fundi_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_rate_limits_updated_at ON rate_limits;
CREATE TRIGGER update_rate_limits_updated_at
    BEFORE UPDATE ON rate_limits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 20. Create function to check rate limits
CREATE OR REPLACE FUNCTION check_rate_limit(
    p_identifier TEXT,
    p_endpoint TEXT,
    p_max_requests INTEGER,
    p_window_minutes INTEGER
) RETURNS JSONB AS $$
DECLARE
    v_window_start TIMESTAMP WITH TIME ZONE;
    v_current_count INTEGER;
    v_result JSONB;
BEGIN
    -- Calculate window start (truncate to window boundary)
    v_window_start := date_trunc('minute', NOW()) - 
        (EXTRACT(MINUTE FROM NOW())::INTEGER % p_window_minutes) * INTERVAL '1 minute';
    
    -- Get or create rate limit record
    INSERT INTO rate_limits (identifier, endpoint, window_start, window_duration_minutes, request_count)
    VALUES (p_identifier, p_endpoint, v_window_start, p_window_minutes, 1)
    ON CONFLICT (identifier, endpoint, window_start) 
    DO UPDATE SET 
        request_count = rate_limits.request_count + 1,
        updated_at = NOW()
    RETURNING request_count INTO v_current_count;
    
    -- Check if limit exceeded
    IF v_current_count > p_max_requests THEN
        v_result := jsonb_build_object(
            'allowed', FALSE,
            'current_count', v_current_count,
            'max_requests', p_max_requests,
            'retry_after_seconds', EXTRACT(EPOCH FROM (v_window_start + (p_window_minutes * INTERVAL '1 minute') - NOW()))::INTEGER
        );
    ELSE
        v_result := jsonb_build_object(
            'allowed', TRUE,
            'current_count', v_current_count,
            'max_requests', p_max_requests,
            'remaining', p_max_requests - v_current_count
        );
    END IF;
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 21. Create function to log validation failures
CREATE OR REPLACE FUNCTION log_validation_failure(
    p_ip_address TEXT,
    p_user_id UUID,
    p_endpoint TEXT,
    p_validation_type TEXT,
    p_input_data JSONB,
    p_error_message TEXT,
    p_severity TEXT DEFAULT 'warning'
) RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO validation_logs (ip_address, user_id, endpoint, validation_type, input_data, error_message, severity)
    VALUES (p_ip_address, p_user_id, p_endpoint, p_validation_type, p_input_data, p_error_message, p_severity)
    RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 22. Create function to log rate limit violations
CREATE OR REPLACE FUNCTION log_rate_limit_violation(
    p_identifier TEXT,
    p_endpoint TEXT,
    p_limit_exceeded INTEGER,
    p_window_minutes INTEGER,
    p_ip_address TEXT,
    p_user_id UUID,
    p_user_agent TEXT
) RETURNS UUID AS $$
DECLARE
    v_violation_id UUID;
BEGIN
    INSERT INTO rate_limit_violations (identifier, endpoint, limit_exceeded, window_minutes, ip_address, user_id, user_agent)
    VALUES (p_identifier, p_endpoint, p_limit_exceeded, p_window_minutes, p_ip_address, p_user_id, p_user_agent)
    RETURNING id INTO v_violation_id;
    
    RETURN v_violation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 23. Create function to cleanup old rate limit records
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits() RETURNS void AS $$
BEGIN
    DELETE FROM rate_limits WHERE window_start < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 24. Create function to cleanup expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions() RETURNS void AS $$
BEGIN
    UPDATE auth_sessions SET is_valid = FALSE WHERE expires_at < NOW() AND is_valid = TRUE;
    DELETE FROM auth_sessions WHERE expires_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;