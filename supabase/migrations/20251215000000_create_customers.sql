-- Create Customer Category Enum
CREATE TYPE customer_category AS ENUM ('A', 'B', 'C', 'PROSPECT');

-- Create Customers Table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  address TEXT,
  lat FLOAT8,
  lng FLOAT8,
  website TEXT,
  phone TEXT,
  email TEXT,
  category customer_category DEFAULT 'PROSPECT',
  status TEXT DEFAULT 'active',
  next_visit TIMESTAMPTZ,
  assignee_id UUID REFERENCES auth.users(id)
);

-- Create Interactions Table
CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('call', 'visit', 'email', 'note')),
  notes TEXT,
  date TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- Create Policies (Simplified for MVP: Authenticated users can do everything)
CREATE POLICY "Enable all for authenticated users" ON customers
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable all for authenticated users" ON interactions
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
