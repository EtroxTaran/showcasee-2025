-- Function for GF Stats (Global View)
CREATE OR REPLACE FUNCTION get_gf_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_revenue BIGINT;
  active_projects INTEGER;
  pipeline_breakdown JSONB;
BEGIN
  -- Check if user is GF or ADM
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('GF', 'ADM')
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- Total Revenue (Signed Opportunities)
  SELECT COALESCE(SUM(value), 0)
  INTO total_revenue
  FROM opportunities
  WHERE stage = 'signed';

  -- Active Projects
  SELECT COUNT(*)
  INTO active_projects
  FROM projects
  WHERE status = 'in_progress';

  -- Pipeline Breakdown
  SELECT jsonb_agg(t)
  INTO pipeline_breakdown
  FROM (
    SELECT stage, COUNT(*) as count, COALESCE(SUM(value), 0) as value
    FROM opportunities
    GROUP BY stage
  ) t;

  RETURN jsonb_build_object(
    'total_revenue', total_revenue,
    'active_projects', active_projects,
    'pipeline_breakdown', pipeline_breakdown
  );
END;
$$;

-- Function for Sales Stats (Personal View)
CREATE OR REPLACE FUNCTION get_sales_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  my_pipeline_value BIGINT;
  my_won_count INTEGER;
BEGIN
  -- My Pipeline Value (Open deals)
  -- Opportunities are linked to customers. Customers have assignee_id.
  -- Only count opportunities where customer is assigned to auth.uid()
  SELECT COALESCE(SUM(o.value), 0)
  INTO my_pipeline_value
  FROM opportunities o
  JOIN customers c ON o.customer_id = c.id
  WHERE c.assignee_id = auth.uid()
  AND o.stage NOT IN ('signed', 'lost'); -- Active pipeline

  -- My Won Count
  SELECT COUNT(*)
  INTO my_won_count
  FROM opportunities o
  JOIN customers c ON o.customer_id = c.id
  WHERE c.assignee_id = auth.uid()
  AND o.stage = 'signed';

  RETURN jsonb_build_object(
    'my_pipeline_value', my_pipeline_value,
    'my_won_count', my_won_count
  );
END;
$$;
