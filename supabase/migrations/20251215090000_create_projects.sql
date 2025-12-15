-- Create Project Status Enum
CREATE TYPE project_status AS ENUM ('planning', 'in_progress', 'completed', 'cancelled');

-- Create Projects Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  description TEXT,
  budget BIGINT DEFAULT 0,
  status project_status DEFAULT 'planning',
  start_date DATE,
  end_date DATE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
  owner_id UUID REFERENCES auth.users(id),
  milestones JSONB DEFAULT '[]'::jsonb
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Enable all for authenticated users" ON projects
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create updated_at trigger
CREATE TRIGGER handle_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE PROCEDURE moddatetime (updated_at);

-- Automation Trigger Function
CREATE OR REPLACE FUNCTION create_project_from_opportunity()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the stage changed to 'signed'
    IF NEW.stage = 'signed' AND (OLD.stage IS DISTINCT FROM 'signed') THEN
        INSERT INTO projects (
            name,
            budget,
            customer_id,
            opportunity_id,
            status,
            description,
             owner_id -- Assuming the opportunity might have an owner field or we use auth.uid() if executed by user, 
                     -- but for a trigger, auth.uid() is the user who updated the opportunity.
        )
        VALUES (
            NEW.title,
            NEW.value,
            NEW.customer_id,
            NEW.id,
            'planning',
            NEW.description,
            auth.uid() -- Assign the project to the user who closed the deal
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on Opportunities
CREATE TRIGGER on_opportunity_signed
    AFTER UPDATE ON opportunities
    FOR EACH ROW
    EXECUTE PROCEDURE create_project_from_opportunity();
