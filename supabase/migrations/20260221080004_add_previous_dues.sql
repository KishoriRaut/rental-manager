-- Add fields to track previous month dues and grand total

ALTER TABLE public.monthly_billing 
ADD COLUMN previous_month_dues NUMERIC(10,2) DEFAULT 0,
ADD COLUMN grand_total NUMERIC(10,2) GENERATED ALWAYS AS (total_amount + previous_month_dues) STORED;

-- Update the remaining_due calculation to use grand_total
DROP TRIGGER IF EXISTS update_billing_updated_at ON public.monthly_billing;

-- Recreate the trigger with updated remaining_due calculation
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_billing_updated_at BEFORE UPDATE ON public.monthly_billing FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
