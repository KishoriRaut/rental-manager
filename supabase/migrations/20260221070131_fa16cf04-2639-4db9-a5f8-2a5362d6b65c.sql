
-- Houses table
CREATE TABLE public.houses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  floors INTEGER NOT NULL DEFAULT 1,
  rooms INTEGER NOT NULL DEFAULT 1,
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.houses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own houses" ON public.houses FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Tenants table
CREATE TABLE public.tenants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  citizenship_number TEXT,
  address TEXT,
  occupation TEXT,
  family_members INTEGER DEFAULT 0,
  house_id UUID NOT NULL REFERENCES public.houses(id) ON DELETE CASCADE,
  room_number TEXT NOT NULL,
  monthly_rent NUMERIC(10,2) NOT NULL DEFAULT 0,
  move_in_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own tenants" ON public.tenants FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Monthly billing table
CREATE TABLE public.monthly_billing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  house_id UUID NOT NULL REFERENCES public.houses(id) ON DELETE CASCADE,
  billing_month INTEGER NOT NULL CHECK (billing_month BETWEEN 1 AND 12),
  billing_year INTEGER NOT NULL,
  rent_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  -- Water bill
  water_bill_type TEXT NOT NULL DEFAULT 'fixed' CHECK (water_bill_type IN ('lump_sum', 'fixed', 'meter_based')),
  water_fixed_amount NUMERIC(10,2) DEFAULT 0,
  water_units NUMERIC(10,2) DEFAULT 0,
  water_rate NUMERIC(10,2) DEFAULT 0,
  water_total NUMERIC(10,2) GENERATED ALWAYS AS (
    CASE 
      WHEN water_bill_type = 'meter_based' THEN water_units * water_rate
      ELSE COALESCE(water_fixed_amount, 0)
    END
  ) STORED,
  -- Electricity bill
  electricity_bill_type TEXT NOT NULL DEFAULT 'fixed' CHECK (electricity_bill_type IN ('fixed', 'meter_based')),
  electricity_fixed_amount NUMERIC(10,2) DEFAULT 0,
  electricity_units NUMERIC(10,2) DEFAULT 0,
  electricity_rate NUMERIC(10,2) DEFAULT 0,
  electricity_total NUMERIC(10,2) GENERATED ALWAYS AS (
    CASE 
      WHEN electricity_bill_type = 'meter_based' THEN electricity_units * electricity_rate
      ELSE COALESCE(electricity_fixed_amount, 0)
    END
  ) STORED,
  -- Sanitation
  sanitation_charge NUMERIC(10,2) NOT NULL DEFAULT 0,
  -- Extras stored as JSONB array [{label, amount}]
  extra_charges JSONB DEFAULT '[]'::jsonb,
  -- Total (computed in app since generated columns can't reference JSONB easily)
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  -- Payment tracking
  paid_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  remaining_due NUMERIC(10,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('paid', 'partial', 'unpaid')),
  payment_date DATE,
  payment_mode TEXT CHECK (payment_mode IN ('cash', 'online')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_tenant_billing UNIQUE(tenant_id, billing_month, billing_year)
);

ALTER TABLE public.monthly_billing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own billing" ON public.monthly_billing FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_houses_updated_at BEFORE UPDATE ON public.houses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_billing_updated_at BEFORE UPDATE ON public.monthly_billing FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
