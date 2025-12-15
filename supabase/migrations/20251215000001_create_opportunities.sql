-- Create Opportunity Stage Enum
CREATE TYPE opportunity_stage AS ENUM ('lead', 'offered', 'negotiation', 'signed', 'lost');

-- Create Opportunities Table
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  title TEXT NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  value BIGINT DEFAULT 0, -- Store as cents or smallest unit if currency, but BIGINT is safe for now
  probability INT CHECK (probability >= 0 AND probability <= 100) DEFAULT 0,
  stage opportunity_stage DEFAULT 'lead',
  expected_close_date DAte,
  description TEXT
);

-- Enable Row Level Security
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Enable all for authenticated users" ON opportunities
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create updated_at trigger
CREATE EXTENSION IF NOT EXISTS moddatetime;

CREATE TRIGGER handle_opportunities_updated_at
    BEFORE UPDATE ON opportunities
    FOR EACH ROW
    EXECUTE PROCEDURE moddatetime (updated_at);
