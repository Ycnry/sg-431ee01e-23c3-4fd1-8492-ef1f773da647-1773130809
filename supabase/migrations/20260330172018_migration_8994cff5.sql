-- Create super_agents table
CREATE TABLE super_agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  photo_url TEXT,
  region TEXT NOT NULL,
  city TEXT NOT NULL,
  bio TEXT,
  
  -- Onboarding stats
  fundis_onboarded INTEGER DEFAULT 0,
  shops_onboarded INTEGER DEFAULT 0,
  total_commission DECIMAL(12, 2) DEFAULT 0,
  
  -- Subscription
  subscription_status TEXT NOT NULL DEFAULT 'pending' CHECK (subscription_status IN ('pending', 'active', 'expired', 'suspended')),
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  last_payment_date TIMESTAMP WITH TIME ZONE,
  last_payment_amount DECIMAL(10, 2),
  payment_method TEXT CHECK (payment_method IN ('mpesa', 'tigopesa', 'airtel')),
  
  -- Verification
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP WITH TIME ZONE,
  national_id_number TEXT,
  id_document_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id),
  UNIQUE(phone)
);

-- Create index for faster lookups
CREATE INDEX idx_super_agents_user_id ON super_agents(user_id);
CREATE INDEX idx_super_agents_region ON super_agents(region);
CREATE INDEX idx_super_agents_subscription_status ON super_agents(subscription_status);
CREATE INDEX idx_super_agents_subscription_end_date ON super_agents(subscription_end_date);

-- Enable RLS
ALTER TABLE super_agents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can view active, verified super agents (for public listing)
CREATE POLICY "Anyone can view active super agents"
  ON super_agents FOR SELECT
  USING (subscription_status = 'active' AND is_verified = true);

-- Users can view their own super agent record regardless of status
CREATE POLICY "Users can view own super agent record"
  ON super_agents FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own super agent application
CREATE POLICY "Users can apply as super agent"
  ON super_agents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own super agent record
CREATE POLICY "Users can update own super agent record"
  ON super_agents FOR UPDATE
  USING (auth.uid() = user_id);