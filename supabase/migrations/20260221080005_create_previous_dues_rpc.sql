-- Create RPC function to get previous month dues without serialization issues

CREATE OR REPLACE FUNCTION public.get_previous_month_dues(
  tenant_id UUID,
  billing_month INTEGER,
  billing_year INTEGER
)
RETURNS NUMERIC AS $$
DECLARE
  prev_remaining_due NUMERIC;
BEGIN
  SELECT remaining_due INTO prev_remaining_due
  FROM public.monthly_billing
  WHERE monthly_billing.tenant_id = get_previous_month_dues.tenant_id
    AND monthly_billing.billing_month = get_previous_month_dues.billing_month
    AND monthly_billing.billing_year = get_previous_month_dues.billing_year
  ORDER BY monthly_billing.created_at DESC
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN 0;
  END IF;
  
  RETURN prev_remaining_due;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_previous_month_dues TO authenticated;
